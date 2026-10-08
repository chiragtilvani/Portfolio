import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from './Reveal'

interface SectionHeaderProps {
  index: string
  label: string
  title: ReactNode
  subtitle?: ReactNode
  align?: 'left' | 'center'
  className?: string
  /** Render the heading as h2 (default) or h3 */
  as?: 'h2' | 'h3'
}

/**
 * Standard section intro: "01 — ABOUT" label + oversized heading + optional subtitle.
 */
export function SectionHeader({ index, label, title, subtitle, align = 'left', className, as = 'h2' }: SectionHeaderProps) {
  const Heading = as
  return (
    <div className={cn('mb-14 md:mb-20', align === 'center' && 'text-center', className)}>
      <Reveal>
        <div className={cn('mb-5 flex items-center gap-3', align === 'center' && 'justify-center')}>
          <span className="font-mono text-[11px] tracking-[0.22em] text-accent">{index}</span>
          <span className="h-px w-8 bg-white/20" aria-hidden />
          <span className="label">{label}</span>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <Heading className="text-balance text-[2.4rem] font-medium leading-[1.02] tracking-[-0.03em] text-fg sm:text-5xl md:text-6xl lg:text-[4.4rem]">
          {title}
        </Heading>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.16}>
          <p className={cn('mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg', align === 'center' && 'mx-auto')}>
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  )
}
