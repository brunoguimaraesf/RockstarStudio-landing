import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'

const ENTRIES = [
  {
    title: '[TÍTULO DO ARTIGO 1 — ex: referências dark para o verão]',
    read: '[X] min',
    date: '[DATA]',
    gradient: 'linear-gradient(135deg, #241a38, #121016)',
  },
  {
    title: '[TÍTULO DO ARTIGO 2 — ex: bastidores de um chrome perfeito]',
    read: '[X] min',
    date: '[DATA]',
    gradient: 'linear-gradient(135deg, #2e2b38, #15141a)',
  },
  {
    title: '[TÍTULO DO ARTIGO 3 — ex: como manter o alongamento]',
    read: '[X] min',
    date: '[DATA]',
    gradient: 'linear-gradient(135deg, #1d1430, #0f0d14)',
  },
  {
    title: '[TÍTULO DO ARTIGO 4 — ex: o processo autoral do studio]',
    read: '[X] min',
    date: '[DATA]',
    gradient: 'linear-gradient(135deg, #2b1f3e, #14101a)',
  },
]

export default function Journal() {
  return (
    <section id="journal" className="scroll-mt-24 bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Journal"
          title="Pensamentos"
          italic="recentes"
          subtext="Referências, bastidores e processos do studio."
          cta={{ label: 'Ver todos', href: '#' }}
        />

        <div className="flex flex-col gap-4">
          {ENTRIES.map((entry, i) => (
            <motion.a
              key={entry.title}
              href="#"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className="group flex items-center gap-6 rounded-[40px] border border-stroke bg-surface/30 p-4 transition-colors duration-300 hover:bg-surface sm:rounded-full"
            >
              <span
                className="h-14 w-14 shrink-0 rounded-2xl sm:rounded-full"
                style={{ background: entry.gradient }}
              />
              <span className="flex-1 text-sm text-text-primary md:text-base">
                {entry.title}
              </span>
              <span className="hidden text-xs text-muted sm:block">
                {entry.read}
              </span>
              <span className="pr-2 text-xs text-muted">{entry.date}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
