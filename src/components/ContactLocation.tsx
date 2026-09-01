import { m } from 'framer-motion'
import { INSTAGRAM_URL, WHATSAPP_URL } from '../constants'

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
]

export default function ContactLocation() {
  return (
    <section
      id="contato"
      className="relative scroll-mt-28 overflow-hidden bg-bg py-20 md:py-28"
    >
      <div className="pointer-events-none absolute left-[-12%] top-24 h-96 w-96 rounded-full bg-blood/10 blur-[76px]" />
      <div className="pointer-events-none absolute bottom-0 right-[-10%] h-96 w-96 rounded-full bg-purple/12 blur-[76px]" />

      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="mb-12 max-w-2xl"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="accent-gradient h-px w-8" />
            <span className="text-xs uppercase tracking-[0.3em] text-muted">
              Contato
            </span>
          </div>
          <h2 className="text-4xl tracking-tight text-text-primary md:text-5xl">
            Fale com o <span className="font-display italic text-violet">studio</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
            Agendamentos, dúvidas e referências pelos canais principais do Rockstar Studio — nail studio em Rio Verde - GO.
          </p>
        </m.div>

        <div className="grid gap-4 md:grid-cols-2">
            {CONTACTS.map((contact, i) => (
              <m.a
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
              </m.a>
            ))}
          </div>
      </div>
    </section>
  )
}
