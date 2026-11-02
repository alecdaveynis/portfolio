import type { ReactNode } from 'react'
import { profile } from '../content/portfolio'

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-[#9ee7f0]/25 bg-[#9ee7f0]/8 px-2 py-0.5 text-[11px] tracking-wide text-[#d5f7fb]">
      {children}
    </span>
  )
}

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      className="text-sm text-[#c9f6fb] underline-offset-4 hover:underline"
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}

export function ContactLinks({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 ${className}`}>
      <ExternalLink href={profile.github}>GitHub</ExternalLink>
      <ExternalLink href={profile.linkedin}>LinkedIn</ExternalLink>
      <ExternalLink href={`mailto:${profile.email}`}>Email</ExternalLink>
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  titleId,
}: {
  eyebrow: string
  title: string
  intro?: string
  titleId?: string
}) {
  return (
    <header className="mb-6">
      <p className="font-mono text-[11px] tracking-[0.18em] text-[#9ee7f0] uppercase">{eyebrow}</p>
      <h2 id={titleId} className="mt-2 text-2xl font-medium tracking-tight text-white">
        {title}
      </h2>
      {intro ? <p className="mt-3 max-w-prose text-sm leading-relaxed text-[#b7c3d1]">{intro}</p> : null}
    </header>
  )
}
