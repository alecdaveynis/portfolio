import { experience } from '../content/portfolio'
import { SectionHeading, Tag } from './ui'

export function ExperienceSection({ headingId }: { headingId?: string }) {
  return (
    <div>
      <SectionHeading eyebrow="Experience" title="Where I’ve applied these skills" titleId={headingId} />
      <div className="relative flex flex-col gap-5 border-l border-white/15 pl-5">
        {experience.map((role) => (
          <article key={role.meta} className="relative">
            <span className="absolute top-1.5 -left-[1.58rem] h-2.5 w-2.5 rounded-full bg-[#8feaf2] shadow-[0_0_0_4px_rgba(143,234,242,0.15)]" />
            <h3 className="text-base font-medium leading-snug text-white">{role.title}</h3>
            <p className="mt-1 font-mono text-[11px] tracking-wide text-[#9aa8b8]">{role.meta}</p>
            <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-relaxed text-[#c5d0dc]">
              {role.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {role.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
