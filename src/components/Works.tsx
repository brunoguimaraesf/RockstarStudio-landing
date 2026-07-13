import { m } from 'framer-motion'
import { Link } from 'react-router-dom'
import GlowButton from './GlowButton'
import SectionHeader from './SectionHeader'

const FEATURED = [
  {
    title: 'Alternativa',
    span: 'md:col-span-7',
    image: '/images/works/ALTERNATIVA%201.webp',
    gradient: 'linear-gradient(135deg, #110b12 0%, #2b1328 48%, #5c1022 100%)',
    tags: ['Alternativa', 'Chrome'],
  },
  {
    title: 'Kawaii',
    span: 'md:col-span-5',
    image: '/images/works/KAWAI%202.webp',
    gradient: 'linear-gradient(135deg, #151018 0%, #2c1f36 52%, #f2a6c1 130%)',
    tags: ['Kawaii', '3D'],
  },
  {
    title: 'Gótica',
    span: 'md:col-span-5',
    image: '/images/works/GOTICO%201.webp',
    gradient: 'linear-gradient(135deg, #09080b 0%, #1d1430 52%, #7b2ff7 120%)',
    tags: ['Gótica', 'Dark'],
  },
  {
    title: 'Autoral',
    span: 'md:col-span-7',
    image: '/images/works/AUTORAL%201.webp',
    gradient: 'linear-gradient(135deg, #171015 0%, #301725 48%, #7b1022 100%)',
    tags: ['Autoral', 'Editorial'],
  },
]

const galleryCategoryHref = (category: string) =>
  `/galeria?categoria=${encodeURIComponent(category)}`

export default function Works() {
  return (
    <section
      id="trabalhos"
      className="relative scroll-mt-24 overflow-hidden bg-bg py-12 md:py-16"
    >
      {/* Luz roxa ambiente */}
      <div className="pointer-events-none absolute -top-24 right-[-10%] h-96 w-96 rounded-full bg-purple/10 blur-[120px]" />
      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Trabalhos selecionados"
          title="Trabalhos em"
          italic="destaque"
          subtext="Uma seleção de nail arts do studio do conceito ao acabamento."
          cta={{ label: 'Ver galeria', href: '/galeria' }}
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
          {FEATURED.map((project, i) => (
            <m.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: (i % 2) * 0.1 }}
              className={project.span}
            >
              <Link
                to={galleryCategoryHref(project.title)}
                className="group relative block aspect-[4/3] overflow-hidden rounded-3xl border border-stroke bg-surface"
              >
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                  style={{ background: project.gradient }}
                >
                  <img
                    src={project.image}
                    alt={`Unhas ${project.title.toLowerCase()} do Rockstar Studio`}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-95 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/16 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_18%,rgba(157,78,221,0.2),transparent_38%)] mix-blend-screen" />
                </div>

                <div className="halftone absolute inset-0 opacity-15 mix-blend-multiply" />

                <div className="absolute bottom-4 left-5 flex flex-wrap items-center gap-2.5 pr-4">
                  <span className="text-sm text-text-primary/90">
                    {project.title}
                  </span>
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wider backdrop-blur-sm ${
                        tag === 'Kawaii'
                          ? 'border-kawaii/50 bg-kawaii/10 text-kawaii'
                          : 'border-white/10 bg-black/40 text-muted'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="absolute inset-0 flex items-center justify-center bg-bg/70 opacity-0 backdrop-blur-lg transition-opacity duration-500 group-hover:opacity-100">
                  <span className="relative">
                    <span className="animate-gradient-shift absolute -inset-[2px] rounded-full" />
                    <span className="relative flex items-center rounded-full bg-white px-5 py-2.5 text-sm text-black">
                      Ver categoria&nbsp;—&nbsp;
                      <span className="font-display italic">
                        {project.title}
                      </span>
                    </span>
                  </span>
                </div>
              </Link>
            </m.div>
          ))}
        </div>

        <m.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.55 }}
          className="mt-8 flex flex-col items-center gap-4 rounded-3xl border border-violet/30 bg-surface/70 px-5 py-7 text-center shadow-[0_0_50px_rgba(123,47,247,0.12)] backdrop-blur-md"
        >
          <p className="max-w-xl text-sm text-muted">
            Curtiu algum estilo? A galeria completa separa os trabalhos por
            categoria para encontrar sua referência com mais facilidade.
          </p>
          <GlowButton href="/galeria" variant="solid">
            Ver galeria completa
            <span aria-hidden>↗</span>
          </GlowButton>
        </m.div>
      </div>
    </section>
  )
}
