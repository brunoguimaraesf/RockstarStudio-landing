import { motion } from 'framer-motion'
import GlowButton from './GlowButton'
import { INSTAGRAM_URL, MAPS_URL, STUDIO_ADDRESS, WHATSAPP_URL } from '../constants'

const CONTACTS = [
  {
    label: 'WhatsApp',
    detail: 'Agendamentos, dúvidas e horários disponíveis.',
    href: WHATSAPP_URL,
    cta: 'Chamar agora',
  },
  {
    label: 'Instagram',
    detail: 'Portfólio, bastidores, agenda e referências do studio.',
    href: INSTAGRAM_URL,
    cta: '@_rockstarstudio',
  },
  {
    label: 'Google Maps',
    detail: 'Rota direta até o endereço do atendimento.',
    href: MAPS_URL,
    cta: 'Abrir rota',
  },
]

export default function ContactLocation() {
  return (
    <section
      id="contato"
      className="relative scroll-mt-28 overflow-hidden bg-bg py-20 md:py-28"
    >
      <div className="pointer-events-none absolute left-[-12%] top-24 h-96 w-96 rounded-full bg-blood/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-[-10%] h-96 w-96 rounded-full bg-purple/12 blur-[120px]" />

      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="mb-12 max-w-2xl"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="accent-gradient h-px w-8" />
            <span className="text-xs uppercase tracking-[0.3em] text-muted">
              Localização e contato
            </span>
          </div>
          <h2 className="text-4xl tracking-tight text-text-primary md:text-5xl">
            Chegue no <span className="font-display italic text-violet">studio</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
            Atendimento no centro, com rota direta pelo Maps e todos os canais principais para falar com o Rockstar Studio.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <motion.article
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface p-6 shadow-2xl shadow-black/30 md:p-8"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(157,78,221,0.18),transparent_38%)]" />
            <div className="absolute inset-x-0 bottom-0 h-px accent-gradient" />
            <div className="relative z-10 flex h-full flex-col justify-between gap-10">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-muted">
                  Endereço
                </p>
                <h3 className="mt-4 max-w-2xl text-2xl leading-tight text-text-primary md:text-4xl">
                  Centro, Rua Henriqueta Assunção N° 150 C2
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
                  Portão de grade marrom ao lado da escola Oscar Ribeiro.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <p className="rounded-2xl border border-white/10 bg-bg/60 p-4 text-sm leading-6 text-text-primary">
                  {STUDIO_ADDRESS}
                </p>
                <GlowButton href={MAPS_URL} external variant="cta" className="sm:justify-self-end">
                  Ver rota
                  <span aria-hidden>↗</span>
                </GlowButton>
              </div>
            </div>
          </motion.article>

          <div className="grid gap-4">
            {CONTACTS.map((contact, i) => (
              <motion.a
                key={contact.label}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.65, delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-3xl border border-stroke bg-surface p-5 transition duration-300 hover:-translate-y-1 hover:border-violet/50 hover:shadow-xl hover:shadow-purple/10"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-violet via-blood to-purple opacity-80" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg text-text-primary">{contact.label}</p>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
                      {contact.detail}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-text-primary transition-colors duration-300 group-hover:border-violet/60">
                    {contact.cta} ↗
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
