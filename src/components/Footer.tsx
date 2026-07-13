import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import HlsVideo from './HlsVideo'
import GlowButton from './GlowButton'
import {
  BRAND_LOGO_SRC,
  INSTAGRAM_URL,
  MAPS_URL,
  VIDEO_SRC,
  WHATSAPP_URL,
} from '../constants'

const SOCIALS = [
  { label: 'Instagram', href: INSTAGRAM_URL },
  { label: 'WhatsApp', href: WHATSAPP_URL },
  { label: 'Como chegar', href: MAPS_URL },
]

export default function Footer() {
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tween = gsap.to(marqueeRef.current, {
      xPercent: -50,
      duration: 40,
      ease: 'none',
      repeat: -1,
    })
    return () => {
      tween.kill()
    }
  }, [])

  return (
    <footer
      className="relative overflow-hidden bg-bg pb-8 pt-16 md:pb-12 md:pt-20"
    >
      <div className="absolute inset-0 scale-y-[-1]">
        <HlsVideo
          src={VIDEO_SRC}
          className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/60" />
      {/* Luz roxa do estúdio */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(123,47,247,0.22),transparent_45%)] mix-blend-screen" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-bg to-transparent" />

      <div className="relative z-10">
        <div className="overflow-hidden whitespace-nowrap border-y border-white/10 py-4">
          <div ref={marqueeRef} className="inline-block will-change-transform">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className={`mr-8 font-display text-3xl italic md:text-5xl ${
                  i % 2 === 0 ? 'text-text-primary/90' : 'text-outline'
                }`}
              >
                Unhas com atitude de palco{' '}
                <span className="font-body not-italic text-violet">•</span>
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-6 py-16 text-center md:py-24">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            Contato
          </p>
          <h2 className="max-w-2xl text-4xl tracking-tight text-text-primary md:text-6xl">
            Bora fazer as <span className="font-display italic">suas</span>?
          </h2>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <GlowButton href={WHATSAPP_URL} external variant="cta">
              Agendar no WhatsApp
              <span aria-hidden>↗</span>
            </GlowButton>
            <GlowButton href={INSTAGRAM_URL} external>
              @_rockstarstudio
            </GlowButton>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 border-t border-white/10 px-6 pt-6 md:flex-row">
          <div className="flex gap-5">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                {...(social.href.startsWith('http')
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="text-xs text-muted transition-colors duration-200 hover:text-text-primary"
              >
                {social.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Agenda aberta
          </div>
          <p className="flex items-center gap-2 text-xs text-muted">
            <img
              src={BRAND_LOGO_SRC}
              alt=""
              className="h-6 w-6 rounded-full border border-white/10 object-cover"
            />
            © 2026 Rockstar Studio
          </p>
        </div>
      </div>
    </footer>
  )
}


