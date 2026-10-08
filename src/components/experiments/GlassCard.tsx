import { useRef } from 'react'
import { profile } from '@/data/profile'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/** Tilt-reactive glass card with a pointer-tracking specular highlight. */
export function GlassCard() {
  const card = useRef<HTMLDivElement>(null)
  const shine = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return
    const el = card.current
    const sh = shine.current
    if (!el || !sh) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.transform = `rotateX(${((0.5 - py) * 18).toFixed(2)}deg) rotateY(${((px - 0.5) * 22).toFixed(2)}deg)`
    sh.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.22), rgba(255,255,255,0.04) 35%, transparent 60%)`
  }
  const onLeave = () => {
    if (card.current) card.current.style.transform = ''
    if (shine.current) shine.current.style.background = ''
  }

  return (
    <div
      className="flex h-full w-full items-center justify-center [perspective:900px] [touch-action:none]"
      onPointerMove={onMove}
      onPointerDown={onMove}
      onPointerLeave={onLeave}
      onPointerUp={onLeave}
    >
      <div
        ref={card}
        className="relative h-44 w-72 rounded-2xl border border-white/15 bg-white/[0.04] p-5 shadow-[0_30px_60px_-30px_rgba(79,195,255,0.35)] backdrop-blur-xl transition-transform duration-300 ease-out [transform-style:preserve-3d]"
        style={{ backgroundImage: 'linear-gradient(135deg, rgba(79,195,255,0.12), rgba(139,124,246,0.08))' }}
      >
        <div ref={shine} className="pointer-events-none absolute inset-0 rounded-2xl transition-[background] duration-150" aria-hidden />
        <div className="flex items-start justify-between [transform:translateZ(30px)]">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">Dev pass</span>
          <span className="h-6 w-9 rounded-md border border-white/20 bg-gradient-to-br from-amber-200/60 to-amber-500/40" aria-hidden />
        </div>
        <div className="mt-6 [transform:translateZ(40px)]">
          <div className="text-lg font-medium tracking-tight text-fg">{profile.name}</div>
          <div className="text-[12px] text-muted">{profile.title}</div>
        </div>
        <div className="mt-5 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-muted-2 [transform:translateZ(20px)]">
          <span>ID · 2023-2027</span>
          <span className="text-success">● ACTIVE</span>
        </div>
      </div>
    </div>
  )
}
