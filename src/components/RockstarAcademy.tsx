import { useRef } from 'react'
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import GlowButton from './GlowButton'
import { WHATSAPP_PHONE, WHATSAPP_URL } from '../constants'
import {
  ACADEMY_COURSES,
  ACADEMY_LAUNCHED,
  courseCheckoutUrl,
  primaryCheckoutUrl,
  type Course,
} from '../lib/academy'
import { track, withUtm } from '../lib/tracking'

// Lista VIP (fase pré-lançamento): reaproveita o padrão de WhatsApp do site.
const VIP_MESSAGE =
  'Olá! Vi que a Rockstar Academy está chegando e quero entrar na lista VIP para saber quando o primeiro curso for lançado.'

const vipUrl = WHATSAPP_PHONE
  ? `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(VIP_MESSAGE)}`
  : WHATSAPP_URL

const EASE = [0.25, 0.1, 0.25, 1] as const

function CourseCard({ course, i }: { course: Course; i: number }) {
  const reduce = useReducedMotion()
  const available = course.status === 'available'

  const motion = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-60px' },
        transition: { duration: 0.7, delay: i * 0.12, ease: EASE },
      }

  return (
    <m.li
      {...motion}
      className="group relative aspect-[3/4] w-[72vw] max-w-[300px] shrink-0 snap-center overflow-hidden rounded-3xl border border-stroke bg-surface transition-colors duration-500 hover:border-violet/50 sm:w-[300px]"
    >
      {available && course.image ? (
        <img
          src={course.image}
          alt={course.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-[900ms] ease-out group-hover:scale-105 group-hover:opacity-90"
        />
      ) : (
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center font-display text-[7rem] italic text-stroke/70 transition-colors duration-500 group-hover:text-violet/30"
        >
          ?
        </span>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/20" />

      <div className="relative flex h-full flex-col justify-between p-6">
        <div className="flex items-start justify-between">
          <span className="font-display text-3xl italic text-violet">
            {course.index}
          </span>
          <span className="text-[10px] uppercase tracking-[0.24em] text-muted">
            {course.index} / 0{ACADEMY_COURSES.length}
          </span>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.26em] text-muted">
            {course.kicker}
          </p>

          {available ? (
            <>
              <h3 className="mt-2 text-xl leading-tight text-text-primary">
                {course.title}
              </h3>
              {course.description && (
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
                  {course.description}
                </p>
              )}
              {course.benefit && (
                <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-violet">
                  {course.benefit}
                </p>
              )}
              <a
                href={withUtm(courseCheckoutUrl(course), `course_${course.index}`)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  track('academy_course_click', { course: course.id })
                }
                className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-text-primary transition-colors duration-300 hover:text-violet"
              >
                Conhecer o curso
                <span aria-hidden>→</span>
              </a>
            </>
          ) : (
            <>
              {/* Nome do curso censurado */}
              <div className="mt-3 space-y-2" aria-hidden>
                <div className="h-3.5 w-4/5 rounded-full bg-white/10 blur-[1px]" />
                <div className="h-3.5 w-1/2 rounded-full bg-white/10 blur-[1px]" />
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className="h-px w-5 bg-violet/60" />
                <p className="text-[11px] uppercase tracking-[0.18em] text-text-primary/80">
                  {course.teaserReveal}
                </p>
              </div>

              <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-violet opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                O que será?
              </p>
            </>
          )}
        </div>
      </div>
    </m.li>
  )
}

export default function RockstarAcademy() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const wordY = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ['0%', '0%'] : ['10%', '-10%'],
  )

  const rise = reduce ? {} : { initial: { opacity: 0, y: 24 } }

  // Fase 1 (pré-lançamento): lista VIP no WhatsApp.
  // Fase 2 (algum curso disponível): CTA principal vai pra Hotmart.
  const bottomCta = ACADEMY_LAUNCHED
    ? {
        label: 'Quero garantir minha vaga',
        href: withUtm(primaryCheckoutUrl(), 'academy_cta'),
        event: 'academy_hotmart_click' as const,
      }
    : {
        label: 'Entrar na lista VIP',
        href: vipUrl,
        event: 'academy_waitlist_click' as const,
      }

  return (
    <section
      ref={ref}
      id="academy"
      aria-label="Rockstar Academy — cursos em breve"
      className="relative isolate overflow-hidden bg-bg py-24 md:py-36"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] max-w-[120vw] -translate-x-1/2 rounded-full bg-purple/12 blur-[88px]" />
      <div className="pointer-events-none absolute -bottom-24 right-[-10%] h-80 w-80 rounded-full bg-violet/12 blur-[80px]" />

      <m.span
        aria-hidden
        style={{ y: wordY }}
        className="text-outline pointer-events-none absolute -top-6 left-1/2 -z-10 -translate-x-1/2 select-none whitespace-nowrap text-[24vw] font-display italic leading-none opacity-[0.06] md:text-[18vw]"
      >
        academy
      </m.span>

      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <div className="flex items-center gap-4">
          <span className="text-xs uppercase tracking-[0.34em] text-text-primary">
            Rockstar Academy
          </span>
          <m.span
            initial={reduce ? undefined : { scaleX: 0 }}
            whileInView={reduce ? undefined : { scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="accent-gradient h-px flex-1 origin-left"
          />
          <span className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-muted">
            <m.span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-violet"
              animate={reduce ? undefined : { opacity: [1, 0.3, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            Em breve
          </span>
        </div>

        <m.h2
          {...rise}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          onViewportEnter={() => track('academy_view')}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-8 max-w-4xl text-4xl leading-[1.05] tracking-tight text-text-primary sm:text-5xl md:text-7xl"
        >
          Você já viu o nosso trabalho.
          <span className="mt-2 block text-muted">
            Agora vai poder{' '}
            <span className="font-display italic text-violet">aprender</span>{' '}
            <span className="text-text-primary">como fazemos.</span>
          </span>
        </m.h2>

        <m.p
          {...rise}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="mt-6 max-w-xl text-sm leading-relaxed text-muted md:text-base"
        >
          Os métodos, técnicas e detalhes por trás do Rockstar Studio estão
          prestes a sair do nosso espaço e chegar até você.
        </m.p>

        <div aria-hidden className="mt-10 flex items-center gap-3 text-muted">
          <span className="text-lg">↓</span>
          <span className="h-px w-16 bg-stroke" />
        </div>

        {/* Carrossel lateral (scroll horizontal com barra visível) em todos os
            tamanhos. */}
        <ul className="scroll-x-bar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 md:mt-8">
          {ACADEMY_COURSES.map((course, i) => (
            <CourseCard key={course.id} course={course} i={i} />
          ))}
        </ul>

        <m.div
          {...rise}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mt-16 flex flex-col items-start gap-5 border-t border-stroke pt-10 md:mt-20"
        >
          <div>
            <h3 className="text-2xl tracking-tight text-text-primary md:text-3xl">
              Seja uma das{' '}
              <span className="font-display italic text-violet">primeiras</span>{' '}
              a saber.
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
              A primeira novidade da Rockstar Academy será revelada em breve.
            </p>
          </div>

          <GlowButton
            href={bottomCta.href}
            external
            variant="solid"
            className="w-full sm:w-auto"
            onClick={() => track(bottomCta.event)}
          >
            {bottomCta.label}
            <span aria-hidden>→</span>
          </GlowButton>

          <p className="text-[11px] leading-relaxed text-muted">
            Sem spam. Apenas quando tivermos algo importante para revelar.
          </p>
        </m.div>
      </div>
    </section>
  )
}
