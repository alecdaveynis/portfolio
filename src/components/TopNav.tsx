import { destinations, profile, type DestinationId } from '../content/portfolio'
import { useNav, useNavActions } from '../state/navigation'
import { ContactLinks } from './ui'

export function TopNav({ onText }: { onText: () => void }) {
  const { panel, phase, to } = useNav()
  const { openDirect, returnToHub } = useNavActions()

  const activeId = (id: DestinationId) => panel === id || ((phase === 'driving' || phase === 'arriving') && to === id)

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-50">
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
        <button
          type="button"
          onClick={returnToHub}
          className="pointer-events-auto flex items-center gap-2.5 text-left"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full border border-[#8feaf2]/40 font-mono text-[11px] text-[#d9f7fb]">
            AD
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-medium text-white">{profile.name}</span>
            <span className="block text-[11px] text-white/50">CS & AI @ Cornell</span>
          </span>
        </button>
        <nav className="pointer-events-auto hidden items-center gap-1 md:flex" aria-label="Portfolio">
          {destinations.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={activeId(item.id) ? 'page' : undefined}
              onClick={() => openDirect(item.id)}
              className={`rounded-full px-3 py-1.5 text-sm ${
                activeId(item.id) ? 'text-[#e7fdff]' : 'text-white/65 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="pointer-events-auto flex items-center gap-3">
          <ContactLinks className="hidden lg:flex" />
          <button
            type="button"
            onClick={onText}
            className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70 hover:text-white"
          >
            Text version
          </button>
        </div>
      </div>
      <nav className="pointer-events-auto flex gap-1 overflow-x-auto px-4 pb-2 md:hidden" aria-label="Portfolio">
        {destinations.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-current={activeId(item.id) ? 'page' : undefined}
            onClick={() => openDirect(item.id)}
            className={`shrink-0 rounded-full border px-3 py-1 text-xs ${
              activeId(item.id)
                ? 'border-[#9ee7f0]/50 text-[#e7fdff]'
                : 'border-white/10 text-white/70'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
