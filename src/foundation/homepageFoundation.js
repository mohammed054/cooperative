import { MOTION_TOKEN_CONTRACT } from '../motion/motionTokenContract.js'

/**
 * @typedef {'deep'|'dark'|'steel'|'warm'|'linen'} ToneKey
 * @typedef {'free'|'pinned'} SceneMode
 *
 * @typedef {Object} SceneMediaPlaceholder
 * @property {'video'|'image-sequence'|'media-collection'|'map-nodes'} type
 * @property {string} key
 * @property {string | string[]} ref
 *
 * @typedef {Object} SceneDefinition
 * @property {string} id
 * @property {ToneKey} tone
 * @property {number} length
 * @property {SceneMode} mode
 * @property {string} entryCue
 * @property {string} exitCue
 * @property {string | null} ctaSlot
 * @property {SceneMediaPlaceholder} mediaPlaceholder
 */

export const TONE_STATE_MACHINE = Object.freeze({
  tokens: Object.freeze({
    deep: '#F6F7F9',
    dark: '#FFFFFF',
    steel: '#EEF1F6',
    warm: '#F8F6F2',
    linen: '#FFFFFF',
  }),
  flow: Object.freeze([
    'deep',
    'dark',
    'dark',
    'steel',
    'steel',
    'warm',
    'linen',
    'deep',
    'deep',
  ]),
})

export const SCENE_DEFINITION_SCHEMA = Object.freeze({
  id: 'string',
  tone: "ToneKey ('deep'|'dark'|'steel'|'warm'|'linen')",
  length: 'number (vh units)',
  mode: "SceneMode ('free'|'pinned')",
  entryCue: 'string',
  exitCue: 'string',
  ctaSlot: 'string | null',
  mediaPlaceholder: {
    type: "('video'|'image-sequence'|'media-collection'|'map-nodes')",
    key: 'string',
    ref: 'string | string[]',
  },
})

export const SCENE_DEFINITION_TEMPLATE = Object.freeze({
  id: 'scene-id',
  tone: 'deep',
  length: 100,
  mode: 'free',
  entryCue: 'scene-entry-cue',
  exitCue: 'scene-exit-cue',
  ctaSlot: null,
  mediaPlaceholder: {
    type: 'video',
    key: 'placeholder-key',
    ref: 'placeholder-ref',
  },
})

/**
 * Homepage scene registry (foundation-only, no scene content).
 * Locked order for Phase 2 scaffold:
 * 1. CommandArrival
 * 2. AuthorityLedger
 * 3. SignatureReel (pinned)
 * 4. CapabilityMatrix
 * 5. OperationsSpine (pinned)
 * 6. NarrativeBridge
 * 7. ProofTheater
 * 8. ConversionChamber
 * 9. GlobalFooter
 */
export const HOMEPAGE_SCENE_REGISTRY = Object.freeze([
  // Free hero lock with micro-pause after initial authority reveal; deep tone.
  // Pin status: free
  {
    id: 'command-arrival',
    tone: 'deep',
    length: 110,
    mode: 'free',
    entryCue: 'hero-pre-roll',
    exitCue: 'hero-lock-release',
    ctaSlot: 'soft-primary',
    mediaPlaceholder: {
      type: 'video',
      key: 'hero-video',
      ref: '/videos/background.mp4',
    },
  },
  // Free evidence ledger scan; dark tone, accelerated comprehension rhythm.
  // Pin status: free
  {
    id: 'authority-ledger',
    tone: 'dark',
    length: 85,
    mode: 'free',
    entryCue: 'ledger-evidence-rise',
    exitCue: 'ledger-handoff',
    ctaSlot: null,
    mediaPlaceholder: {
      type: 'media-collection',
      key: 'authority-ledger-media',
      ref: ['authority-ledger-01', 'authority-ledger-02'],
    },
  },
  // Pinned horizontal reel progression; dark tone.
  // Pin status: pinned
  {
    id: 'signature-reel',
    tone: 'dark',
    length: 220,
    mode: 'pinned',
    entryCue: 'reel-pre-pin-buffer',
    exitCue: 'reel-release-snap',
    ctaSlot: 'mid-journey',
    mediaPlaceholder: {
      type: 'image-sequence',
      key: 'project-reel-images',
      ref: [
        'project-reel-01',
        'project-reel-02',
        'project-reel-03',
      ],
    },
  },
  // Free technical matrix read; steel tone introduces denser information plane.
  // Pin status: free
  {
    id: 'capability-matrix',
    tone: 'steel',
    length: 100,
    mode: 'free',
    entryCue: 'matrix-lateral-reveal',
    exitCue: 'matrix-collapse',
    ctaSlot: null,
    mediaPlaceholder: {
      type: 'media-collection',
      key: 'capability-media',
      ref: ['capability-01', 'capability-02', 'capability-03'],
    },
  },
  // Pinned operations sequence; steel tone with controlled friction depth.
  // Pin status: pinned
  {
    id: 'operations-spine',
    tone: 'steel',
    length: 240,
    mode: 'pinned',
    entryCue: 'spine-pre-pin-buffer',
    exitCue: 'spine-release',
    ctaSlot: 'post-step-three',
    mediaPlaceholder: {
      type: 'media-collection',
      key: 'operations-spine-media',
      ref: ['spine-01', 'spine-02', 'spine-03', 'spine-04'],
    },
  },
  // Free narrative release handoff; warm tone reduces tension after pinned depth.
  // Pin status: free
  {
    id: 'narrative-bridge',
    tone: 'warm',
    length: 75,
    mode: 'free',
    entryCue: 'bridge-decompress',
    exitCue: 'bridge-soft-release',
    ctaSlot: null,
    mediaPlaceholder: {
      type: 'media-collection',
      key: 'narrative-bridge-media',
      ref: ['bridge-ambient-01'],
    },
  },
  // Free social proof theater; linen tone for trust readability.
  // Pin status: free
  {
    id: 'proof-theater',
    tone: 'linen',
    length: 120,
    mode: 'free',
    entryCue: 'proof-stage-open',
    exitCue: 'proof-logo-carry',
    ctaSlot: 'proof-reinforcement',
    mediaPlaceholder: {
      type: 'media-collection',
      key: 'testimonial-media',
      ref: [
        'testimonial-media-01',
        'testimonial-media-02',
        'testimonial-media-03',
      ],
    },
  },
  // Free conversion chamber; deep tone consolidates final action state.
  // Pin status: free
  {
    id: 'conversion-chamber',
    tone: 'deep',
    length: 120,
    mode: 'free',
    entryCue: 'conversion-panel-arm',
    exitCue: 'conversion-submit-release',
    ctaSlot: 'hard-conversion',
    mediaPlaceholder: {
      type: 'media-collection',
      key: 'conversion-media',
      ref: ['conversion-panel-01'],
    },
  },
  // Free footer continuity scene; deep tone inheritance prevents white banding.
  // Pin status: free
  {
    id: 'global-footer',
    tone: 'deep',
    length: 70,
    mode: 'free',
    entryCue: 'footer-tone-carry',
    exitCue: 'footer-terminal',
    ctaSlot: 'utility',
    mediaPlaceholder: {
      type: 'media-collection',
      key: 'footer-media',
      ref: ['footer-brand-mark'],
    },
  },
])

export const HOMEPAGE_GRADIENT_BRIDGES = Object.freeze([
  {
    id: 'bridge-dark-to-steel',
    fromSceneId: 'signature-reel',
    toSceneId: 'capability-matrix',
    fromTone: 'dark',
    toTone: 'steel',
  },
  {
    id: 'bridge-steel-to-warm',
    fromSceneId: 'operations-spine',
    toSceneId: 'narrative-bridge',
    fromTone: 'steel',
    toTone: 'warm',
  },
  {
    id: 'bridge-linen-to-deep',
    fromSceneId: 'proof-theater',
    toSceneId: 'conversion-chamber',
    fromTone: 'linen',
    toTone: 'deep',
  },
])

export const HOMEPAGE_FOUNDATION = Object.freeze({
  motionTokens: MOTION_TOKEN_CONTRACT,
  tones: TONE_STATE_MACHINE,
  sceneSchema: SCENE_DEFINITION_SCHEMA,
  sceneTemplate: SCENE_DEFINITION_TEMPLATE,
  scenes: HOMEPAGE_SCENE_REGISTRY,
  bridges: HOMEPAGE_GRADIENT_BRIDGES,
})

const VALID_MODES = new Set(['free', 'pinned'])
const REQUIRED_PINNED_IDS = new Set(['signature-reel', 'operations-spine'])
const EXPECTED_SCENE_COUNT = 9
const MAX_BRIDGE_COUNT = 3

export const validateHomepageFoundation = foundation => {
  const issues = []
  const scenes = foundation.scenes || []
  const bridges = foundation.bridges || []
  const flow = foundation.tones?.flow || []

  if (scenes.length !== EXPECTED_SCENE_COUNT) {
    issues.push(
      `Scene registry must contain ${EXPECTED_SCENE_COUNT} scenes; received ${scenes.length}.`
    )
  }

  const ids = scenes.map(scene => scene.id)
  const uniqueIds = new Set(ids)
  if (uniqueIds.size !== ids.length) {
    issues.push('Scene registry contains duplicate IDs.')
  }

  const tones = scenes.map(scene => scene.tone)
  if (tones.join('>') !== flow.join('>')) {
    issues.push('Tone flow does not match locked tone state machine.')
  }

  if (!scenes.every(scene => VALID_MODES.has(scene.mode))) {
    issues.push("Every scene mode must be either 'free' or 'pinned'.")
  }

  const pinnedIds = scenes.filter(scene => scene.mode === 'pinned').map(scene => scene.id)
  if (pinnedIds.length !== REQUIRED_PINNED_IDS.size) {
    issues.push(
      `Pinned scene count must be ${REQUIRED_PINNED_IDS.size}; received ${pinnedIds.length}.`
    )
  }

  REQUIRED_PINNED_IDS.forEach(id => {
    if (!pinnedIds.includes(id)) {
      issues.push(`Pinned scene '${id}' is missing from registry.`)
    }
  })

  if (bridges.length > MAX_BRIDGE_COUNT) {
    issues.push(
      `Bridge count exceeds maximum of ${MAX_BRIDGE_COUNT}; received ${bridges.length}.`
    )
  }

  bridges.forEach(bridge => {
    const fromScene = scenes.find(scene => scene.id === bridge.fromSceneId)
    const toScene = scenes.find(scene => scene.id === bridge.toSceneId)

    if (!fromScene || !toScene) {
      issues.push(`Bridge '${bridge.id}' references unknown scene IDs.`)
      return
    }

    if (fromScene.tone !== bridge.fromTone || toScene.tone !== bridge.toTone) {
      issues.push(`Bridge '${bridge.id}' tone mapping does not match scene tones.`)
    }
  })

  return Object.freeze({
    isValid: issues.length === 0,
    issues: Object.freeze(issues),
  })
}

export const HOMEPAGE_FOUNDATION_ASSERTION = validateHomepageFoundation(HOMEPAGE_FOUNDATION)

if (!HOMEPAGE_FOUNDATION_ASSERTION.isValid) {
  throw new Error(
    `Homepage foundation validation failed: ${HOMEPAGE_FOUNDATION_ASSERTION.issues.join(' | ')}`
  )
}
