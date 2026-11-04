import { motion } from 'motion/react'
import { profile } from '../content/portfolio'
import { useNav, useNavActions } from '../state/navigation'
import { ContactLinks } from './ui'

export function IntroOverlay() {
  const { phase, location, panel, reducedMotion } = useNav()
  const { driveTo } = useNavActions()
  const visible = phase === 'idle' && location === 'hub' && !panel

  return (
    <motion.div
      className="pointer-events-none absolute bottom-6 left-5 z-20 w-[min(440px,calc(100%-2.5rem))] md:bottom-10 md:left-10"
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 10 }}
      transition={{ duration: reducedMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden={!visible}
    >
      <img
        src={profile.headshot}
        alt=""
        className="mb-4 h-20 w-20 rounded-full border border-[#8feaf2]/50 object-cover shadow-[0_8px_28px_rgba(0,0,0,0.45)] md:h-24 md:w-24"
      />
      <h1 className="text-4xl font-medium tracking-tight text-white md:text-5xl">{profile.name}</h1>
      <p className="mt-2 text-base text-white/78 md:text-lg">{profile.title}</p>
      <p className="mt-4 max-w-prose text-sm leading-relaxed text-[#c5d0dc] md:text-[15px]">{profile.intro}</p>
      <div className={`mt-5 flex flex-col gap-3 ${visible ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <button
          type="button"
          onClick={() => driveTo('projects')}
          className="w-fit rounded-full border border-[#9ee7f0]/40 bg-[#9ee7f0]/10 px-4 py-2 text-sm text-[#e7fdff] hover:bg-[#9ee7f0]/16"
        >
          Explore projects
        </button>
        <ContactLinks />
      </div>
    </motion.div>
  )
}
