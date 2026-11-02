import { about, profile } from '../content/portfolio'
import { SectionHeading } from './ui'

export function AboutSection({ headingId }: { headingId?: string }) {
  return (
    <div>
      <SectionHeading eyebrow="About" title="From coursework to production-ready systems" titleId={headingId} />
      <div className="mb-5 flex items-center gap-4">
        <img
          src={profile.headshot}
          alt="Alec Daveynis"
          className="h-20 w-20 rounded-full border border-[#8feaf2]/50 object-cover"
        />
        <p className="text-sm text-[#c5d0dc]">CS & AI @ Cornell · Incoming M.Eng</p>
      </div>
      <p className="text-sm leading-relaxed text-[#c5d0dc]">{about.intro}</p>
      {about.paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 24)} className="mt-3 text-sm leading-relaxed text-[#c5d0dc]">
          {paragraph}
        </p>
      ))}
      <dl className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        {about.facts.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-4 text-sm">
            <dt className="text-white">{label}</dt>
            <dd className="text-right text-[#b7c3d1]">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
