import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react'
import { GithubIcon } from '@/components/ui/BrandIcons'
import type { Project } from '@/data/projects'
import { Modal } from '@/components/ui/Modal'
import { ProjectVisual } from './visuals'
import { Tag } from '@/components/ui/Tag'
import { Button } from '@/components/ui/Button'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
  onNavigate: (dir: 1 | -1) => void
  position: { index: number; total: number }
}

const SECTIONS: { key: keyof Project['caseStudy']; label: string }[] = [
  { key: 'problem', label: 'The problem' },
  { key: 'approach', label: 'The approach' },
  { key: 'technology', label: 'The technology' },
  { key: 'challenge', label: 'The challenge' },
  { key: 'result', label: 'The result' },
]

/** Full-screen case study. */
export function ProjectModal({ project, onClose, onNavigate, position }: ProjectModalProps) {
  return (
    <Modal open={!!project} onClose={onClose} label={project ? `${project.title} case study` : 'Project'}>
      {project && (
        <article className="-mt-14 px-5 pb-10 pt-4 sm:px-10 sm:pb-14" style={{ '--accent': project.accent } as React.CSSProperties}>
          <header className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] tracking-[0.22em] text-accent">{project.index}</span>
              <span className="h-px w-8 bg-white/20" aria-hidden />
              <span className="label">{project.category}</span>
              <span className="label ml-auto hidden sm:inline">{project.year}</span>
            </div>
            <h2 className="mt-5 text-4xl font-medium tracking-[-0.03em] text-fg sm:text-6xl">{project.title}</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">{project.description}</p>
          </header>

          <div className="mt-10 overflow-hidden rounded-2xl border border-white/[0.08] bg-bg p-2 sm:p-3">
            <ProjectVisual kind={project.visual} accent={project.accent} mode="full" />
          </div>

          <div className="mt-12 grid grid-cols-12 gap-x-10 gap-y-10">
            <div className="col-span-12 space-y-10 lg:col-span-8">
              {SECTIONS.map((s) => (
                <section key={s.key} aria-labelledby={`cs-${project.id}-${s.key}`}>
                  <h3 id={`cs-${project.id}-${s.key}`} className="label mb-3">
                    {s.label}
                  </h3>
                  <p className="text-[15.5px] leading-relaxed text-fg/85 sm:text-base">{project.caseStudy[s.key]}</p>
                </section>
              ))}
            </div>

            <aside className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <div>
                  <h3 className="label mb-3">Technology</h3>
                  <ul className="flex flex-wrap gap-2">
                    {project.technologies.map((t) => (
                      <li key={t}>
                        <Tag tone="accent">{t}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="label mb-3">Features</h3>
                  <ul className="space-y-2">
                    {project.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-fg/85">
                        <span className="h-1 w-1 rounded-full bg-accent" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-2.5 pt-2">
                  <Button href={project.github} target="_blank" rel="noreferrer" icon="none" variant="outline" magnetic={false} className="w-full">
                    <span className="inline-flex items-center gap-2">
                      <GithubIcon size={15} /> GitHub
                    </span>
                  </Button>
                  <Button href={project.live} target="_blank" rel="noreferrer" icon="none" magnetic={false} className="w-full">
                    <span className="inline-flex items-center gap-2">
                      <ExternalLink size={15} /> Live demo
                    </span>
                  </Button>
                  <p className="pt-1 text-center font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-2">Links are placeholders</p>
                </div>
              </div>
            </aside>
          </div>

          <nav className="mt-14 flex items-center justify-between border-t border-white/[0.08] pt-6" aria-label="Project navigation">
            <button onClick={() => onNavigate(-1)} data-cursor="hover" className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg">
              <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" /> Previous
            </button>
            <span className="font-mono text-[11px] tracking-[0.2em] text-muted-2">
              {String(position.index + 1).padStart(2, '0')} / {String(position.total).padStart(2, '0')}
            </span>
            <button onClick={() => onNavigate(1)} data-cursor="hover" className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg">
              Next <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </nav>
        </article>
      )}
    </Modal>
  )
}
