import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HlsVideo from './HlsVideo'
import GlowButton from './GlowButton'
import {
  BRAND_LOGO_SRC,
  HERO_POSTER_SRC,
  VIDEO_SRC,
  WHATSAPP_URL,
} from '../constants'

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
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        // Sem filter: blur() no scrub — animar blur a cada frame do scroll
        // repinta a tela inteira e trava; opacity + y sao compostos na GPU
        gsap.set('.hero-copy', {
          opacity: 0,
          y: '52vh',
          willChange: 'transform, opacity',
        })
        gsap.set('.hero-overlay', { opacity: 0 })
        gsap.set('.hero-scroll-cue', { opacity: 1 })

        const reveal = gsap.timeline({
          defaults: { ease: 'none', force3D: true },
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
          .to('.hero-kicker', { opacity: 1, y: 0, duration: 0.34 }, 0)
          .to('.hero-title', { opacity: 1, y: 0, duration: 0.42 }, 0.025)
          .to('.hero-role', { opacity: 1, y: 0, duration: 0.36 }, 0.12)
          .to('.hero-description', { opacity: 1, y: 0, duration: 0.36 }, 0.19)
          .to('.hero-actions', { opacity: 1, y: 0, duration: 0.34 }, 0.27)
      })

      mm.add('(max-width: 767px)', () => {
        gsap.set('.hero-copy', {
          opacity: 0,
          y: 24,
          filter: 'none',
        })
        gsap.set('.hero-overlay', { opacity: 1 })
        gsap.set('.hero-scroll-cue', { opacity: 0 })

        const reveal = gsap.timeline({
          delay: 0.12,
          defaults: { ease: 'power2.out' },
        })

        reveal
          .to('.hero-kicker', { opacity: 1, y: 0, duration: 0.28 }, 0)
          .to('.hero-title', { opacity: 1, y: 0, duration: 0.38 }, 0.06)
          .to('.hero-role', { opacity: 1, y: 0, duration: 0.3 }, 0.16)
          .to('.hero-description', { opacity: 1, y: 0, duration: 0.3 }, 0.22)
          .to('.hero-actions', { opacity: 1, y: 0, duration: 0.3 }, 0.28)
      })

      return () => mm.revert()
    }, rootRef)

    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [active])

  useEffect(() => {
    if (!active) return

    let autoScrollTween: gsap.core.Tween | undefined
    let raf = 0
    const previousScrollBehavior = document.documentElement.style.scrollBehavior
    const isDesktop = window.matchMedia('(min-width: 768px)').matches

    const setScrollY = (y: number) => {
      window.scrollTo(0, y)
      document.documentElement.scrollTop = y
      document.body.scrollTop = y
      ScrollTrigger.update()
    }

    if (!isDesktop) {
      document.documentElement.style.scrollBehavior = 'auto'
      if (rootRef.current) setScrollY(rootRef.current.offsetTop)
      ScrollTrigger.refresh()

      return () => {
        document.documentElement.style.scrollBehavior = previousScrollBehavior
      }
    }

    // Reset imediato para o topo do hero: se o navegador restaurou um scroll
    // antigo, a timeline de scrub nasceria adiantada e o texto piscaria na
    // tela até o auto-scroll começar
    document.documentElement.style.scrollBehavior = 'auto'
    ScrollTrigger.refresh()
    if (rootRef.current) setScrollY(rootRef.current.offsetTop)

    const autoIntroDelay = window.setTimeout(() => {
      raf = requestAnimationFrame(() => {
        const root = rootRef.current
        if (!root) return

        const heroTop = root.offsetTop
        setScrollY(heroTop)

        const scrollState = { y: heroTop }
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        const targetY = Math.min(heroTop + root.offsetHeight * 0.58, maxScroll)

        autoScrollTween = gsap.to(scrollState, {
          y: targetY,
          duration: 1.0,
          ease: 'power2.inOut',
          onUpdate: () => setScrollY(scrollState.y),
          onComplete: () => {
            document.documentElement.style.scrollBehavior = previousScrollBehavior
          },
        })
      })
    }, 300)

    return () => {
      window.clearTimeout(autoIntroDelay)
      cancelAnimationFrame(raf)
      autoScrollTween?.kill()
      document.documentElement.style.scrollBehavior = previousScrollBehavior
    }
  }, [active])

  return (
    <section
      id="inicio"
      ref={rootRef}
      className="relative min-h-[100svh] bg-bg md:min-h-[285vh]"
    >
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden md:h-screen">
        <div className="absolute inset-0 z-0">
          <HlsVideo
            src={VIDEO_SRC}
            poster={HERO_POSTER_SRC}
            className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover"
          />
          <div className="hero-overlay absolute inset-0 bg-black/45 opacity-0" />
          <div className="hero-overlay absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.5),transparent_75%)] opacity-0" />
          {/* Luz roxa do estúdio — sem mix-blend-screen: animar blend no scrub
              recompoe a camada a cada frame e trava em telas 16:9. Sobre o
              video escuro, o roxo com blend normal fica praticamente igual. */}
          <div className="hero-overlay absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(123,47,247,0.42),transparent_45%),radial-gradient(circle_at_12%_80%,rgba(157,78,221,0.32),transparent_40%)] opacity-0" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
        </div>

        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6 text-center">
          <div className="pointer-events-auto flex flex-col items-center">
            <p className="hero-copy hero-kicker mb-8 text-xs uppercase tracking-[0.3em] text-muted opacity-0">
              <img
                src={BRAND_LOGO_SRC}
                alt=""
                className="mr-3 inline h-7 w-7 rounded-full border border-white/10 object-cover align-middle"
                aria-hidden="true"
              />
              Nail Art · Press On
            </p>

            <h1 className="hero-copy hero-title mb-6 font-display text-6xl italic leading-[0.9] tracking-tight text-text-primary opacity-0 md:text-8xl lg:text-9xl">
              Rockstar Studio
            </h1>

            <p className="hero-copy hero-role mb-4 text-base text-muted opacity-0 md:text-lg">
              Unhas e press ons{' '}
              <span
                key={roleIndex}
                className="animate-role-fade-in inline-block font-display italic text-violet drop-shadow-[0_0_14px_rgba(157,78,221,0.45)]"
              >
                {ROLES[roleIndex]}
              </span>{' '}
              em Rio Verde - GO.
            </p>

            <p className="hero-copy hero-description mb-12 max-w-xl text-sm text-muted opacity-0 md:text-base">
              Nail arts autorais e kits press on artesanais para quem quer
              transformar cada detalhe das unhas em presença.
            </p>

            <div className="hero-copy hero-actions flex w-full max-w-[19rem] flex-col items-stretch gap-3 opacity-0 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center">
              <GlowButton
                href={WHATSAPP_URL}
                external
                variant="whatsapp"
                className="w-full sm:w-auto"
              >
                Agendar no WhatsApp
                <span aria-hidden>↗</span>
              </GlowButton>
              <GlowButton
                href="#trabalhos"
                variant="outline"
                className="w-full sm:w-auto"
              >
                Ver trabalhos
              </GlowButton>
              <GlowButton
                href="/loja/"
                variant="outline"
                className="w-full sm:w-auto"
              >
                Ver press ons
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
