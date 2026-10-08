export type Quality = 'low' | 'medium' | 'high'

export interface DeviceCapabilities {
  isTouch: boolean
  isMobile: boolean
  webgl: boolean
  quality: Quality
  prefersReducedMotion: boolean
  pixelRatio: number
}

/**
 * three.js (r163+) requires WebGL2. Devices with only WebGL1 get the 2D fallback.
 * We also verify the context actually works (some in-app browsers advertise it
 * but return a broken context) and release it immediately.
 */
function detectWebGL(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) as WebGL2RenderingContext | null
    if (!gl) return false
    const ok = typeof gl.getParameter === 'function' && !!gl.getParameter(gl.VERSION)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return ok
  } catch {
    return false
  }
}

/** Heuristic quality tier. Errs on the side of smoothness. */
export function detectCapabilities(): DeviceCapabilities {
  if (typeof window === 'undefined') {
    return {
      isTouch: false,
      isMobile: false,
      webgl: false,
      quality: 'medium',
      prefersReducedMotion: false,
      pixelRatio: 1,
    }
  }
  const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window
  const isMobile = window.innerWidth < 768 || (isTouch && window.innerWidth < 1024)
  const webgl = detectWebGL()
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const pixelRatio = window.devicePixelRatio || 1

  const nav = navigator as Navigator & { deviceMemory?: number; hardwareConcurrency?: number }
  const cores = nav.hardwareConcurrency ?? 4
  const memory = nav.deviceMemory ?? 4

  // iOS never exposes deviceMemory, so only downgrade on signals that are
  // actually present. Phones default to "medium", which still renders the
  // full story (fewer particles, capped DPR).
  let quality: Quality = 'high'
  if (isMobile) quality = 'medium'
  if (cores <= 2 || (nav.deviceMemory !== undefined && memory <= 2)) quality = 'low'
  else if (!isMobile && (cores <= 4 || (nav.deviceMemory !== undefined && memory <= 4))) quality = 'medium'

  return { isTouch, isMobile, webgl, quality, prefersReducedMotion, pixelRatio }
}
