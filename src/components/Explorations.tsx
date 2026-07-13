import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, m } from 'framer-motion'
import GlowButton from './GlowButton'
import { INSTAGRAM_URL } from '../constants'

gsap.registerPlugin(ScrollTrigger)

const PLAYGROUND_IMAGE = '/images/playground/GIOR.webp'

const ITEMS = [
  {
    image: '/images/works/ALTERNATIVA%201.webp',
    label: 'Alternativa I',
    gradient: 'linear-gradient(135deg, #241a38, #0f0d14)',
    x: '-38vw',
    y: '-28vh',
    rotate: -9,
    scale: 0.96,
  },
  {
    image: '/images/works/ALTERNATIVA%202.webp',
    label: 'Alternativa II',
    gradient: 'linear-gradient(135deg, #2e2b38, #121016)',
    x: '-30vw',
    y: '20vh',
    rotate: 7,
    scale: 0.88,
  },
  {
    image: '/images/works/KAWAI%202.webp',
    label: 'Kawaii',
    gradient: 'linear-gradient(135deg, #1d1430, #14101a)',
    x: '-10vw',
    y: '-37vh',
    rotate: -4,
    scale: 0.76,
  },
  {
    image: '/images/works/GOTICO%201.webp',
    label: 'Gótica',
    gradient: 'linear-gradient(135deg, #2b1f3e, #0f0d14)',
    x: '34vw',
    y: '-25vh',
    rotate: 8,
    scale: 0.92,
  },
  {
    image: '/images/works/AUTORAL%201.webp',
    label: 'Autoral I',
    gradient: 'linear-gradient(135deg, #201735, #15141a)',
    x: '28vw',
    y: '22vh',
    rotate: -8,
    scale: 0.9,
  },
  {
    image: '/images/works/AUTORAL%202.webp',
    label: 'Autoral II',
    gradient: 'linear-gradient(135deg, #281d3a, #121016)',
    x: '8vw',
    y: '36vh',
    rotate: 5,
    scale: 0.76,
  },
  {
    image: '/images/works/ALTERNATIVA%201.webp',
    label: 'Detalhe dark',
    gradient: 'linear-gradient(135deg, #1a1422, #09070d)',
    x: '-45vw',
    y: '2vh',
    rotate: -14,
    scale: 0.7,
  },
  {
    image: '/images/works/GOTICO%201.webp',
    label: 'Metal',
    gradient: 'linear-gradient(135deg, #21172d, #0d0a12)',
    x: '45vw',
    y: '4vh',
    rotate: 13,
    scale: 0.7,
  },
]

export default function Explorations() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const spreadRef = useRef<HTMLDivElement>(null)
  const autoSpreadRef = useRef(false)
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: pinRef.current,
        pinSpacing: false,
      })

      const cards = gsap.utils.toArray<HTMLElement>('.playground-card')

      gsap.set(cards, {
        x: 0,
        y: 0,
        rotate: (index) => [-8, 5, -4, 8, -6, 4, -10, 10][index] ?? 0,
        scale: 0.58,
        opacity: 0.82,
        transformOrigin: '50% 50%',
      })

      const spread = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '42% top',
          scrub: 0.35,
          invalidateOnRefresh: true,
        },
      })

      cards.forEach((card, index) => {
        const item = ITEMS[index]
        spread.to(
          card,
          {
            x: item.x,
            y: item.y,
            rotate: item.rotate,
            scale: item.scale,
            opacity: 1,
            duration: 0.32,
          },
          0,
        )
      })

      spread
        .to('.playground-copy', { scale: 0.94, opacity: 0.92, duration: 0.24 }, 0)
        .to('.playground-haze', { opacity: 0.7, scale: 1.18, duration: 0.34 }, 0)

    }, sectionRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let autoScrollTween: gsap.core.Tween | undefined
    let delay = 0
    const previousScrollBehavior = document.documentElement.style.scrollBehavior

    const setScrollY = (y: number) => {
      window.scrollTo(0, y)
      document.documentElement.scrollTop = y
      document.body.scrollTop = y
      ScrollTrigger.update()
    }

    const runAutoSpread = () => {
      if (autoSpreadRef.current) return
      autoSpreadRef.current = true

      delay = window.setTimeout(() => {
        document.documentElement.style.scrollBehavior = 'auto'
        ScrollTrigger.refresh()

        const sectionTop = section.offsetTop
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        const targetY = Math.min(sectionTop + section.offsetHeight * 0.42, maxScroll)
        const scrollState = { y: window.scrollY }

        autoScrollTween = gsap.to(scrollState, {
          y: targetY,
          duration: 1.65,
          ease: 'power2.inOut',
          overwrite: 'auto',
          onUpdate: () => setScrollY(scrollState.y),
          onComplete: () => {
            document.documentElement.style.scrollBehavior = previousScrollBehavior
          },
        })
      }, 180)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runAutoSpread()
          observer.disconnect()
        }
      },
      { threshold: 0.18 },
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
      window.clearTimeout(delay)
      autoScrollTween?.kill()
      document.documentElement.style.scrollBehavior = previousScrollBehavior
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-[390vh] bg-bg">
      <div
        ref={pinRef}
        className="relative z-10 flex h-screen items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(36,26,56,0.7),rgba(13,13,13,0.9)_62%,#0d0d0d_100%)]" />
          <img
            src={PLAYGROUND_IMAGE}
            alt="Rockstar Studio"
            className="absolute inset-0 h-full w-full object-cover object-[50%_35%] opacity-45 grayscale-[12%] saturate-[0.85] mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(13,13,13,0.16)_34%,rgba(13,13,13,0.82)_72%,#0d0d0d_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#0d0d0d_0%,transparent_24%,transparent_70%,#0d0d0d_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(123,47,247,0.24),transparent_42%),radial-gradient(circle_at_82%_70%,rgba(196,30,58,0.16),transparent_36%)] mix-blend-screen" />
        </div>

        <div
          ref={spreadRef}
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
        >
          {ITEMS.map((item, index) => (
            <button
              key={`${item.label}-${index}`}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Ampliar exploração ${item.label}`}
              className="playground-card pointer-events-auto absolute aspect-[4/5] w-[38vw] max-w-[230px] min-w-[128px] overflow-hidden rounded-3xl border border-stroke bg-surface shadow-2xl shadow-black/35 transition-[filter] duration-300 hover:z-30 hover:brightness-110 sm:w-[28vw] md:w-[18vw]"
              style={{ background: item.gradient }}
            >
              <img
                src={item.image}
                alt={`Exploração visual ${item.label}`}
                loading="lazy"
                className="h-full w-full object-cover opacity-90 transition duration-500 hover:opacity-100"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </button>
          ))}
        </div>

        <div className="playground-copy relative z-30 flex flex-col items-center px-6 text-center">
          {/* Luz roxa atrás do conteúdo pinado */}
          <div className="playground-haze pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple/15 blur-[110px]" />
          <div className="mb-4 flex items-center gap-3">
            <span className="accent-gradient h-px w-8" />
            <span className="text-xs uppercase tracking-[0.3em] text-muted">
              Explorações
            </span>
            <span className="accent-gradient h-px w-8" />
          </div>
          <h2 className="text-4xl tracking-tight text-text-primary md:text-5xl">
            Playground{' '}
            <span className="font-display italic text-violet">visual</span>
          </h2>
          <p className="mt-3 max-w-sm text-sm text-muted">
            Testes, texturas e ideias que ainda não viraram unha mas vão.
          </p>
          <GlowButton href={INSTAGRAM_URL} external className="mt-8">
            @_rockstarstudio
            <span aria-hidden>↗</span>
          </GlowButton>
        </div>
      </div>

      <AnimatePresence>
        {selected !== null && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <m.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              transition={{ duration: 0.3 }}
              className="flex aspect-[4/5] w-full max-w-[520px] items-center justify-center overflow-hidden rounded-3xl border border-stroke"
              style={{ background: ITEMS[selected].gradient }}
            >
              <img
                src={ITEMS[selected].image}
                alt={`Exploração visual ${ITEMS[selected].label}`}
                className="h-full w-full object-cover"
              />
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  )
}

