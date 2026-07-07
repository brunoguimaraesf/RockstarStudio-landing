import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HlsVideo from './HlsVideo'
import GlowButton from './GlowButton'
import { VIDEO_SRC, WHATSAPP_URL } from '../constants'

gsap.registerPlugin(ScrollTrigger)

const ROLES = ['góticas', 'chrome', 'stiletto', 'kawaii', 'autorais']

type HeroProps = {
  active: boolean
}

export default function Hero({ active }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null)
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setRoleIndex((i) => (i + 1) % ROLES.length),
      2000,
    )
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!active) return

    const ctx = gsap.context(() => {
      gsap.set('.hero-copy', {
        opacity: 0,
        y: '52vh',
        filter: 'blur(10px)',
      })
      gsap.set('.hero-overlay', { opacity: 0 })
      gsap.set('.hero-scroll-cue', { opacity: 1 })

      const reveal = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: '58% top',
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      })

      reveal
        .to('.hero-scroll-cue', { opacity: 0, duration: 0.08 }, 0)
        .to('.hero-overlay', { opacity: 1, duration: 0.18 }, 0)
        .to(
          '.hero-kicker',
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.34 },
          0,
        )
        .to(
          '.hero-title',
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.42 },
          0.025,
        )
        .to(
          '.hero-role',
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.36 },
          0.12,
        )
        .to(
          '.hero-description',
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.36 },
          0.19,
        )
        .to(
          '.hero-actions',
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.34 },
          0.27,
        )
    }, rootRef)

    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [active])

  return (
    <section
      id="inicio"
      ref={rootRef}
      className="relative min-h-[285vh] bg-bg"
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <HlsVideo
            src={VIDEO_SRC}
            className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover"
          />
          <div className="hero-overlay absolute inset-0 bg-black/45 opacity-0" />
          <div className="hero-overlay absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.5),transparent_75%)] opacity-0" />
          {/* Luz roxa do estúdio */}
          <div className="hero-overlay absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(123,47,247,0.3),transparent_45%),radial-gradient(circle_at_12%_80%,rgba(157,78,221,0.22),transparent_40%)] opacity-0 mix-blend-screen" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
        </div>

        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6 text-center">
          <div className="pointer-events-auto flex flex-col items-center">
            <p className="hero-copy hero-kicker mb-8 text-xs uppercase tracking-[0.3em] text-muted opacity-0">
              <span className="mr-2 text-kawaii" aria-hidden>
                ✦
              </span>
              Nail Art
            </p>

            <h1 className="hero-copy hero-title mb-6 font-display text-6xl italic leading-[0.9] tracking-tight text-text-primary opacity-0 md:text-8xl lg:text-9xl">
              Rockstar Studio
            </h1>

            <p className="hero-copy hero-role mb-4 text-base text-muted opacity-0 md:text-lg">
              Unhas{' '}
              <span
                key={roleIndex}
                className="animate-role-fade-in inline-block font-display italic text-violet drop-shadow-[0_0_14px_rgba(157,78,221,0.45)]"
              >
                {ROLES[roleIndex]}
              </span>{' '}
              em Rio Verde - GO.
            </p>

            <p className="hero-copy hero-description mb-12 max-w-md text-sm text-muted opacity-0 md:text-base">
              Nail art autoral com estética dark, detalhes cromados e acabamento de
              impacto sua mão como assinatura visual.
            </p>

            <div className="hero-copy hero-actions inline-flex flex-col gap-4 opacity-0 sm:flex-row">
              <GlowButton href={WHATSAPP_URL} external variant="cta">
                Agendar no WhatsApp
                <span aria-hidden>↗</span>
              </GlowButton>
              <GlowButton href="#trabalhos" variant="outline">
                Ver trabalhos
              </GlowButton>
            </div>
          </div>
        </div>

        <div className="hero-scroll-cue absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3">
          <span className="text-xs uppercase tracking-[0.2em] text-muted">
            Scroll
          </span>
          <span className="relative block h-10 w-px overflow-hidden bg-stroke">
            <span className="accent-gradient animate-scroll-down absolute inset-x-0 h-4" />
          </span>
        </div>
      </div>
    </section>
  )
}



