import { m } from 'framer-motion'
import SectionHeader from './SectionHeader'
import { WHATSAPP_URL } from '../constants'
import { CLIENT_TYPE_IMAGES } from '../media'

const CLIENT_TYPES = [
  'Quem ama unha dark e gótica',
  'Quem quer algo delicado, mas nada óbvio',
  'Quem chega com referência cheia de detalhe',
  'Quem quer uma unha para evento ou ensaio',
  'Quem gosta de misturar estilos no mesmo set',
]

export default function ClientTypes() {
  const [cover, ...cards] = CLIENT_TYPE_IMAGES
  const leftCards = cards.slice(0, 2)
  const rightCards = cards.slice(2, 4)
  const bottomCard = cards[4]

  return (
    <section id="clientes" className="relative scroll-mt-28 overflow-hidden bg-bg py-20 md:py-28">
      <div className="pointer-events-none absolute right-[-12%] top-10 h-96 w-96 rounded-full bg-purple/10 blur-[120px]" />
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Clientes"
          title="Tipos de cliente"
          italic="que atendo"
          subtext="Do visual mais delicado ao mais pesado, o foco é adaptar a nail art ao seu estilo real."
          cta={{ label: 'Quero agendar', href: WHATSAPP_URL, external: true }}
        />
      </div>

      <div className="mx-auto grid max-w-[1380px] grid-cols-1 gap-5 px-6 md:px-10 lg:grid-cols-[minmax(0,1fr)_390px_minmax(0,1fr)] lg:items-center lg:gap-8 lg:px-12 xl:grid-cols-[minmax(0,1fr)_430px_minmax(0,1fr)]">
        <div className="order-2 grid gap-5 sm:grid-cols-2 lg:order-1 lg:grid-cols-1 lg:justify-items-end">
          {leftCards.map((item, i) => (
            <ClientTypeCard key={item.src} item={item} index={i} />
          ))}
        </div>

        <m.div
          initial={{ opacity: 0, scale: 0.92, y: 28 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="relative order-1 mx-auto aspect-[4/5] w-full max-w-[410px] overflow-hidden rounded-[2rem] border border-white/15 bg-surface shadow-2xl shadow-black/40 lg:order-2 lg:w-full"
        >
          <img
            src={cover.src}
            alt="Tipos de clientes Rockstar Studio"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/72 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(157,78,221,0.16),transparent_40%)] mix-blend-screen" />
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted">
              
            </p>
            <h3 className="mx-auto mt-1.5 max-w-[240px] text-base leading-snug tracking-tight text-text-primary md:text-lg">

            </h3>
          </div>
        </m.div>

        <div className="order-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-1 lg:justify-items-start">
          {rightCards.map((item, i) => (
            <ClientTypeCard key={item.src} item={item} index={i + 2} />
          ))}
        </div>

        {bottomCard && (
          <div className="order-4 sm:col-span-1 lg:col-span-3 lg:flex lg:justify-center">
            <ClientTypeCard item={bottomCard} index={4} compact />
          </div>
        )}
      </div>
    </section>
  )
}

type ClientTypeCardProps = {
  item: { src: string }
  index: number
  compact?: boolean
}

function ClientTypeCard({ item, index, compact }: ClientTypeCardProps) {
  return (
    <m.article
      initial={{ opacity: 0, scale: 0.9, y: 26 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.65, delay: index * 0.07 }}
      className={`group relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-stroke bg-surface shadow-xl shadow-black/25 ${
        compact ? 'mx-auto max-w-[390px]' : 'max-w-[390px]'
      }`}
    >
      <img
        src={item.src}
        alt={CLIENT_TYPES[index]}
        loading="lazy"
        className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/14 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3">
        <span className="mb-1.5 inline-flex rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-muted backdrop-blur-sm">
          Tipo 0{index + 1}
        </span>
        <p className="text-xs leading-5 text-text-primary md:text-sm">{CLIENT_TYPES[index]}</p>
      </div>
    </m.article>
  )
}





