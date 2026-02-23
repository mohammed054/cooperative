import React, { useEffect } from 'react'
import {
  HOMEPAGE_SCENE_REGISTRY,
  HOMEPAGE_GRADIENT_BRIDGES,
  HOMEPAGE_FOUNDATION_ASSERTION, // FIX: import pre-computed assertion instead of re-running validation
} from '../foundation/homepageFoundation'
import { useAnalyticsContext } from '../hooks/useAnalyticsContext'
import useLenisScroll from '../hooks/useLenisScroll'
import {
  AuthorityLedgerScene,
  CapabilityMatrixScene,
  CommandArrivalScene,
  ConversionChamberScene,
  GlobalFooterScene,
  NarrativeBridgeScene,
  ProofTheaterScene,
  SignatureReelScene,
} from '../components/homepage/HomeScenes'
import { OperationsSpineScene } from '../components/homepage/OperationsSpineScene'

const SCENE_COMPONENT_REGISTRY = Object.freeze({
  'command-arrival': CommandArrivalScene,
  'authority-ledger': AuthorityLedgerScene,
  'signature-reel': SignatureReelScene,
  'capability-matrix': CapabilityMatrixScene,
  'operations-spine': OperationsSpineScene,
  'narrative-bridge': NarrativeBridgeScene,
  'proof-theater': ProofTheaterScene,
  'conversion-chamber': ConversionChamberScene,
  'global-footer': GlobalFooterScene,
})

const SCENE_IDS = HOMEPAGE_SCENE_REGISTRY.map(scene => scene.id)

const BRIDGE_BY_FROM_SCENE = new Map(
  HOMEPAGE_GRADIENT_BRIDGES.map(bridge => [bridge.fromSceneId, bridge])
)

const BRIDGE_CLASS_BY_TONE_FLOW = Object.freeze({
  'deep->dark': 'homepage-tone-bridge-deep-dark',
  'deep->steel': 'homepage-tone-bridge-deep-steel',
  'dark->dark': 'homepage-tone-bridge-dark-dark',
  'dark->steel': 'homepage-tone-bridge-dark-steel',
  'steel->dark': 'homepage-tone-bridge-steel-dark',
  'steel->warm': 'homepage-tone-bridge-steel-warm',
  'warm->linen': 'homepage-tone-bridge-warm-linen',
  'linen->dark': 'homepage-tone-bridge-linen-dark',
  'dark->deep': 'homepage-tone-bridge-dark-deep',
})

const getBridgeClassName = bridge => {
  const key = `${bridge.fromTone}->${bridge.toTone}`
  return BRIDGE_CLASS_BY_TONE_FLOW[key] || 'homepage-tone-bridge-soft'
}

// FIX: Removed duplicate PINNED_RHYTHM_ASSERTION — this logic already lives in
// homepageFoundation.js. Duplicating it here created conflicting error messages
// and ran the same validation twice on every page load.

// FIX: Use the pre-computed assertion exported from homepageFoundation.js
// instead of calling validateHomepageFoundation() a second time.
if (!HOMEPAGE_FOUNDATION_ASSERTION.isValid) {
  throw new Error(
    `Homepage foundation invalid before cinematic render: ${HOMEPAGE_FOUNDATION_ASSERTION.issues.join(' | ')}`
  )
}

// FIX: Simple ErrorBoundary to prevent one broken scene from crashing the whole page.
class SceneErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // In production wire this to your error reporting service (Sentry, etc.)
    console.error(`[SceneErrorBoundary] Scene "${this.props.sceneId}" crashed:`, error, info)
  }

  render() {
    if (this.state.hasError) {
      // Render an invisible placeholder that preserves page flow without exposing errors
      return (
        <div
          aria-hidden="true"
          style={{ minHeight: '100vh', background: 'var(--color-surface, #f6f7f9)' }}
          data-scene-error-fallback={this.props.sceneId}
        />
      )
    }
    return this.props.children
  }
}

const Home = () => {
  const analytics = useAnalyticsContext()
  const commandScene = HOMEPAGE_SCENE_REGISTRY.find(scene => scene.id === 'command-arrival')
  const authorityScene = HOMEPAGE_SCENE_REGISTRY.find(scene => scene.id === 'authority-ledger')
  const authorityBridge = BRIDGE_BY_FROM_SCENE.get('authority-ledger')
  const downstreamScenes = HOMEPAGE_SCENE_REGISTRY.filter(
    scene => scene.id !== 'command-arrival' && scene.id !== 'authority-ledger'
  )

  useLenisScroll()

  useEffect(() => {
    if (typeof window === 'undefined' || !analytics?.trackEvent) return

    const seen = new Set()
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const id = entry.target.id
          if (!id || seen.has(id)) return

          seen.add(id)
          analytics.trackEvent(
            'scene_view',
            'Homepage Cinematic Scene',
            id,
            SCENE_IDS.indexOf(id) + 1
          )
        })
      },
      { threshold: 0.45 }
    )

    SCENE_IDS.forEach(id => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [analytics])

  return (
    <div className="flagship-home flagship-home-cinematic">
      {/* CommandArrival renders AuthorityLedger inline — they share one scroll context */}
      <SceneErrorBoundary sceneId="command-arrival+authority-ledger">
        {commandScene && authorityScene ? (
          <CommandArrivalScene scene={commandScene} nextScene={authorityScene} />
        ) : null}
      </SceneErrorBoundary>

      {authorityBridge ? (
        <div
          aria-hidden="true"
          className={`homepage-tone-bridge ${getBridgeClassName(authorityBridge)}`}
          data-bridge-id={authorityBridge.id}
          data-bridge-from={authorityBridge.fromTone}
          data-bridge-to={authorityBridge.toTone}
        />
      ) : null}

      {downstreamScenes.map(scene => {
        const SceneComponent = SCENE_COMPONENT_REGISTRY[scene.id]
        const bridge = BRIDGE_BY_FROM_SCENE.get(scene.id)
        if (!SceneComponent) return null
        return (
          <React.Fragment key={scene.id}>
            {/* FIX: Each scene is isolated — a crash in one won't destroy the page */}
            <SceneErrorBoundary sceneId={scene.id}>
              <SceneComponent scene={scene} />
            </SceneErrorBoundary>
            {bridge ? (
              <div
                aria-hidden="true"
                className={`homepage-tone-bridge ${getBridgeClassName(bridge)}`}
                data-bridge-id={bridge.id}
                data-bridge-from={bridge.fromTone}
                data-bridge-to={bridge.toTone}
              />
            ) : null}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default Home