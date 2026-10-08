export type Quality = 'low' | 'medium' | 'high'

export interface DeviceCapabilities {
  isTouch: boolean
  isMobile: boolean
  webgl: boolean
  quality: Quality
  prefersReducedMotion: boolean
  pixelRatio: number
}

function detectWebGL(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    return !!gl
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

  let quality: Quality = 'high'
  if (isMobile) quality = 'medium'
  if (cores <= 4 || memory <= 4) quality = quality === 'high' ? 'medium' : 'low'
  if (cores <= 2 || memory <= 2) quality = 'low'

  return { isTouch, isMobile, webgl, quality, prefersReducedMotion, pixelRatio }
}
