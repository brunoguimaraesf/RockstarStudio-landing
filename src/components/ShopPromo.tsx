import { m } from 'framer-motion'
import GlowButton from './GlowButton'

const PROMO_IMAGES = [
  {
    src: '/images/works/KAWAI%202.webp',
    alt: 'Press on kawaii',
    className: 'left-[4%] top-[16%] w-32 md:w-40',
    rotate: '-8deg',
    delay: '0s',
  },
  {
    src: '/images/works/GOTICO%201.webp',
    alt: 'Press on gótica',
    className: 'left-[34%] top-[2%] z-10 w-36 md:w-44',
    rotate: '4deg',
    delay: '1.6s',
  },
  {
    src: '/images/works/AUTORAL%201.webp',
    alt: 'Press on autoral',
    className: 'right-[4%] top-[22%] w-32 md:w-40',
    rotate: '9deg',
    delay: '3.2s',
  },
]

const MARQUEE_ITEMS = [
  'Press on artesanais',
  'Feitas à mão no studio',
  'Escolha, peça e receba',
  'Pedido pelo WhatsApp',
]

export default function ShopPromo() {
  return (
    <section className="relative px-6 py-20 md:px-10 md:py-24 lg:px-16">
      <div className="mx-auto max-w-[1200px]">
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="animate-gradient-shift rounded-[26px] p-[1.5px]"
        >
          <div className="relative overflow-hidden rounded-3xl bg-bg">
            <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-purple/15 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-kawaii/10 blur-[110px]" />

            <div className="relative grid items-center gap-10 p-8 md:grid-cols-2 md:p-12 lg:p-14">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-kawaii/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-kawaii">
                  <span aria-hidden>✦</span>
                  Novidade
                </span>
                <h2 className="mt-5 text-3xl tracking-tight text-text-primary md:text-5xl">
                  Unhas do studio,{' '}
                  <span className="font-display italic text-violet">
                    prontas para usar
                  </span>
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-muted md:text-base">
                  Kits de press on feitos à mão, com o mesmo capricho das unhas
                  do atendimento. Escolha o seu na loja, monte o pedido e
                  finalize direto no WhatsApp.
                </p>
                <div className="mt-8">
                  <GlowButton href="/loja" variant="solid">
                    Conhecer os press ons
                    <span aria-hidden>→</span>
                  </GlowButton>
                </div>
              </div>

              <div className="relative min-h-[260px] md:min-h-[320px]">
                {PROMO_IMAGES.map((image) => (
                  <div
                    key={image.src}
                    className={`animate-float absolute ${image.className}`}
                    style={
                      {
                        '--float-rotate': image.rotate,
                        animationDelay: image.delay,
                      } as React.CSSProperties
                    }
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      className="aspect-[4/5] w-full rounded-2xl border border-stroke object-cover shadow-[0_18px_50px_rgba(0,0,0,0.5)]"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden border-t border-stroke/60 py-3">
              <div className="animate-marquee flex w-max items-center gap-8">
                {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                  <span
                    key={`${item}-${i}`}
                    className="flex items-center gap-8 whitespace-nowrap text-[11px] uppercase tracking-[0.24em] text-muted"
                  >
                    {item}
                    <span aria-hidden className="text-violet">
                      ✦
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </m.div>
      </div>
    </section>
  )
}
