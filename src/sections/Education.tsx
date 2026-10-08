import { motion } from 'motion/react'
import { GraduationCap } from 'lucide-react'
import { education } from '@/data/education'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal, Stagger } from '@/components/ui/Reveal'
import { staggerItem } from '@/lib/motion'
import { CornerMarks, TechLabel } from '@/components/ui/Decor'
import { cn } from '@/lib/utils'

/** Fraction of the degree completed, based on today's date (Aug start). */
function degreeProgress(start: number, end: number) {
  const s = new Date(start, 7, 1).getTime()
  const e = new Date(end, 5, 1).getTime()
  return Math.min(1, Math.max(0, (Date.now() - s) / (e - s)))
}

export function Education() {
  const progress = degreeProgress(education.start, education.end)
  const semesters = (education.end - education.start) * 2
  const completed = Math.floor(progress * semesters)
  const year = Math.min(education.end - education.start, Math.floor(progress * (education.end - education.start)) + 1)
  const R = 54
  const C = 2 * Math.PI * R

  return (
    <section id="education" className="section-pad relative" aria-labelledby="education-heading">
      <div className="container-x">
        <SectionHeader index="05" label="Education" title={<span id="education-heading">Foundations.</span>} className="mb-12 md:mb-16" />

        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          {/* degree card */}
          <Reveal className="col-span-12 lg:col-span-7" y={30}>
            <div className="glass relative h-full rounded-3xl p-7 sm:p-10">
              <CornerMarks className="m-3" />
              <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="label flex items-center gap-2">
                    <GraduationCap size={13} /> {education.start} — {education.end}
                  </span>
                  <h3 className="mt-4 text-3xl font-medium tracking-[-0.03em] text-fg sm:text-4xl">
                    {education.degree}
                    <span className="block text-muted">{education.field}</span>
                  </h3>
                  <p className="mt-4 text-[15px] text-fg/80">{education.institution}</p>
                  <p className="mt-1 text-sm text-muted">{education.location}</p>
                  <ul className="mt-7 space-y-2.5">
                    {education.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-[14.5px] text-muted">
                        <span className="mt-[9px] h-px w-3 shrink-0 bg-accent" aria-hidden />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* progress ring */}
                <div className="relative shrink-0 self-center sm:self-start">
                  <svg viewBox="0 0 128 128" className="h-36 w-36" role="img" aria-label={`Degree ${Math.round(progress * 100)}% complete`}>
                    <circle cx="64" cy="64" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r={R}
                      fill="none"
                      stroke="url(#eduGrad)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray={C}
                      initial={{ strokeDashoffset: C }}
                      whileInView={{ strokeDashoffset: C * (1 - progress) }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                      transform="rotate(-90 64 64)"
                    />
                    <defs>
                      <linearGradient id="eduGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#4fc3ff" />
                        <stop offset="1" stopColor="#8b7cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-2">Year</span>
                    <span className="text-3xl font-medium tracking-tight text-fg">
                      {year}
                      <span className="text-muted">/{education.end - education.start}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* semester strip */}
              <div className="mt-10 border-t border-white/[0.08] pt-6">
                <div className="mb-3 flex items-center justify-between">
                  <TechLabel>Semesters</TechLabel>
                  <TechLabel>
                    {completed} / {semesters} complete
                  </TechLabel>
                </div>
                <div className="grid grid-cols-8 gap-1.5">
                  {Array.from({ length: semesters }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                      style={{ transformOrigin: 'left' }}
                      className={cn('h-1.5 rounded-full', i < completed ? 'bg-accent' : i === completed ? 'bg-accent/40' : 'bg-white/[0.08]')}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* coursework */}
          <Reveal className="col-span-12 lg:col-span-5" delay={0.1} y={30}>
            <div className="h-full rounded-3xl border border-white/[0.08] p-7 sm:p-10">
              <span className="label">Relevant coursework</span>
              <Stagger className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1" stagger={0.06}>
                {education.coursework.map((c, i) => (
                  <motion.div
                    key={c.code}
                    variants={staggerItem}
                    className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.015] px-4 py-3 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.04]"
                  >
                    <span className="text-[14.5px] text-fg/85">{c.name}</span>
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-[10px] tracking-[0.18em] text-muted-2">{String(i + 1).padStart(2, '0')}</span>
                      <span className="rounded-md border border-white/10 px-1.5 py-0.5 font-mono text-[10px] tracking-[0.12em] text-muted transition-colors group-hover:border-accent/40 group-hover:text-accent">
                        {c.code}
                      </span>
                    </span>
                  </motion.div>
                ))}
              </Stagger>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
