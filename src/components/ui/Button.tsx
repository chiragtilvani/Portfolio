import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMagnetic } from '@/hooks/useMagnetic'

type Variant = 'primary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface BaseProps {
  variant?: Variant
  size?: Size
  icon?: 'arrow' | 'external' | 'none'
  magnetic?: boolean
  children: ReactNode
  className?: string
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }
type AnchorProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-[var(--ease-out-expo)] select-none whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none'

const variants: Record<Variant, string> = {
  primary:
    'bg-fg text-bg hover:bg-white hover:shadow-[0_0_0_1px_rgba(255,255,255,0.4),0_12px_40px_-12px_rgba(79,195,255,0.55)] active:scale-[0.98]',
  ghost: 'text-fg hover:text-white',
  outline:
    'border border-white/15 text-fg hover:border-white/40 hover:bg-white/[0.04] active:scale-[0.98]',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-6 text-[14px]',
  lg: 'h-12 px-7 text-[15px] sm:h-13 sm:px-8',
}

function Icon({ kind }: { kind: BaseProps['icon'] }) {
  if (kind === 'none') return null
  if (kind === 'external')
    return (
      <ArrowUpRight
        size={16}
        className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    )
  return (
    <ArrowRight
      size={16}
      className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
    />
  )
}

/**
 * Primary interactive element. Renders an <a> when `href` is provided.
 * Magnetic by default on fine-pointer devices.
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps | AnchorProps>(function Button(
  { variant = 'primary', size = 'md', icon = 'arrow', magnetic = true, children, className, ...rest },
  _ref,
) {
  const magneticRef = useMagnetic<HTMLDivElement>(magnetic ? 0.3 : 0, magnetic ? 60 : 0)
  const classes = cn(base, variants[variant], sizes[size], className)

  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      <Icon kind={icon} />
    </>
  )

  return (
    <div ref={magneticRef} className="inline-block will-change-transform">
      {'href' in rest && rest.href !== undefined ? (
        <a data-cursor="hover" className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {inner}
        </a>
      ) : (
        <button data-cursor="hover" className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
          {inner}
        </button>
      )}
    </div>
  )
})
