import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/constants'
import { profile } from '@/data/profile'
import { socials } from '@/data/socials'
import { cn, scrollToId } from '@/lib/utils'
import { useActiveSection } from '@/hooks/useActiveSection'

/**
 * Floating glass navigation. Shrinks on scroll; collapses to a full-screen
 * animated menu on mobile.
 */
export function Navbar({ visible }: { visible: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('menu-open')
    }
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    // allow the menu to close before scrolling on mobile
    setTimeout(() => scrollToId(id), open ? 250 : 0)
  }

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={visible ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-[70] flex justify-center px-4 pt-4 sm:px-6 sm:pt-5"
      >
        <nav
          aria-label="Primary"
          className={cn(
            'glass-strong flex w-full max-w-[1400px] items-center justify-between rounded-full transition-all duration-500 ease-[var(--ease-out-expo)]',
            scrolled ? 'h-12 px-3 pl-5 sm:h-13' : 'h-14 px-3 pl-6 sm:h-16 sm:pl-7',
          )}
        >
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault()
              go('hero')
            }}
            data-cursor="hover"
            className="font-mono text-[12px] font-medium tracking-[0.22em] text-fg"
            aria-label={`${profile.name} — back to top`}
          >
            {profile.shortName}
          </a>

          <ul className="hidden items-center gap-1 md:flex" role="list">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.id || (item.id === 'experience' && active === 'education')
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      go(item.id)
                    }}
                    data-cursor="hover"
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'relative rounded-full px-4 py-2 text-[13.5px] tracking-tight transition-colors duration-300',
                      isActive ? 'text-fg' : 'text-muted hover:text-fg',
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-white/[0.06]"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                go('contact')
              }}
              data-cursor="hover"
              className={cn(
                'group hidden items-center gap-1.5 rounded-full bg-fg font-medium text-bg transition-all duration-300 hover:bg-white sm:inline-flex',
                scrolled ? 'h-8 px-4 text-[12.5px]' : 'h-9 px-4.5 text-[13px]',
              )}
            >
              Let&apos;s Talk
              <ArrowUpRight size={14} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              data-cursor="hover"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 md:hidden"
            >
              <span
                className={cn(
                  'absolute h-px w-4 bg-fg transition-transform duration-500 ease-[var(--ease-out-expo)]',
                  open ? 'rotate-45' : '-translate-y-[3px]',
                )}
              />
              <span
                className={cn(
                  'absolute h-px w-4 bg-fg transition-transform duration-500 ease-[var(--ease-out-expo)]',
                  open ? '-rotate-45' : 'translate-y-[3px]',
                )}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[65] flex flex-col bg-bg/95 px-6 pb-10 pt-28 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0 round 0 0 32px 32px)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0 round 0 0 0px 0px)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0 round 0 0 32px 32px)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            role="dialog"
            aria-label="Menu"
          >
            <ul className="flex flex-col gap-1" role="list">
              {NAV_ITEMS.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      go(item.id)
                    }}
                    className="flex items-baseline justify-between border-b border-white/[0.08] py-4 text-[2.4rem] font-medium leading-none tracking-[-0.03em] text-fg"
                  >
                    <span>{item.label}</span>
                    <span className="font-mono text-[11px] tracking-[0.2em] text-muted">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="mt-auto flex items-end justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex flex-col gap-2">
                {socials.map((s) => (
                  <a key={s.id} href={s.href} target="_blank" rel="noreferrer" className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                    {s.label} ↗
                  </a>
                ))}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-2">{profile.location}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
