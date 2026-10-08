import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/data/projects'
import { ProjectVisual } from './visuals'
import { Tag } from '@/components/ui/Tag'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface ProjectCardProps {
  project: Project
  flip?: boolean
  onOpen: (p: Project) => void
}

/**
 * Large case-study row. The visual tilts toward the cursor, an arrow follows
 * the pointer, tags lift on hover and the big index swaps to the year.
 */
export function ProjectCard({ project, flip = false, onOpen }: ProjectCardProps) {
  const reduced = useReducedMotion()
  const frame = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const arrow = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState(false)

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType === 'touch') return
    const el = frame.current
    const vis = inner.current
    const ar = arrow.current
    if (!el || !vis || !ar) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const rx = (0.5 - py) * 8
    const ry = (px - 0.5) * 10
    el.style.transform = `perspective(1200px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
    vis.style.transform = `translate3d(${((px - 0.5) * 14).toFixed(1)}px, ${((py - 0.5) * 14).toFixed(1)}px, 0) scale(1.04)`
    ar.style.transform = `translate3d(${(e.clientX - r.left - 28).toFixed(0)}px, ${(e.clientY - r.top - 28).toFixed(0)}px, 0)`
  }

  const onLeave = () => {
    setHover(false)
    if (frame.current) frame.current.style.transform = ''
    if (inner.current) inner.current.style.transform = ''
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={cn('group relative grid grid-cols-12 items-center gap-y-8 lg:gap-x-12', flip && 'lg:[&>*:first-child]:order-2')}
      aria-labelledby={`project-${project.id}-title`}
    >
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-10 -inset-y-10 -z-10 rounded-[3rem] opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
        style={{ background: `radial-gradient(50% 50% at ${flip ? '70%' : '30%'} 50%, ${project.accent}14, transparent 70%)` }}
      />

      {/* visual */}
      <div className="col-span-12 lg:col-span-7">
        <div
          ref={frame}
          onPointerMove={onMove}
          onPointerEnter={() => setHover(true)}
          onPointerLeave={onLeave}
          className="relative transition-transform duration-500 ease-[var(--ease-out-expo)] will-change-transform [transform-style:preserve-3d]"
        >
          <button
            onClick={() => onOpen(project)}
            data-cursor="view"
            data-cursor-label="Open"
            aria-label={`Open case study: ${project.title}`}
            className="relative block w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-bg-2 p-2.5 text-left shadow-[0_40px_100px_-50px_rgba(0,0,0,0.9)] transition-colors duration-500 hover:border-white/20 sm:p-3"
          >
            <div className="overflow-hidden rounded-xl">
              <div ref={inner} className="transition-transform duration-700 ease-[var(--ease-out-expo)] will-change-transform">
                <ProjectVisual kind={project.visual} accent={project.accent} />
              </div>
            </div>

            {/* cursor-following arrow (desktop) */}
            <div
              ref={arrow}
              aria-hidden
              className={cn(
                'pointer-events-none absolute left-0 top-0 hidden h-14 w-14 items-center justify-center rounded-full bg-fg text-bg shadow-xl transition-opacity duration-300 lg:flex',
                hover ? 'opacity-100' : 'opacity-0',
              )}
            >
              <ArrowUpRight size={20} />
            </div>

            {/* corner meta */}
            <div className="pointer-events-none absolute bottom-5 left-5 flex items-center gap-2 sm:bottom-6 sm:left-6">
              <span className="rounded-full border border-white/10 bg-bg/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted backdrop-blur">
                {project.category}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* copy */}
      <div className={cn('col-span-12 lg:col-span-5', flip ? 'lg:pr-6' : 'lg:pl-2')}>
        <div className="relative mb-6 h-[4.5rem] overflow-hidden sm:h-[5.5rem]">
          <span
            className={cn(
              'absolute left-0 top-0 font-mono text-[4.5rem] leading-none tracking-[-0.06em] text-transparent transition-transform duration-700 ease-[var(--ease-out-expo)] sm:text-[5.5rem]',
              '[-webkit-text-stroke:1px_rgba(255,255,255,0.22)]',
              hover ? '-translate-y-full' : 'translate-y-0',
            )}
            aria-hidden
          >
            {project.index}
          </span>
          <span
            className={cn(
              'absolute left-0 top-0 font-mono text-[4.5rem] leading-none tracking-[-0.06em] transition-transform duration-700 ease-[var(--ease-out-expo)] sm:text-[5.5rem]',
              hover ? 'translate-y-0' : 'translate-y-full',
            )}
            style={{ color: project.accent }}
            aria-hidden
          >
            {project.year}
          </span>
        </div>

        <span className="label block">{project.category}</span>
        <h3 id={`project-${project.id}-title`} className="mt-3 text-4xl font-medium tracking-[-0.03em] text-fg sm:text-5xl">
          <button
            onClick={() => onOpen(project)}
            data-cursor="hover"
            className="link-underline text-left transition-colors hover:text-white"
          >
            {project.title}
          </button>
        </h3>
        <p className="mt-5 max-w-md text-base leading-relaxed text-muted">{project.description}</p>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
          {project.technologies.map((t, i) => (
            <li
              key={t}
              className="transition-transform duration-500 ease-[var(--ease-out-expo)]"
              style={{ transform: hover && !reduced ? 'translateY(-3px)' : 'none', transitionDelay: `${i * 40}ms` }}
            >
              <Tag>{t}</Tag>
            </li>
          ))}
        </ul>

        <button
          onClick={() => onOpen(project)}
          data-cursor="hover"
          className="group/cta mt-8 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-fg"
        >
          <span className="link-underline">View case study</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 transition-all duration-500 group-hover/cta:border-white/40 group-hover/cta:bg-white/[0.06]">
            <ArrowUpRight size={13} className="transition-transform duration-500 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
          </span>
        </button>
      </div>
    </motion.article>
  )
}
