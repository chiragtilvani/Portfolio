import { useEffect, useRef } from 'react'

/**
 * Magnetic hover: the element follows the pointer slightly while hovered.
 * No-op on touch devices or with reduced motion.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35, radius = 80) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    let active = false

    const tick = () => {
      cx += (tx - cx) * 0.18
      cy += (ty - cy) * 0.18
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05 || active) raf = requestAnimationFrame(tick)
      else el.style.transform = ''
    }

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const dist = Math.hypot(dx, dy)
      const limit = Math.max(r.width, r.height) / 2 + radius
      if (dist < limit) {
        active = true
        tx = dx * strength
        ty = dy * strength
      } else {
        active = false
        tx = 0
        ty = 0
      }
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(tick)
    }
    const onLeave = () => {
      active = false
      tx = 0
      ty = 0
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(tick)
    }

    const parent = el.parentElement ?? el
    parent.addEventListener('pointermove', onMove)
    parent.addEventListener('pointerleave', onLeave)
    return () => {
      parent.removeEventListener('pointermove', onMove)
      parent.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [strength, radius])

  return ref
}
