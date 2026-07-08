import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import GlowButton from '../components/GlowButton'
import { WHATSAPP_URL } from '../constants'
import { usePhotos } from '../lib/usePhotos'
import { WORK_IMAGES } from '../media'

const ALL_CATEGORIES = 'Todas'

type GalleryItem = {
  title: string
  category: string
  src: string
}

export default function Gallery() {
  const photos = usePhotos()
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const isLoading = photos === undefined
  const items = useMemo<GalleryItem[]>(() => {
    if (photos === undefined) return []
    if (photos === null) return WORK_IMAGES
    return photos
  }, [photos])

  const categories = useMemo(() => {
    const unique: string[] = []
    for (const item of items) {
      if (!unique.includes(item.category)) unique.push(item.category)
    }
    return unique
  }, [items])

  useEffect(() => {
    if (
      activeCategory !== ALL_CATEGORIES &&
      !categories.includes(activeCategory)
    ) {
      setActiveCategory(ALL_CATEGORIES)
    }
  }, [activeCategory, categories])

  const filtered =
    activeCategory === ALL_CATEGORIES
      ? items
      : items.filter((item) => item.category === activeCategory)

  return (
    <div className="min-h-screen bg-bg">
      <header className="fixed left-0 right-0 top-0 z-50 flex justify-center px-3 pt-4 md:pt-6">
        <div className="inline-flex max-w-full items-center rounded-full border border-white/10 bg-surface px-2 py-2 backdrop-blur-md">
          <Link
            to="/"
            aria-label="Rockstar Studio - voltar ao inicio"
            className="flex h-9 w-9 shrink-0 rounded-full bg-[linear-gradient(90deg,#9D4EDD,#7B2FF7)] p-[2px] transition-transform duration-300 hover:scale-110"
          >
            <span className="flex h-full w-full items-center justify-center rounded-full bg-bg font-display text-[13px] italic text-text-primary">
              RS
            </span>
          </Link>
          <Link
            to="/"
            className="rounded-full px-3 py-1.5 text-xs text-muted transition-colors duration-200 hover:bg-stroke/50 hover:text-text-primary sm:px-4 sm:py-2 sm:text-sm"
          >
            Voltar ao inicio
          </Link>
          <span className="mx-1 hidden h-5 w-px shrink-0 bg-stroke md:block" />
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative ml-1 shrink-0"
          >
            <span className="animate-gradient-shift absolute -inset-[2px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative flex items-center gap-1 rounded-full bg-surface px-3 py-1.5 text-xs text-text-primary backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm">
              Agendar
              <span aria-hidden>↗</span>
            </span>
          </a>
        </div>
      </header>

      <main className="relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="pointer-events-none absolute -top-24 left-[-10%] h-96 w-96 rounded-full bg-purple/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-[-12%] top-1/3 h-96 w-96 rounded-full bg-violet/10 blur-[140px]" />

        <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="accent-gradient h-px w-8" />
              <span className="text-xs uppercase tracking-[0.3em] text-muted">
                Portfolio completo
              </span>
            </div>
            <h1 className="text-4xl tracking-tight text-text-primary md:text-6xl">
              Galeria do{' '}
              <span className="font-display italic text-violet">studio</span>
            </h1>
            <p className="mt-3 max-w-md text-sm text-muted">
              Todos os trabalhos, separados por categoria e prontos para receber
              novas fotos direto do painel da artista.
            </p>
          </motion.div>

          {!isLoading && categories.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2.5">
              {[ALL_CATEGORIES, ...categories].map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 ${
                    activeCategory === category
                      ? 'border-transparent bg-text-primary text-bg'
                      : 'border-stroke bg-surface text-muted hover:border-violet/40 hover:text-text-primary'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] animate-pulse rounded-2xl border border-stroke bg-surface"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-stroke bg-surface px-6 py-20 text-center">
              <p className="font-display text-2xl italic text-text-primary">
                Nenhuma foto por aqui ainda
              </p>
              <p className="max-w-sm text-sm text-muted">
                As novidades aparecem primeiro no painel da artista. Em breve
                tem foto nova nesta categoria.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {filtered.map((photo, i) => (
                <motion.figure
                  key={`${photo.src}-${i}`}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: (i % 4) * 0.05 }}
                  className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-stroke bg-surface"
                >
                  <img
                    src={photo.src}
                    alt={`${photo.title} - nail art ${photo.category}`}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                  />
                  <figcaption>
                    <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="absolute bottom-2.5 left-3 right-3 text-[10px] uppercase tracking-[0.14em] text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {photo.category}
                    </span>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          )}

          <div className="mt-14 flex justify-center">
            <GlowButton href={WHATSAPP_URL} external variant="cta">
              Agendar uma nail art
              <span aria-hidden>↗</span>
            </GlowButton>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

