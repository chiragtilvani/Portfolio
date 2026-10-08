import { useState } from 'react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { SkillConstellation, SkillDetail } from '@/components/SkillConstellation'
import { skillCategories, skills, type Skill, type SkillCategory } from '@/data/skills'
import { cn } from '@/lib/utils'
import { TechLabel } from '@/components/ui/Decor'

export function Skills() {
  const [selected, setSelected] = useState<Skill | null>(null)
  const [filter, setFilter] = useState<SkillCategory | null>(null)

  return (
    <section id="skills" className="section-pad relative" aria-labelledby="skills-heading">
      <div className="container-x">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            index="02"
            label="Technology"
            title={<span id="skills-heading">Tools I build with.</span>}
            subtitle="Not a list of logos. A map of how the pieces connect, from interface to database."
            className="mb-0"
          />
          <Reveal delay={0.2}>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter technologies by category">
              <FilterChip active={filter === null} onClick={() => setFilter(null)} label="All" />
              {skillCategories.map((c) => (
                <FilterChip key={c.id} active={filter === c.id} onClick={() => setFilter(filter === c.id ? null : c.id)} label={c.label} hue={c.hue} />
              ))}
            </div>
          </Reveal>
        </div>

        {/* Constellation: full graph on every screen size. On phones it scrolls
            horizontally so nodes stay tappable at a readable size. */}
        <div className="mt-12 grid grid-cols-12 gap-6 md:mt-14 md:gap-8">
          <Reveal className="col-span-12 lg:col-span-8" delay={0.1} y={30}>
            <div className="relative rounded-3xl border border-white/[0.06] bg-white/[0.012] p-3 md:p-4 lg:p-8">
              <div className="overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ touchAction: 'pan-x pan-y' }}>
                <div className="min-w-[720px] md:min-w-0">
                  <SkillConstellation selected={selected} onSelect={setSelected} filter={filter} />
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between px-2">
                <TechLabel>{skills.length} technologies · 5 systems</TechLabel>
                <TechLabel className="md:hidden">swipe · tap a node</TechLabel>
                <TechLabel className="hidden md:inline">fig. 02 — constellation</TechLabel>
              </div>
            </div>
          </Reveal>
          <Reveal className="col-span-12 lg:col-span-4" delay={0.2}>
            <div className="lg:sticky lg:top-28">
              <SkillDetail skill={selected} />
              <p className="mt-4 px-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-2">
                <span className="hidden md:inline">Click a node to pin it · Tab to navigate</span>
                <span className="md:hidden">Tap a node or a chip below</span>
              </p>
            </div>
          </Reveal>
        </div>

        {/* Mobile: grouped chips (quick access without scrolling the graph) */}
        <div className="mt-12 space-y-8 md:hidden">
          {skillCategories
            .filter((c) => !filter || c.id === filter)
            .map((c) => (
              <Reveal key={c.id}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full" style={{ background: c.hue }} />
                  <span className="label">{c.label}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills
                    .filter((s) => s.category === c.id)
                    .map((s) => {
                      const on = selected?.name === s.name
                      return (
                        <button
                          key={s.name}
                          onClick={() => setSelected(on ? null : s)}
                          aria-pressed={on}
                          className={cn(
                            'rounded-full border px-3.5 py-2 text-[13px] transition-colors',
                            on ? 'border-accent/60 bg-accent/10 text-fg' : 'border-white/10 bg-white/[0.03] text-muted',
                          )}
                        >
                          {s.name}
                        </button>
                      )
                    })}
                </div>
              </Reveal>
            ))}
        </div>
      </div>
    </section>
  )
}

function FilterChip({ active, onClick, label, hue }: { active: boolean; onClick: () => void; label: string; hue?: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      data-cursor="hover"
      className={cn(
        'inline-flex h-9 items-center gap-2 rounded-full border px-4 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-300',
        active ? 'border-white/40 bg-white/[0.08] text-fg' : 'border-white/10 text-muted hover:border-white/25 hover:text-fg',
      )}
    >
      {hue && <span className="h-1.5 w-1.5 rounded-full" style={{ background: hue }} />}
      {label}
    </button>
  )
}
