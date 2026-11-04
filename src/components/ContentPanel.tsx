import { useEffect, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { DestinationId } from '../content/portfolio'
import { useNav, useNavActions } from '../state/navigation'
import { AboutSection } from './AboutSection'
import { ContactSection } from './ContactSection'
import { ExperienceSection } from './ExperienceSection'
import { ProjectGallery } from './ProjectGallery'
import { SkillsSection } from './SkillsSection'

const panels: Record<DestinationId, (headingId: string) => ReactNode> = {
  projects: (id) => <ProjectGallery headingId={id} />,
  experience: (id) => <ExperienceSection headingId={id} />,
  skills: (id) => <SkillsSection headingId={id} />,
  about: (id) => <AboutSection headingId={id} />,
  contact: (id) => <ContactSection headingId={id} />,
}

function Panel({ id }: { id: DestinationId }) {
  const { closePanel, returnToHub } = useNavActions()
  const reduced = useNav().reducedMotion
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  return (
    <motion.aside
      role="dialog"
      aria-modal="true"
      aria-labelledby="panel-title"
      className="fixed top-24 right-0 bottom-0 z-40 flex w-full flex-col border-white/10 bg-[#0c1218]/92 text-[#e7eef5] shadow-[-20px_0_70px_rgba(0,0,0,0.35)] backdrop-blur-md md:top-16 md:w-[min(560px,46vw)] md:border-l"
      initial={{ x: 28, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 18, opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/8 px-5 py-3">
        <button
          type="button"
          onClick={returnToHub}
          className="rounded-full border border-[#9ee7f0]/55 bg-[#9ee7f0]/15 px-3.5 py-1.5 text-xs font-medium tracking-wide text-[#e7fdff] hover:bg-[#9ee7f0]/25"
        >
          ← Return
        </button>
        <button
          ref={closeRef}
          type="button"
          onClick={closePanel}
          className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80 hover:text-white"
        >
          Close
        </button>
      </div>
      <div className="panel-scroll flex-1 overflow-y-auto px-5 py-6 pb-16">{panels[id]('panel-title')}</div>
    </motion.aside>
  )
}

export function ContentPanel() {
  const { panel } = useNav()
  return (
    <AnimatePresence>{panel ? <Panel key={panel} id={panel} /> : null}</AnimatePresence>
  )
}
