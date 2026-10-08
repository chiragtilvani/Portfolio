import { useEffect, useRef } from 'react'
import { useIsInView } from '@/hooks/useIsInView'

interface P {
  x: number
  y: number
  vx: number
  vy: number
}

/** Canvas 2D particle field with pointer repulsion and proximity links. */
export function ParticleField() {
  const { ref: wrap, inView } = useIsInView<HTMLDivElement>()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrap.current
    if (!canvas || !wrapper || !inView) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(1.5, window.devicePixelRatio || 1)
    let w = 0
    let h = 0
    const mouse = { x: -9999, y: -9999 }
    const count = window.innerWidth < 768 ? 60 : 110
    let pts: P[] = []

    const resize = () => {
      const r = wrapper.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }))
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrapper)

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }
    wrapper.addEventListener('pointermove', onMove)
    wrapper.addEventListener('pointerdown', onMove)
    wrapper.addEventListener('pointerleave', onLeave)
    wrapper.addEventListener('pointerup', onLeave)

    let raf = 0
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const link = 90
      for (const p of pts) {
        if (!reduced) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const d2 = dx * dx + dy * dy
          if (d2 < 120 * 120) {
            const d = Math.sqrt(d2) || 1
            const f = (1 - d / 120) * 0.9
            p.vx += (dx / d) * f
            p.vy += (dy / d) * f
          }
          p.vx *= 0.96
          p.vy *= 0.96
          p.x += p.vx
          p.y += p.vy
          if (p.x < 0 || p.x > w) p.vx *= -1
          if (p.y < 0 || p.y > h) p.vy *= -1
        }
      }
      ctx.lineWidth = 1
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i]
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < link * link) {
            const alpha = (1 - Math.sqrt(d2) / link) * 0.35
            ctx.strokeStyle = `rgba(79,195,255,${alpha.toFixed(3)})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      for (const p of pts) {
        ctx.fillStyle = 'rgba(245,245,245,0.85)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      wrapper.removeEventListener('pointermove', onMove)
      wrapper.removeEventListener('pointerdown', onMove)
      wrapper.removeEventListener('pointerleave', onLeave)
      wrapper.removeEventListener('pointerup', onLeave)
    }
  }, [inView, wrap])

  return (
    <div ref={wrap} className="relative h-full w-full [touch-action:pan-y]" data-cursor="hidden">
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden />
      <span className="pointer-events-none absolute bottom-3 left-4 font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted-2">
        move your cursor · or touch
      </span>
    </div>
  )
}
