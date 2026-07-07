import { motion } from 'framer-motion'
import GlowButton from './GlowButton'
import { INSTAGRAM_URL, WHATSAPP_URL } from '../constants'

const ARTIST_IMAGE = '/images/playground/GIOR%202.jpg'

export default function AboutArtist() {
  return (
    <section id="sobre" className="relative scroll-mt-24 overflow-hidden bg-bg py-16 md:py-24">
      <div className="pointer-events-none absolute left-[-12%] top-10 h-80 w-80 rounded-full bg-violet/10 blur-[110px]" />
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 md:grid-cols-[0.9fr_1.1fr] md:items-center md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-stroke bg-surface"
        >
          <img
            src={ARTIST_IMAGE}
            alt="Artista do Rockstar Studio"
            className="h-full w-full object-cover object-[50%_30%] opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(157,78,221,0.22),transparent_40%)] mix-blend-screen" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.08 }}
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="accent-gradient h-px w-8" />
            <span className="text-xs uppercase tracking-[0.3em] text-muted">
              Sobre mim
            </span>
          </div>
          <h2 className="max-w-2xl text-4xl tracking-tight text-text-primary md:text-5xl">
            Nail artist por trás do{' '}
            <span className="font-display italic text-violet">Rockstar Studio</span>
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-muted md:text-base">
            Crio unhas com estética alternativa, dark, kawaii e autoral para quem
            quer transformar a mão em parte do look. Cada atendimento mistura
            referência, acabamento técnico e uma leitura do seu estilo.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted md:text-base">
            A proposta é sair do básico: formatos marcantes, detalhes cromados,
            aplicações 3D, desenhos delicados ou composições mais pesadas quando
            a ideia pede impacto.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <GlowButton href={WHATSAPP_URL} external variant="cta">
              Agendar horário
              <span aria-hidden>↗</span>
            </GlowButton>
            <GlowButton href={INSTAGRAM_URL} external>
              Ver Instagram
            </GlowButton>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

