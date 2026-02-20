import React, { useEffect } from 'react'
import {
  HOMEPAGE_SCENE_REGISTRY,
  HOMEPAGE_GRADIENT_BRIDGES,
  validateHomepageFoundation,
  HOMEPAGE_FOUNDATION,
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
  OperationsSpineScene,
  ProofTheaterScene,
  SignatureReelScene,
} from '../components/homepage/HomeSceneSkeletons'

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
  'dark->steel': 'homepage-tone-bridge-dark-steel',
  'steel->warm': 'homepage-tone-bridge-steel-warm',
  'linen->dark': 'homepage-tone-bridge-linen-dark',
})

const getBridgeClassName = bridge => {
  const key = `${bridge.fromTone}->${bridge.toTone}`
  return BRIDGE_CLASS_BY_TONE_FLOW[key] || 'homepage-tone-bridge-soft'
}

const PINNED_RHYTHM_ASSERTION = Object.freeze(() => {
  const issues = []
  const pinnedIndexes = HOMEPAGE_SCENE_REGISTRY.map((scene, index) =>
    scene.mode === 'pinned' ? index : -1
  ).filter(index => index >= 0)

  pinnedIndexes.forEach((index, offset) => {
    const nextPinnedIndex = pinnedIndexes[offset + 1]
    if (typeof nextPinnedIndex !== 'number') return
    if (nextPinnedIndex - index <= 1) {
      issues.push(
        `Pinned rhythm violation: '${HOMEPAGE_SCENE_REGISTRY[index].id}' is back-to-back with '${HOMEPAGE_SCENE_REGISTRY[nextPinnedIndex].id}'.`
      )
    }
  })

  if (!HOMEPAGE_SCENE_REGISTRY.some(scene => scene.mode === 'pinned')) {
    issues.push('Pinned friction points missing from registry.')
  }

  return Object.freeze({
    isValid: issues.length === 0,
    issues: Object.freeze(issues),
  })
})

const foundationValidation = validateHomepageFoundation(HOMEPAGE_FOUNDATION)
const rhythmValidation = PINNED_RHYTHM_ASSERTION()

if (!foundationValidation.isValid) {
  throw new Error(
    `Homepage foundation invalid before cinematic render: ${foundationValidation.issues.join(' | ')}`
  )
}

if (!rhythmValidation.isValid) {
  throw new Error(
    `Pinned rhythm validation failed: ${rhythmValidation.issues.join(' | ')}`
  )
}

const Home = () => {
  const analytics = useAnalyticsContext()

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
      {HOMEPAGE_SCENE_REGISTRY.map(scene => {
        const SceneComponent = SCENE_COMPONENT_REGISTRY[scene.id]
        const bridge = BRIDGE_BY_FROM_SCENE.get(scene.id)
        if (!SceneComponent) return null
        return (
          <React.Fragment key={scene.id}>
            <SceneComponent scene={scene} />
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
