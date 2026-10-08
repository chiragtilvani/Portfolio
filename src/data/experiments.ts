/**
 * ──────────────────────────────────────────────────────────────
 * CREATIVE LAB — mini interactive experiments.
 * Each `kind` maps to a component in components/experiments.
 * ──────────────────────────────────────────────────────────────
 */
export type ExperimentKind = 'particles' | 'object3d' | 'typography' | 'glass' | 'dataviz'

export interface Experiment {
  index: string
  kind: ExperimentKind
  title: string
  description: string
  tech: string[]
}

export const experiments: Experiment[] = [
  {
    index: '01',
    kind: 'particles',
    title: 'Particle field',
    description: 'A canvas particle system that reacts to the cursor with soft repulsion and connection lines.',
    tech: ['Canvas 2D', 'rAF'],
  },
  {
    index: '02',
    kind: 'object3d',
    title: 'Rotating object',
    description: 'A lightweight WebGL object with glass material, lit by a procedural environment.',
    tech: ['Three.js', 'R3F'],
  },
  {
    index: '03',
    kind: 'typography',
    title: 'Animated typography',
    description: 'Letters that scramble, settle and respond to hover with per-character motion.',
    tech: ['Motion', 'CSS'],
  },
  {
    index: '04',
    kind: 'glass',
    title: 'Interactive glass card',
    description: 'A tilt-reactive card with a specular highlight that tracks the pointer.',
    tech: ['CSS 3D', 'Pointer events'],
  },
  {
    index: '05',
    kind: 'dataviz',
    title: 'Mini data visualization',
    description: 'A hand-drawn SVG chart with animated paths and a hover-following readout.',
    tech: ['SVG', 'Motion'],
  },
]
