import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import { WHATSAPP_URL } from '../constants'

const STEPS = [
  {
    title: 'Briefing visual',
    text: 'Você manda referências, formato desejado e vibe. A ideia vira uma direção de nail art antes do horário.',
  },
  {
    title: 'Execução autoral',
    text: 'O desenho é adaptado para sua mão, rotina e estilo: dark, kawaii, chrome, 3D ou mistura de tudo.',
  },
  {
    title: 'Finalização e cuidado',
    text: 'Você sai com orientações simples para preservar brilho, estrutura e detalhes até a manutenção.',
  },
]

const CARES = ['Evitar impacto nas primeiras horas', 'Usar óleo de cutícula', 'Não arrancar o alongamento', 'Agendar manutenção no prazo']

export default function ProcessCare() {
  return (
    <section id="processo" className="scroll-mt-24 bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Processo"
          title="Como a ideia"
          italic="vira unha"
          subtext="Do moodboard ao acabamento final, o atendimento é pensado para deixar sua mão com assinatura visual."
          cta={{ label: 'Agendar', href: WHATSAPP_URL, external: true }}
        />

        <div className="grid gap-5 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className="rounded-3xl border border-stroke bg-surface/45 p-6"
            >
              <span className="font-display text-5xl italic text-violet/80">
                0{i + 1}
              </span>
              <h3 className="mt-5 text-lg text-text-primary">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{step.text}</p>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ duration: 0.7 }}
          className="mt-6 flex flex-wrap gap-3 rounded-3xl border border-white/10 bg-black/25 p-4"
        >
          {CARES.map((care) => (
            <span
              key={care}
              className="rounded-full border border-white/10 bg-bg px-4 py-2 text-xs uppercase tracking-[0.14em] text-muted"
            >
              {care}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
