import { motion } from 'framer-motion'
import GlowButton from './GlowButton'
import { INSTAGRAM_URL } from '../constants'
import { WORK_IMAGES } from '../media'

const FEED_IMAGES = WORK_IMAGES.slice(-6)

export default function InstagramFeed() {
  return (
    <section id="instagram" className="relative scroll-mt-24 overflow-hidden bg-bg py-16 md:py-24">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/10 blur-[120px]" />
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="accent-gradient h-px w-8" />
              <span className="text-xs uppercase tracking-[0.3em] text-muted">
                Instagram
              </span>
            </div>
            <h2 className="text-4xl tracking-tight text-text-primary md:text-5xl">
              Feed do{' '}
              <span className="font-display italic text-violet">studio</span>
            </h2>
            <p className="mt-3 max-w-md text-sm text-muted">
              Acompanhe trabalhos recentes, bastidores e agenda direto no perfil.
            </p>
          </div>
          <GlowButton href={INSTAGRAM_URL} external className="hidden md:inline-flex">
            Abrir @_rockstarstudio
            <span aria-hidden>↗</span>
          </GlowButton>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {FEED_IMAGES.map((image, i) => (
            <motion.a
              key={image.src}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.04 }}
              className="group relative aspect-square overflow-hidden rounded-3xl border border-stroke bg-surface"
            >
              <img
                src={image.src}
                alt={`${image.title} no Instagram do Rockstar Studio`}
                loading="lazy"
                className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-110 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/35" />
              <span className="absolute inset-x-3 bottom-3 rounded-full bg-black/50 px-3 py-1.5 text-center text-[10px] uppercase tracking-[0.14em] text-white/85 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                Ver no Instagram
              </span>
            </motion.a>
          ))}
        </div>

        <div className="mt-6 md:hidden">
          <GlowButton href={INSTAGRAM_URL} external>
            Abrir @_rockstarstudio
            <span aria-hidden>↗</span>
          </GlowButton>
        </div>
      </div>
    </section>
  )
}
