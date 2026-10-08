import { useEffect, useRef } from 'react'

/**
 * Custom cursor: a small dot + a lagging ring that expands over interactive
 * elements. Mounted only on fine-pointer devices (see App).
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring || !label) return

    document.documentElement.classList.add('has-cursor')

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let rx = x
    let ry = y
    let scale = 1
    let targetScale = 1
    let visible = false
    let raf = 0
    let mode: 'default' | 'hover' | 'view' | 'hidden' = 'default'

    const setMode = (m: typeof mode, text = '') => {
      mode = m
      targetScale = m === 'hover' ? 2.4 : m === 'view' ? 4.2 : 1
      label.textContent = text
      ring.dataset.mode = m
      dot.style.opacity = m === 'view' || m === 'hidden' ? '0' : '1'
      ring.style.opacity = m === 'hidden' ? '0' : '1'
    }

    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      if (!visible) {
        visible = true
        rx = x
        ry = y
        dot.style.opacity = '1'
        ring.style.opacity = '1'
      }
      const t = e.target as HTMLElement | null
      const view = t?.closest<HTMLElement>('[data-cursor="view"]')
      const hover = t?.closest<HTMLElement>('[data-cursor="hover"], a, button, [role="button"], input, textarea, select, label')
      const hide = t?.closest<HTMLElement>('[data-cursor="hidden"]')
      if (hide) setMode('hidden')
      else if (view) setMode('view', view.dataset.cursorLabel ?? 'View')
      else if (hover) setMode('hover')
      else if (mode !== 'default') setMode('default')
    }

    const tick = () => {
      rx += (x - rx) * 0.16
      ry += (y - ry) * 0.16
      scale += (targetScale - scale) * 0.16
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`
      raf = requestAnimationFrame(tick)
    }

    const onLeave = () => {
      dot.style.opacity = '0'
      ring.style.opacity = '0'
      visible = false
    }
    const onDown = () => {
      targetScale = Math.max(0.7, targetScale * 0.8)
    }
    const onUp = () => setMode(mode)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-fg opacity-0 mix-blend-difference will-change-transform"
      />
      <div
        ref={ringRef}
        aria-hidden
        data-mode="default"
        className="pointer-events-none fixed left-0 top-0 z-[100] flex h-8 w-8 items-center justify-center rounded-full border border-white/70 opacity-0 transition-[background-color,border-color] duration-300 will-change-transform data-[mode=hover]:border-white/40 data-[mode=view]:border-transparent data-[mode=view]:bg-fg mix-blend-difference"
      >
        <span ref={labelRef} className="font-sans text-[3px] font-medium tracking-wide text-bg" />
      </div>
    </>
  )
}
