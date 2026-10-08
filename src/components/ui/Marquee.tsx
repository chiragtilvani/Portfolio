import { cn } from '@/lib/utils'

interface MarqueeProps {
  items: readonly string[]
  className?: string
}

/**
 * Infinite horizontal strip of technical labels. Pure CSS animation, pauses on
 * hover and is frozen under prefers-reduced-motion via the global rule.
 */
export function Marquee({ items, className }: MarqueeProps) {
  const row = [...items, ...items]
  return (
    <div
      className={cn('relative overflow-hidden border-y border-white/[0.06] py-4', className)}
      aria-label={`Core stack: ${items.join(', ')}`}
      role="marquee"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent" aria-hidden />
      <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]" aria-hidden>
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-10 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
            {item}
            <span className="h-1 w-1 rounded-full bg-accent/70" />
          </span>
        ))}
      </div>
    </div>
  )
}
