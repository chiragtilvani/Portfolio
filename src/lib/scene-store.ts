/**
 * Tiny mutable store shared between the DOM world and the Three.js world.
 * Kept outside React state on purpose: these values change every frame and
 * must never trigger re-renders.
 */
export const pointer = {
  /** normalized -1..1 (x right, y up) */
  x: 0,
  y: 0,
  /** raw screen position */
  sx: 0,
  sy: 0,
}

export const scrollState = {
  y: 0,
  /** 0..1 page progress */
  progress: 0,
  /** velocity in px/frame, decays */
  velocity: 0,
}

/**
 * Story stage of the Digital Core.
 *   0 → HERO     (compact core)
 *   1 → SKILLS   (expands into nodes)
 *   2 → WORK     (becomes interface panels)
 *   3 → CONTACT  (calm glowing sphere)
 * Fractional values interpolate between stages.
 */
export const story = {
  stage: 0,
  /** horizontal offset target for the object (-1 left … 1 right) */
  x: 1,
  /** vertical offset in world units */
  y: 0,
  /** overall scale multiplier */
  scale: 0.82,
  /** visibility multiplier for the whole 3D object */
  opacity: 1,
  /** active section id */
  section: 'hero',
}

export interface StoryAnchor {
  id: string
  stage: number
  x: number
  y: number
  scale: number
  opacity: number
}

export const STORY_ANCHORS: StoryAnchor[] = [
  { id: 'hero', stage: 0, x: 1, y: 0.05, scale: 0.82, opacity: 1 },
  { id: 'about', stage: 0.35, x: -1.2, y: 0, scale: 0.8, opacity: 0.3 },
  { id: 'skills', stage: 1, x: 1.3, y: 0, scale: 0.7, opacity: 0.4 },
  { id: 'work', stage: 2, x: 1.3, y: 0, scale: 0.55, opacity: 0.28 },
  { id: 'experience', stage: 2.2, x: -1.25, y: 0, scale: 0.55, opacity: 0.2 },
  { id: 'education', stage: 2.4, x: 1.25, y: 0, scale: 0.55, opacity: 0.2 },
  { id: 'github', stage: 2.6, x: -1.25, y: 0, scale: 0.55, opacity: 0.16 },
  { id: 'lab', stage: 2.8, x: 1.25, y: 0, scale: 0.6, opacity: 0.16 },
  { id: 'contact', stage: 3, x: 0.05, y: -0.3, scale: 0.78, opacity: 0.75 },
]
