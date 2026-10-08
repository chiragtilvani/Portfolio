import { ArrowUp } from 'lucide-react'
import { profile } from '@/data/profile'
import { socials } from '@/data/socials'
import { scrollToId } from '@/lib/utils'

const YEAR = new Date().getFullYear()

export function Footer() {
  const year = YEAR
  return (
    <footer className="relative border-t border-white/[0.08]">
      <div className="container-x flex flex-col gap-10 py-12 md:flex-row md:items-end md:justify-between md:py-16">
        <div>
          <span className="font-mono text-[12px] tracking-[0.22em] text-fg">{profile.shortName}</span>
          <p className="mt-4 max-w-xs text-sm text-muted">{profile.footerLine}</p>
          <p className="mt-6 font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted-2">
            © {year} {profile.name}
          </p>
        </div>

        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:gap-16">
          <ul className="flex flex-col gap-3" role="list">
            {socials.map((s) => (
              <li key={s.id}>
                <a
                  href={s.href}
                  target={s.id === 'email' ? undefined : '_blank'}
                  rel="noreferrer"
                  data-cursor="hover"
                  className="link-underline text-sm text-muted transition-colors hover:text-fg"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            onClick={() => scrollToId('hero')}
            data-cursor="hover"
            className="group inline-flex items-center gap-3 self-start font-mono text-[11px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-fg sm:self-auto"
          >
            Back to top
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 transition-colors group-hover:border-white/40">
              <ArrowUp size={14} className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5" />
            </span>
          </button>
        </div>
      </div>
      <div className="container-x flex items-center justify-between pb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-2">
        <span>{profile.coordinates}</span>
        <span className="hidden sm:inline">{profile.tagline}</span>
        <span>{profile.timezone}</span>
      </div>
    </footer>
  )
}
