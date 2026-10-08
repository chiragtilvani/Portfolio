import { useCallback, useState } from 'react'
import { projects, type Project } from '@/data/projects'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectModal } from '@/components/projects/ProjectModal'
import { TechLabel } from '@/components/ui/Decor'

export function Projects() {
  const [active, setActive] = useState<Project | null>(null)
  const index = active ? projects.findIndex((p) => p.id === active.id) : -1

  const navigate = useCallback(
    (dir: 1 | -1) => {
      if (index < 0) return
      const next = (index + dir + projects.length) % projects.length
      setActive(projects[next])
    },
    [index],
  )

  return (
    <section id="work" className="section-pad relative" aria-labelledby="work-heading">
      <div className="container-x">
        <SectionHeader
          index="03"
          label="Selected work"
          title={<span id="work-heading">Things I&apos;ve built.</span>}
          subtitle="A collection of applications, experiments and systems."
        />

        <div className="flex flex-col gap-24 md:gap-32 lg:gap-40">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} flip={i % 2 === 1} onOpen={setActive} />
          ))}
        </div>

        <div className="mt-20 flex items-center justify-between border-t border-white/[0.08] pt-6">
          <TechLabel>{projects.length} selected projects</TechLabel>
          <TechLabel>More on GitHub ↓</TechLabel>
        </div>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} onNavigate={navigate} position={{ index, total: projects.length }} />
    </section>
  )
}
