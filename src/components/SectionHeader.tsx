import { motion } from 'framer-motion'
import GlowButton from './GlowButton'

type SectionHeaderProps = {
  eyebrow: string
  title: string
  italic: string
  subtext: string
  cta?: { label: string; href: string; external?: boolean }
}

export default function SectionHeader({
  eyebrow,
  title,
  italic,
  subtext,
  cta,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between"
    >
      <div>
        <div className="mb-4 flex items-center gap-3">
          <span className="accent-gradient h-px w-8" />
          <span className="text-xs uppercase tracking-[0.3em] text-muted">
            {eyebrow}
          </span>
        </div>
        <h2 className="text-4xl tracking-tight text-text-primary md:text-5xl">
          {title} <span className="font-display italic text-violet">{italic}</span>
        </h2>
        <p className="mt-3 max-w-md text-sm text-muted">{subtext}</p>
      </div>
      {cta && (
        <GlowButton
          href={cta.href}
          external={cta.external}
          className="hidden md:inline-flex"
        >
          {cta.label}
          <span aria-hidden>→</span>
        </GlowButton>
      )}
    </motion.div>
  )
}
