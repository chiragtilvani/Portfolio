import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TagProps {
  children: ReactNode
  className?: string
  tone?: 'default' | 'accent' | 'violet'
  size?: 'sm' | 'md'
}

/** Small technology / metadata chip. */
export function Tag({ children, className, tone = 'default', size = 'sm' }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-mono uppercase tracking-[0.14em] transition-colors duration-300',
        size === 'sm' ? 'px-2.5 py-1 text-[10px]' : 'px-3 py-1.5 text-[11px]',
        tone === 'default' && 'border-white/10 bg-white/[0.03] text-muted hover:border-white/25 hover:text-fg',
        tone === 'accent' && 'border-accent/30 bg-accent/10 text-accent',
        tone === 'violet' && 'border-violet/30 bg-violet/10 text-violet',
        className,
      )}
    >
      {children}
    </span>
  )
}
