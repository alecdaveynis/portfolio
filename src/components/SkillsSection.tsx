import { useState } from 'react'
import { skillGroups, skillHints } from '../content/portfolio'
import { SectionHeading } from './ui'

export function SkillsSection({ headingId }: { headingId?: string }) {
  const [active, setActive] = useState<string | null>(null)
  const detail = active ? skillHints[active] : null

  return (
    <div>
      <SectionHeading
        eyebrow="Skills"
        title="What I work with"
        intro="Languages, AI, backend, and cloud. Select a skill to see where it shows up."
        titleId={headingId}
      />
      <div className="grid gap-4">
        {skillGroups.map((group) => (
          <section key={group.title}>
            <h3 className="mb-2 text-sm font-medium text-white/90">{group.title}</h3>
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  aria-pressed={active === skill}
                  onMouseEnter={() => setActive(skill)}
                  onFocus={() => setActive(skill)}
                  onClick={() => setActive(skill)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    active === skill
                      ? 'border-[#9ee7f0]/70 bg-[#9ee7f0]/12 text-[#e7fdff]'
                      : 'border-white/12 text-white/75 hover:text-white'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className="mt-5 rounded-2xl border border-dashed border-white/15 px-4 py-3" aria-live="polite">
        <p className="text-sm font-medium text-white">{active ?? 'Hover a skill to see where I’ve used it.'}</p>
        <p className="mt-1 text-sm leading-relaxed text-[#b7c3d1]">
          {detail ??
            'For example, Computer Vision powers my AV collision avoidance system and VBTrain sports analytics platform.'}
        </p>
      </div>
    </div>
  )
}
