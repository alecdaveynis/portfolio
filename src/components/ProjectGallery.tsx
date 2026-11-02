import { useState } from 'react'
import { projectFilters, projects, type ProjectFilter } from '../content/portfolio'
import { ExternalLink, SectionHeading, Tag } from './ui'

export function ProjectGallery({ headingId }: { headingId?: string }) {
  const [filter, setFilter] = useState<ProjectFilter>('all')
  const visible = filter === 'all' ? projects : projects.filter((project) => project.filters.includes(filter))

  return (
    <div>
      <SectionHeading
        eyebrow="Projects"
        title="Selected work"
        intro="Autonomous systems, reinforcement learning, and production software."
        titleId={headingId}
      />
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
        {projectFilters.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={`rounded-full border px-3 py-1 text-xs ${
              filter === item.id
                ? 'border-[#9ee7f0]/70 bg-[#9ee7f0]/12 text-[#e7fdff]'
                : 'border-white/10 text-white/60 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-5">
        {visible.map((project) => (
          <article key={project.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            {project.image ? (
              <div className="mb-4 flex max-h-52 items-center justify-center overflow-hidden rounded-xl border border-white/8 bg-black/40">
                <img src={project.image} alt={project.imageAlt ?? ''} className="max-h-52 w-full object-contain" />
              </div>
            ) : null}
            <h3 className="text-lg font-medium text-white">{project.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#c5d0dc]">{project.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
            <div className="mt-3">
              <ExternalLink href={project.href}>Learn more</ExternalLink>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
