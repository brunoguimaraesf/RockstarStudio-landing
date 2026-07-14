import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { m } from 'framer-motion'
import Footer from '../components/Footer'
import GlowButton from '../components/GlowButton'
import { WHATSAPP_URL } from '../constants'
import { usePhotos } from '../lib/usePhotos'
import { WORK_IMAGES } from '../media'

const ALL_CATEGORIES = 'Todas'
const FEATURED_CATEGORY = 'Destaques'

type GalleryItem = {
  title: string
  category: string
  src: string
}

function GalleryGrid({ photos }: { photos: GalleryItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {photos.map((photo, i) => (
        <m.figure
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
        </m.figure>
      ))}
    </div>
  )
}

export default function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams()
  const photos = usePhotos()
  const isLoading = photos === undefined
  // null/vazio = CMS indisponível ou sem fotos → fallback estático de media.ts
  const items: GalleryItem[] = useMemo(
    () => (photos && photos.length > 0 ? photos : WORK_IMAGES),
    [photos],
  )
  const featuredPhotos = useMemo(
    () => (photos ?? []).filter((photo) => photo.featured),
    [photos],
  )

  const categories = useMemo(() => {
    const unique: string[] = []
    for (const item of items) {
      if (!unique.includes(item.category)) unique.push(item.category)
    }
    return unique
  }, [items])

  const selectableCategories = useMemo(
    () =>
      featuredPhotos.length > 0
        ? [FEATURED_CATEGORY, ...categories]
        : categories,
    [featuredPhotos, categories],
  )

  const categoryParam =
    searchParams.get('categoria') ?? searchParams.get('category')
  const requestedCategory =
    categoryParam && selectableCategories.includes(categoryParam)
      ? categoryParam
      : ALL_CATEGORIES
  const [activeCategory, setActiveCategory] = useState(requestedCategory)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    setActiveCategory(requestedCategory)
  }, [requestedCategory])

  const groupedItems = useMemo(() => {
    const groups = categories.map((category) => ({
      category,
      photos: items.filter((item) => item.category === category),
    }))
    return featuredPhotos.length > 0
      ? [{ category: FEATURED_CATEGORY, photos: featuredPhotos }, ...groups]
      : groups
  }, [categories, items, featuredPhotos])

  const filtered =
    activeCategory === ALL_CATEGORIES
      ? items
      : activeCategory === FEATURED_CATEGORY
        ? featuredPhotos
        : items.filter((item) => item.category === activeCategory)

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    if (category === ALL_CATEGORIES) {
      setSearchParams({})
      return
    }
    setSearchParams({ categoria: category })
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="fixed left-0 right-0 top-0 z-50 flex justify-center px-2 pt-[calc(env(safe-area-inset-top)+0.75rem)] md:px-3 md:pt-6">
        <div className="inline-flex max-w-[calc(100vw-1rem)] items-center gap-1 rounded-full border border-white/10 bg-surface/90 px-2 py-2 shadow-[0_14px_50px_rgba(0,0,0,0.45)] backdrop-blur-md">
          <Link
            to="/"
            aria-label="Voltar para a pagina principal"
            className="group relative shrink-0"
          >
            <span className="animate-gradient-shift absolute -inset-[2px] rounded-full opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative flex items-center gap-2 rounded-full bg-text-primary px-4 py-2 text-xs font-semibold text-bg transition-transform duration-300 group-hover:scale-[1.02] sm:px-5 sm:py-2.5 sm:text-sm">
              <span aria-hidden>←</span>
              <span className="sm:hidden">Voltar</span>
              <span className="hidden sm:inline">
                Voltar para pagina principal
              </span>
            </span>
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

      <main className="relative overflow-hidden pb-16 pt-40 md:pb-24 md:pt-40">
        <div className="pointer-events-none absolute -top-24 left-[-10%] h-96 w-96 rounded-full bg-purple/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-[-12%] top-1/3 h-96 w-96 rounded-full bg-violet/10 blur-[140px]" />

        <div className="relative mx-auto max-w-[1200px] px-4 md:px-10 lg:px-16">
          <m.div
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
            <h1 className="text-3xl leading-tight tracking-tight text-text-primary sm:text-4xl md:text-6xl">
              Galeria do{' '}
              <span className="font-display italic text-violet">studio</span>
            </h1>
            <p className="mt-3 max-w-md text-sm text-muted">
              Uma seleção ampliada dos trabalhos do Rockstar Studio, organizada por categoria.
            </p>
          </m.div>

          {!isLoading && categories.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2.5">
              {[ALL_CATEGORIES, ...selectableCategories].map((category) => (
                <button
                  key={category}
                  type="button"
                  aria-pressed={activeCategory === category}
                  onClick={() => handleCategoryChange(category)}
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
                Em breve tem foto nova nesta categoria.
              </p>
            </div>
          ) : activeCategory === ALL_CATEGORIES ? (
            <div className="mt-12 space-y-14">
              {groupedItems.map((group) => (
                <m.section
                  key={group.category}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.65 }}
                >
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.28em] text-muted">
                        Categoria
                      </span>
                      <h2 className="mt-1 text-2xl text-text-primary md:text-3xl">
                        {group.category}
                      </h2>
                    </div>
                    <span className="rounded-full border border-stroke bg-surface px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-muted">
                      {group.photos.length} fotos
                    </span>
                  </div>
                  <GalleryGrid photos={group.photos} />
                </m.section>
              ))}
            </div>
          ) : (
            <div className="mt-10">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.28em] text-muted">
                    Categoria selecionada
                  </span>
                  <h2 className="mt-1 text-2xl text-text-primary md:text-3xl">
                    {activeCategory}
                  </h2>
                </div>
                <span className="rounded-full border border-stroke bg-surface px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-muted">
                  {filtered.length} fotos
                </span>
              </div>
              <GalleryGrid photos={filtered} />
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
