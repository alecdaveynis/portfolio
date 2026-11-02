import { profile } from '../content/portfolio'
import { AboutSection } from './AboutSection'
import { ContactSection } from './ContactSection'
import { ExperienceSection } from './ExperienceSection'
import { ProjectGallery } from './ProjectGallery'
import { SkillsSection } from './SkillsSection'
import { ContactLinks } from './ui'

const links = [
  ['projects', 'Projects'],
  ['experience', 'Experience'],
  ['skills', 'Skills'],
  ['about', 'About'],
  ['contact', 'Contact'],
] as const

export function StaticSite({ onEnterWorld }: { onEnterWorld?: () => void }) {
  return (
    <div className="min-h-dvh bg-[#080B10] text-[#e7eef5]">
      <header className="sticky top-0 z-20 border-b border-white/8 bg-[#080b10]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-3">
          <a href="#top" className="text-sm font-medium text-white">
            {profile.name}
          </a>
          <nav className="flex gap-3 overflow-x-auto text-sm text-white/70" aria-label="Portfolio">
            {links.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="shrink-0 hover:text-white">
                {label}
              </a>
            ))}
          </nav>
          {onEnterWorld ? (
            <button
              type="button"
              onClick={onEnterWorld}
              className="shrink-0 rounded-full border border-[#9ee7f0]/40 px-3 py-1 text-xs text-[#d9f7fb]"
            >
              3D view
            </button>
          ) : null}
        </div>
      </header>
      <main id="top" className="mx-auto flex max-w-3xl flex-col gap-16 px-5 py-12">
        <section>
          <h1 className="text-4xl font-medium tracking-tight">{profile.name}</h1>
          <p className="mt-2 text-lg text-white/75">{profile.title}</p>
          <p className="mt-4 max-w-prose text-sm leading-relaxed text-[#c5d0dc]">{profile.intro}</p>
          <ContactLinks className="mt-5" />
        </section>
        <section id="about" className="scroll-mt-20">
          <AboutSection />
        </section>
        <section id="projects" className="scroll-mt-20">
          <ProjectGallery />
        </section>
        <section id="experience" className="scroll-mt-20">
          <ExperienceSection />
        </section>
        <section id="skills" className="scroll-mt-20">
          <SkillsSection />
        </section>
        <section id="contact" className="scroll-mt-20">
          <ContactSection />
        </section>
      </main>
    </div>
  )
}
