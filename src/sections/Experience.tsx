import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { Briefcase, Code2, MapPin } from 'lucide-react'
import { experience } from '@/data/experience'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Tag } from '@/components/ui/Tag'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function Experience() {
  const ref = useRef<HTMLOListElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })
  const scaleY = useTransform(smooth, [0, 1], [0, 1])

  return (
    <section id="experience" className="section-pad relative" aria-labelledby="experience-heading">
      <div className="container-x">
        <SectionHeader
          index="04"
          label="Experience"
          title={<span id="experience-heading">Where I&apos;ve been learning.</span>}
          subtitle="Internships and independent work so far. Early-career, hands-on, and growing."
        />

        <ol ref={ref} className="relative" role="list">
          {/* rail */}
          <div className="absolute bottom-0 left-[11px] top-0 w-px bg-white/[0.08] md:left-1/2 md:-translate-x-1/2" aria-hidden />
          <motion.div
            style={{ scaleY: reduced ? 1 : scaleY, transformOrigin: 'top' }}
            className="absolute bottom-0 left-[11px] top-0 w-px bg-gradient-to-b from-accent via-accent to-violet md:left-1/2 md:-translate-x-1/2"
            aria-hidden
          />

          {experience.map((item, i) => {
            const right = i % 2 === 0
            return (
              <li key={item.id} className={cn('relative grid grid-cols-12 gap-x-6 pb-16 last:pb-0 md:pb-20', i === 0 && 'pt-2')}>
                {/* node */}
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-accent/50 bg-bg md:left-1/2 md:-translate-x-1/2"
                  aria-hidden
                >
                  <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_14px_2px_rgba(79,195,255,0.6)]" />
                </motion.span>

                {/* year */}
                <motion.div
                  initial={{ opacity: 0, x: right ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    'col-span-12 pl-10 md:col-span-6 md:pl-0',
                    right ? 'md:order-1 md:pr-14 md:text-right' : 'md:order-2 md:pl-14 md:text-left',
                  )}
                >
                  <span className="font-mono text-[clamp(1.8rem,4vw,3rem)] leading-none tracking-[-0.04em] text-fg/90">{item.period}</span>
                  <span className="mt-2 hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-2 md:flex md:justify-end [li:nth-child(even)_&]:md:justify-start">
                    {item.type === 'internship' ? <Briefcase size={11} /> : <Code2 size={11} />}
                    {item.type}
                  </span>
                </motion.div>

                {/* card */}
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className={cn('col-span-12 mt-5 pl-10 md:col-span-6 md:mt-0 md:pl-0', right ? 'md:order-2 md:pl-14' : 'md:order-1 md:pr-14')}
                >
                  <div className="glass group rounded-2xl p-6 transition-colors duration-500 hover:border-white/20 sm:p-7">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-medium tracking-tight text-fg sm:text-2xl">{item.role}</h3>
                        <p className="mt-1 text-[15px] text-fg/80">{item.company}</p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                        <MapPin size={11} /> {item.location}
                      </span>
                    </div>
                    <p className="mt-4 text-[15px] leading-relaxed text-muted">{item.description}</p>
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
                      {item.technologies.map((t, k) => (
                        <motion.li
                          key={t}
                          initial={{ opacity: 0, y: 8 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + k * 0.06, duration: 0.5 }}
                        >
                          <Tag>{t}</Tag>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
