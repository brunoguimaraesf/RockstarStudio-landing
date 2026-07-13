import { m } from 'framer-motion'

const STATS = [
  { value: '[02]+', label: 'Anos de experiência' },
  { value: '[200]+', label: 'Trabalhos entregues' },
  { value: '[100]%', label: 'Clientes satisfeitas' },
]

export default function Stats() {
  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-6 md:grid-cols-3 md:px-10 lg:px-16">
        {STATS.map((stat, i) => (
          <m.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            className="border-t border-stroke pt-6"
          >
            <p className="font-display text-6xl text-violet md:text-7xl">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-muted">{stat.label}</p>
          </m.div>
        ))}
      </div>
    </section>
  )
}
