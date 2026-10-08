import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { GitFork, Star, ArrowUpRight } from 'lucide-react'
import { GithubIcon } from '@/components/ui/BrandIcons'
import { generateContributions, languageShare, repos, GITHUB_DATA_IS_PLACEHOLDER } from '@/data/github'
import { stats } from '@/data/stats'
import { socialById } from '@/data/socials'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal, Stagger } from '@/components/ui/Reveal'
import { staggerItem } from '@/lib/motion'
import { Tag } from '@/components/ui/Tag'
import { TechLabel } from '@/components/ui/Decor'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const LEVELS = ['bg-white/[0.05]', 'bg-accent/25', 'bg-accent/45', 'bg-accent/70', 'bg-accent']
const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduced = useReducedMotion()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (reduced) {
      setN(value)
      return
    }
    const start = performance.now()
    const dur = 1400
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur)
      setN(Math.round(value * (1 - Math.pow(1 - t, 3))))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, reduced])
  return (
    <span ref={ref} className="tabular-nums">
      {n}
      <span className="text-accent">{suffix}</span>
    </span>
  )
}

export function GitHub() {
  const weeks = useMemo(() => generateContributions(), [])
  const total = useMemo(() => weeks.flat().filter((v) => v > 0).length * 2 + 118, [weeks])
  const [tip, setTip] = useState<{ w: number; d: number; v: number } | null>(null)

  return (
    <section id="github" className="section-pad relative" aria-labelledby="github-heading">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            index="06"
            label="Built in public"
            title={<span id="github-heading">Code is where the ideas become real.</span>}
            className="mb-0 lg:max-w-3xl"
          />
          <Reveal delay={0.2}>
            <a
              href={socialById.github.href}
              target="_blank"
              rel="noreferrer"
              data-cursor="hover"
              className="group inline-flex items-center gap-3 rounded-full border border-white/10 px-5 py-3 text-sm text-fg transition-colors hover:border-white/30"
            >
              <GithubIcon size={16} />
              {socialById.github.handle}
              <ArrowUpRight size={14} className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </Reveal>
        </div>

        {/* stats */}
        <Stagger className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] md:grid-cols-4" stagger={0.08}>
          {stats.map((s) => (
            <motion.div key={s.label} variants={staggerItem} className="bg-bg px-6 py-7 sm:px-8 sm:py-9">
              <div className="text-4xl font-medium tracking-[-0.04em] text-fg sm:text-5xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </div>
              <div className="label mt-3">{s.label}</div>
            </motion.div>
          ))}
        </Stagger>

        <div className="mt-6 grid grid-cols-12 gap-6">
          {/* contribution graph */}
          <Reveal className="col-span-12 lg:col-span-8" y={28}>
            <div className="glass relative rounded-2xl p-5 sm:p-7">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-fg">
                  <span className="font-medium">{total}</span> <span className="text-muted">contributions in the last year</span>
                </span>
                {GITHUB_DATA_IS_PLACEHOLDER && <Tag tone="violet">Demo data</Tag>}
              </div>

              <div className="overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="min-w-[640px]">
                  <div className="mb-1.5 grid pl-7" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
                    {MONTHS.map((m) => (
                      <span key={m} className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-2">
                        {m}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <div className="flex flex-col justify-between py-0.5 font-mono text-[9px] text-muted-2">
                      <span>Mon</span>
                      <span>Wed</span>
                      <span>Fri</span>
                    </div>
                    <div
                      className="grid flex-1 gap-[3px]"
                      style={{ gridTemplateColumns: 'repeat(52, minmax(0, 1fr))' }}
                      role="img"
                      aria-label="Contribution calendar (demo data)"
                      onMouseLeave={() => setTip(null)}
                    >
                      {weeks.map((week, w) => (
                        <div key={w} className="grid gap-[3px]" style={{ gridTemplateRows: 'repeat(7, 1fr)' }}>
                          {week.map((v, d) => (
                            <motion.span
                              key={d}
                              initial={{ opacity: 0, scale: 0.6 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: Math.min(0.9, w * 0.012 + d * 0.004), duration: 0.35 }}
                              onMouseEnter={() => setTip({ w, d, v })}
                              className={cn('aspect-square rounded-[2px] transition-colors hover:ring-1 hover:ring-white/50', LEVELS[v])}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="h-4 font-mono text-[10px] text-muted">
                  {tip ? `${tip.v === 0 ? 'No' : tip.v * 2} contributions · week ${tip.w + 1}, day ${tip.d + 1}` : 'Hover a cell'}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-muted-2">
                  Less
                  {LEVELS.map((l) => (
                    <span key={l} className={cn('h-2.5 w-2.5 rounded-[2px]', l)} />
                  ))}
                  More
                </span>
              </div>
            </div>
          </Reveal>

          {/* languages */}
          <Reveal className="col-span-12 lg:col-span-4" delay={0.1} y={28}>
            <div className="glass flex h-full flex-col rounded-2xl p-5 sm:p-7">
              <span className="label">Languages</span>
              <div className="mt-5 flex h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                {languageShare.map((l) => (
                  <motion.span
                    key={l.name}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${l.percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    style={{ background: l.color }}
                    className="h-full"
                  />
                ))}
              </div>
              <ul className="mt-5 space-y-2.5">
                {languageShare.map((l) => (
                  <li key={l.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2.5 text-fg/85">
                      <span className="h-2 w-2 rounded-full" style={{ background: l.color }} />
                      {l.name}
                    </span>
                    <span className="font-mono text-[12px] text-muted">{l.percent}%</span>
                  </li>
                ))}
              </ul>
              <TechLabel className="mt-auto pt-6">Placeholder · replace with real data</TechLabel>
            </div>
          </Reveal>
        </div>

        {/* repos */}
        <Stagger className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {repos.map((r) => (
            <motion.a
              key={r.name}
              variants={staggerItem}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              data-cursor="hover"
              className="group flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.015] p-5 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.035]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-[13px] text-fg">
                  <span className="text-muted">chiragtilwani/</span>
                  {r.name}
                </span>
                <ArrowUpRight size={15} className="shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{r.description}</p>
              <div className="mt-auto flex items-center gap-4 pt-5 font-mono text-[11px] text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: r.languageColor }} />
                  {r.language}
                </span>
                <span className="flex items-center gap-1">
                  <Star size={11} /> {r.stars}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork size={11} /> {r.forks}
                </span>
                <span className="ml-auto hidden text-muted-2 sm:inline">{r.updated}</span>
              </div>
            </motion.a>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
