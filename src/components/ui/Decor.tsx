import { cn } from '@/lib/utils'

/** Tiny technical coordinate / metadata label used in corners of sections. */
export function TechLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('pointer-events-none select-none font-mono text-[10px] uppercase tracking-[0.2em] text-muted-2', className)}>
      {children}
    </span>
  )
}

/** Thin corner marks — four small L-shapes at the corners of a container. */
export function CornerMarks({ className }: { className?: string }) {
  const c = 'absolute h-3 w-3 border-white/25'
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0', className)}>
      <span className={cn(c, 'left-0 top-0 border-l border-t')} />
      <span className={cn(c, 'right-0 top-0 border-r border-t')} />
      <span className={cn(c, 'bottom-0 left-0 border-b border-l')} />
      <span className={cn(c, 'bottom-0 right-0 border-b border-r')} />
    </div>
  )
}

/** Horizontal hairline divider with optional center label. */
export function Divider({ label, className }: { label?: string; className?: string }) {
  return (
    <div className={cn('container-x flex items-center gap-4', className)} aria-hidden>
      <span className="h-px flex-1 bg-white/[0.08]" />
      {label && <span className="label">{label}</span>}
      {label && <span className="h-px flex-1 bg-white/[0.08]" />}
    </div>
  )
}

/** Live status pill: ● AVAILABLE FOR … */
export function StatusDot({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted',
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
      </span>
      {children}
    </span>
  )
}
