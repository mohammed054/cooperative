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

  return (
    <main id="main-content" aria-label="Ghaim UAE Homepage">
      {HOMEPAGE_SCENE_REGISTRY.map(scene => {
        const Scene = SCENE_MAP[scene.id]
        if (!Scene) return null
        return <Scene key={scene.id} scene={scene} />
      })}
    </main>
  )
}