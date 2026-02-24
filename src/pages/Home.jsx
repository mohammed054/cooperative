/**
 * Home.jsx — Ghaim UAE Homepage
 *
 * Cinematic scroll architecture: GSAP + ScrollTrigger ONLY.
 * Scene registry drives order and configuration.
 * ScrollTrigger.refresh() called after:
 *   1. fonts.ready (layout reflow from custom fonts)
 *   2. window load (images loaded, dimensions stable)
 */
import React, { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { HOMEPAGE_SCENE_REGISTRY } from '../foundation/homepageFoundation'
import {
  CommandArrivalScene,
  AuthorityLedgerScene,
  SignatureReelScene,
  CapabilityMatrixScene,
  NarrativeBridgeScene,
  ProofTheaterScene,
  ConversionChamberScene,
  GlobalFooterScene,
} from '../components/homepage/HomeScenes'
import { OperationsSpineScene } from '../components/homepage/OperationsSpineScene'

gsap.registerPlugin(ScrollTrigger)

// Scene ID → component map
const SCENE_MAP = {
  'command-arrival':    CommandArrivalScene,
  'authority-ledger':   AuthorityLedgerScene,
  'signature-reel':     SignatureReelScene,
  'capability-matrix':  CapabilityMatrixScene,
  'operations-spine':   OperationsSpineScene,
  'narrative-bridge':   NarrativeBridgeScene,
  'proof-theater':      ProofTheaterScene,
  'conversion-chamber': ConversionChamberScene,
  'global-footer':      GlobalFooterScene,
}

export default function Home() {
  useEffect(() => {
    // 1. Refresh after custom fonts have loaded (avoids mis-measured line heights)
    document.fonts.ready.then(() => ScrollTrigger.refresh())

    // 2. Refresh after all resources (images) are loaded — ensures real heights
    if (document.readyState === 'complete') {
      ScrollTrigger.refresh()
    } else {
      const onLoad = () => ScrollTrigger.refresh()
      window.addEventListener('load', onLoad, { once: true })
      return () => window.removeEventListener('load', onLoad)
    }
  }, [])

  useEffect(() => {
    const root = document.querySelector('.flagship-home-cinematic')
    if (!root) return undefined

    const toneToColor = {
      deep: '#0d1622',
      dark: '#111926',
      steel: '#eef1f6',
      warm: '#f8f6f2',
      linen: '#faf8f4',
    }

    const triggers = HOMEPAGE_SCENE_REGISTRY.map(scene =>
      ScrollTrigger.create({
        trigger: `[data-scene-id="${scene.id}"]`,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          gsap.to(root, {
            '--home-scene-bg': toneToColor[scene.tone] || '#faf8f4',
            duration: 0.8,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        },
        onEnterBack: () => {
          gsap.to(root, {
            '--home-scene-bg': toneToColor[scene.tone] || '#faf8f4',
            duration: 0.8,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        },
      })
    )

    return () => {
      triggers.forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <main
      id="main-content"
      aria-label="Ghaim UAE Homepage"
      className="flagship-home-cinematic"
    >
      {HOMEPAGE_SCENE_REGISTRY.map((scene, sceneIndex) => {
        const Scene = SCENE_MAP[scene.id]
        if (!Scene) return null
        return (
          <Scene
            key={scene.id}
            scene={scene}
            sceneIndex={sceneIndex}
            sceneCount={HOMEPAGE_SCENE_REGISTRY.length}
          />
        )
      })}
    </main>
  )
}
