import { useState, type FormEvent } from 'react'
import { profile } from '../content/portfolio'
import { ContactLinks, SectionHeading } from './ui'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const fieldClass =
  'mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-white/28 focus-visible:border-[#9ee7f0]/50'

export function ContactSection({ headingId }: { headingId?: string }) {
  const [status, setStatus] = useState<Status>('idle')
  const [draft, setDraft] = useState({ name: '', email: '', message: '' })

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    if (String(data.get('_honey') || '').trim()) return

    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const message = String(data.get('message') || '').trim()
    setDraft({ name, email, message })
    setStatus('sending')

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(profile.email)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        signal: AbortSignal.timeout(12000),
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Portfolio message from ${name}`,
          _replyto: email,
          _template: 'table',
          _captcha: 'false',
        }),
      })
      const payload = (await response.json()) as { success?: string | boolean }
      if (!response.ok || (payload.success !== 'true' && payload.success !== true)) {
        throw new Error('send failed')
      }
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  const fallback = `mailto:${profile.email}?subject=${encodeURIComponent(
    draft.name ? `Portfolio message from ${draft.name}` : 'Portfolio message',
  )}&body=${encodeURIComponent(`${draft.message}\n\n— ${draft.name}\n${draft.email}`.trim())}`

  return (
    <div>
      <SectionHeading
        eyebrow="Contact"
        title="Let’s build something"
        intro="Whether you have a role in mind, a project idea, or just want to chat about AI and data, I’d love to hear from you."
        titleId={headingId}
      />
      {status === 'sent' ? (
        <p className="rounded-2xl border border-[#9ee7f0]/30 bg-[#9ee7f0]/8 px-4 py-3 text-sm text-[#e7fdff]" role="status">
          Sent. It will land at {profile.email}.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <label className="block text-xs tracking-wide text-[#9aa8b8]">
            Name
            <input name="name" type="text" required autoComplete="name" className={fieldClass} />
          </label>
          <label className="block text-xs tracking-wide text-[#9aa8b8]">
            Email
            <input name="email" type="email" required autoComplete="email" className={fieldClass} />
          </label>
          <label className="block text-xs tracking-wide text-[#9aa8b8]">
            Message
            <textarea name="message" required rows={5} className={`${fieldClass} resize-y`} />
          </label>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-fit rounded-full border border-[#9ee7f0]/40 bg-[#9ee7f0]/10 px-4 py-2 text-sm text-[#e7fdff] hover:bg-[#9ee7f0]/16 disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending…' : 'Send'}
          </button>
          {status === 'error' ? (
            <p className="text-sm text-[#f0c7c7]" role="alert">
              Couldn’t send from the page.{' '}
              <a className="text-[#c9f6fb] underline-offset-4 hover:underline" href={fallback}>
                Open it in your mail app
              </a>
              .
            </p>
          ) : (
            <p className="text-xs text-white/40">Sends to {profile.email}.</p>
          )}
        </form>
      )}
      <ContactLinks className="mt-6" />
      <p className="mt-8 text-xs text-white/40">© {new Date().getFullYear()} Alec Daveynis.</p>
    </div>
  )
}
