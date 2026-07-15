import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, m } from 'framer-motion'
import Footer from '../components/Footer'
import GlowButton from '../components/GlowButton'
import { WHATSAPP_PHONE, WHATSAPP_URL } from '../constants'
import { CartProvider } from '../lib/cart'
import { useCart } from '../lib/cartContext'
import { useProducts } from '../lib/useProducts'
import type { Product } from '../lib/sanity'

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

// URL da foto atrás do domínio do site (rewrite /foto/* no vercel.json e
// proxy equivalente no vite.config.ts) em vez do cdn.sanity.io cru
function maskedPhotoUrl(src: string) {
  const asset = src.split('/').pop()?.split('?')[0] ?? ''
  return `${window.location.origin}/foto/${asset}`
}

const ALL_CATEGORIES = 'Todas'

// Busca sem diferenciar acento/maiúscula ("gotica" encontra "Gótica")
function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

const CUSTOM_ORDER_MESSAGE =
  'Olá! Quero encomendar um press on personalizado. Já vou mandar a foto ou referência do modelo que eu quero.'

const customOrderUrl = WHATSAPP_PHONE
  ? `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(CUSTOM_ORDER_MESSAGE)}`
  : WHATSAPP_URL

function CustomOrderSection() {
  const steps = [
    {
      title: 'Mande sua referência',
      text: 'Envie uma foto, print ou ideia do modelo que você quer.',
    },
    {
      title: 'Criação sob medida',
      text: 'A artista cria o design exclusivo no tamanho exato das suas unhas.',
    },
    {
      title: 'Combine o valor',
      text: 'Preço e prazo são combinados direto na conversa, sem compromisso.',
    },
  ]

  return (
    <m.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65 }}
      aria-label="Press on personalizada"
      className="relative mt-16 overflow-hidden rounded-3xl border border-stroke bg-surface px-6 py-10 sm:px-10"
    >
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet/15 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-purple/10 blur-[110px]" />

      <div className="relative">
        <div className="mb-4 flex items-center gap-3">
          <span className="accent-gradient h-px w-8" />
          <span className="text-xs uppercase tracking-[0.3em] text-muted">
            Personalizadas
          </span>
        </div>
        <h2 className="text-2xl leading-tight tracking-tight text-text-primary sm:text-3xl md:text-4xl">
          Não achou o modelo?{' '}
          <span className="font-display italic text-violet">
            A gente cria pra você
          </span>
        </h2>

        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-violet/40 bg-violet/10 px-4 py-2 text-sm font-medium text-text-primary shadow-[0_0_24px_rgba(157,78,221,0.25)]">
          <span aria-hidden className="text-base">🚚</span>
          Enviamos para todo o Brasil
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,340px)_1fr] md:items-stretch">
          <img
            src="/images/loja/press-on-personalizada.png"
            alt="São unhas postiças artesanais, feitas com soft-gel, no tamanho exato das suas unhas."
            loading="lazy"
            className="aspect-[4/5] w-full rounded-2xl border border-stroke bg-black object-cover object-top md:aspect-auto md:h-full"
          />

          <div>
            <ol className="mt-8 grid gap-4 sm:grid-cols-3">
              {steps.map((step, i) => (
                <li
                  key={step.title}
                  className="rounded-2xl border border-stroke bg-bg/60 p-4"
                >
                  <span className="font-display text-2xl italic text-violet">
                    {i + 1}.
                  </span>
                  <p className="mt-2 text-sm font-medium text-text-primary">
                    {step.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-8">
              <GlowButton href={customOrderUrl} external variant="whatsapp">
                Pedir personalizada no WhatsApp
                <span aria-hidden>↗</span>
              </GlowButton>
            </div>
          </div>
        </div>
      </div>
    </m.section>
  )
}

function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [locked])
}

function QtyStepper({
  qty,
  onChange,
  compact,
}: {
  qty: number
  onChange: (qty: number) => void
  compact?: boolean
}) {
  const buttonClass = `flex shrink-0 items-center justify-center rounded-full border border-stroke bg-bg text-text-primary transition-colors duration-200 hover:border-violet/40 ${
    compact ? 'h-7 w-7 text-xs' : 'h-8 w-8 text-sm'
  }`
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Diminuir quantidade"
        onClick={() => onChange(qty - 1)}
        className={buttonClass}
      >
        −
      </button>
      <span className="min-w-5 text-center text-sm tabular-nums text-text-primary">
        {qty}
      </span>
      <button
        type="button"
        aria-label="Aumentar quantidade"
        onClick={() => onChange(qty + 1)}
        className={buttonClass}
      >
        +
      </button>
    </div>
  )
}

function ProductCard({
  product,
  index,
  onOpen,
}: {
  product: Product
  index: number
  onOpen: () => void
}) {
  const { items, add, setQty } = useCart()
  const inCart = items.find((item) => item.id === product.id)

  return (
    <m.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.05 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stroke bg-surface"
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Ver detalhes de ${product.name}`}
        className="relative block aspect-square w-full cursor-zoom-in overflow-hidden"
      >
        <img
          src={product.src}
          alt={`Press on ${product.name}`}
          loading="lazy"
          className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
            product.available ? 'opacity-90 group-hover:opacity-100' : 'opacity-40'
          }`}
        />
        {!product.available && (
          <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/85 backdrop-blur-sm">
            Esgotado
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <h3 className="text-sm text-text-primary sm:text-base">{product.name}</h3>
        {product.description && (
          <p className="line-clamp-3 text-xs leading-relaxed text-muted">
            {product.description}
          </p>
        )}
        <div className="mt-auto flex flex-col items-start gap-3 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-lg font-semibold leading-none text-text-primary sm:text-base">
            {brl.format(product.price)}
          </span>
          {!product.available ? (
            <span className="text-xs text-muted">Indisponível</span>
          ) : inCart ? (
            <QtyStepper
              compact
              qty={inCart.qty}
              onChange={(qty) => setQty(product.id, qty)}
            />
          ) : (
            <button
              type="button"
              onClick={() => add(product)}
              className="w-full rounded-full bg-text-primary px-3 py-2 text-xs font-medium text-bg transition-transform duration-200 hover:scale-105 sm:w-auto sm:px-4 sm:py-1.5"
            >
              Adicionar
            </button>
          )}
        </div>
      </div>
    </m.article>
  )
}

function ProductModal({
  product,
  onClose,
}: {
  product: Product | null
  onClose: () => void
}) {
  const { items, add, setQty } = useCart()
  const [qty, setLocalQty] = useState(1)
  const inCart = product
    ? items.find((item) => item.id === product.id)
    : undefined

  useLockBodyScroll(Boolean(product))

  useEffect(() => {
    if (!product) return
    setLocalQty(inCart?.qty ?? 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só ao abrir/trocar de produto
  }, [product])

  useEffect(() => {
    if (!product) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [product, onClose])

  const confirm = () => {
    if (!product) return
    add(product)
    setQty(product.id, qty)
    onClose()
  }

  return (
    <AnimatePresence>
      {product && (
        <>
          <m.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
          />
          <div
            className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto p-4"
            onClick={onClose}
          >
            <m.div
              key="modal"
              role="dialog"
              aria-modal="true"
              aria-label={product.name}
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={(event) => event.stopPropagation()}
              className="relative grid w-full max-w-3xl overflow-hidden rounded-3xl border border-stroke bg-bg sm:grid-cols-2"
            >
              <button
                type="button"
                aria-label="Fechar detalhes do produto"
                onClick={onClose}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-stroke bg-bg/80 text-muted backdrop-blur-sm transition-colors duration-200 hover:border-violet/40 hover:text-text-primary"
              >
                ✕
              </button>

              <div className="relative aspect-square sm:aspect-auto sm:min-h-[420px]">
                <img
                  src={product.src.replace('w=600', 'w=1000')}
                  alt={`Press on ${product.name}`}
                  className={`absolute inset-0 h-full w-full object-cover ${
                    product.available ? '' : 'opacity-40'
                  }`}
                />
                {!product.available && (
                  <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/85 backdrop-blur-sm">
                    Esgotado
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-4 p-6 sm:p-8">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.28em] text-muted">
                    Press On
                  </span>
                  <h2 className="mt-1 text-2xl text-text-primary md:text-3xl">
                    {product.name}
                  </h2>
                </div>
                <p className="text-xl font-semibold text-text-primary">
                  {brl.format(product.price)}
                </p>
                {product.description && (
                  <p className="whitespace-pre-line text-sm leading-relaxed text-muted">
                    {product.description}
                  </p>
                )}

                <div className="mt-auto space-y-4 pt-4">
                  {product.available ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted">Quantidade</span>
                        <QtyStepper
                          qty={qty}
                          onChange={(value) => setLocalQty(Math.max(1, value))}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={confirm}
                        className="w-full rounded-full bg-text-primary px-6 py-3.5 text-sm font-medium text-bg transition-transform duration-200 hover:scale-[1.02]"
                      >
                        {inCart
                          ? 'Atualizar carrinho'
                          : 'Adicionar ao carrinho'}{' '}
                        · {brl.format(product.price * qty)}
                      </button>
                    </>
                  ) : (
                    <p className="rounded-2xl border border-stroke bg-surface px-4 py-3 text-center text-sm text-muted">
                      Este kit está esgotado no momento.
                    </p>
                  )}
                </div>
              </div>
            </m.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, total, setQty, remove } = useCart()

  useLockBodyScroll(open)

  const message = useMemo(() => {
    const lines = items.map(
      (item) =>
        `• ${item.qty}× ${item.name} — ${brl.format(item.price * item.qty)}\n  Foto: ${maskedPhotoUrl(item.src)}`,
    )
    return [
      'Olá! Quero fazer um pedido de press on:',
      '',
      ...lines,
      '',
      `Total: ${brl.format(total)}`,
    ].join('\n')
  }, [items, total])

  const checkoutUrl = WHATSAPP_PHONE
    ? `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
    : WHATSAPP_URL

  const handleCheckout = () => {
    // Sem número configurado o link não pré-preenche a mensagem — copiamos o
    // pedido para a cliente colar na conversa
    if (!WHATSAPP_PHONE) {
      navigator.clipboard?.writeText(message).catch(() => {})
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <m.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          />
          <m.aside
            key="drawer"
            role="dialog"
            aria-label="Carrinho de pedidos"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-md flex-col border-l border-stroke bg-bg"
          >
            <div className="flex items-center justify-between border-b border-stroke px-6 py-5">
              <h2 className="font-display text-2xl italic text-text-primary">
                Seu pedido
              </h2>
              <button
                type="button"
                aria-label="Fechar carrinho"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stroke text-muted transition-colors duration-200 hover:border-violet/40 hover:text-text-primary"
              >
                ✕
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <p className="font-display text-xl italic text-text-primary">
                  Seu carrinho está vazio
                </p>
                <p className="max-w-xs text-sm text-muted">
                  Adicione os kits press on que você quer pedir.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 rounded-full bg-text-primary px-5 py-2 text-xs font-medium text-bg transition-transform duration-200 hover:scale-105"
                >
                  Ver produtos
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.src}
                        alt=""
                        className="h-16 w-16 shrink-0 rounded-xl border border-stroke object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-text-primary">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          {brl.format(item.price)} cada
                        </p>
                        <div className="mt-2">
                          <QtyStepper
                            compact
                            qty={item.qty}
                            onChange={(qty) => setQty(item.id, qty)}
                          />
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <button
                          type="button"
                          aria-label={`Remover ${item.name} do pedido`}
                          onClick={() => remove(item.id)}
                          className="text-xs text-muted transition-colors duration-200 hover:text-blood"
                        >
                          Remover
                        </button>
                        <span className="text-sm font-semibold text-text-primary">
                          {brl.format(item.price * item.qty)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="space-y-4 border-t border-stroke px-6 py-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Total</span>
                    <span className="text-lg font-semibold text-text-primary">
                      {brl.format(total)}
                    </span>
                  </div>
                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleCheckout}
                    className="group relative flex w-full transition-transform duration-300 hover:scale-[1.02]"
                  >
                    <span className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-transparent bg-blood px-7 py-3.5 text-sm font-medium text-white shadow-[0_0_24px_rgba(196,30,58,0.3)] transition-all duration-300 group-hover:bg-[#d92645] group-hover:shadow-[0_0_44px_rgba(196,30,58,0.55)]">
                      Fazer pedido no WhatsApp
                      <span aria-hidden>↗</span>
                    </span>
                  </a>
                  {!WHATSAPP_PHONE && (
                    <p className="text-center text-[11px] leading-relaxed text-muted">
                      Seu pedido é copiado automaticamente — é só colar na
                      conversa do WhatsApp.
                    </p>
                  )}
                  <p className="text-center text-[11px] leading-relaxed text-muted">
                    O pagamento e a entrega são combinados direto na conversa.
                  </p>
                </div>
              </>
            )}
          </m.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function ShopContent() {
  const products = useProducts()
  const { count } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const [selected, setSelected] = useState<Product | null>(null)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES)
  const isLoading = products === undefined
  const unavailable = products === null

  const categories = useMemo(() => {
    const unique: string[] = []
    for (const product of products ?? []) {
      if (product.category && !unique.includes(product.category)) {
        unique.push(product.category)
      }
    }
    return unique
  }, [products])

  const filtered = useMemo(() => {
    const term = normalizeText(search.trim())
    return (products ?? []).filter((product) => {
      if (
        activeCategory !== ALL_CATEGORIES &&
        product.category !== activeCategory
      ) {
        return false
      }
      if (!term) return true
      return normalizeText(
        `${product.name} ${product.description} ${product.category}`,
      ).includes(term)
    })
  }, [products, activeCategory, search])

  const clearFilters = () => {
    setSearch('')
    setActiveCategory(ALL_CATEGORIES)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="group relative ml-1 shrink-0"
          >
            <span className="animate-gradient-shift absolute -inset-[2px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-xs text-text-primary backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm">
              Carrinho
              {count > 0 && (
                <span className="accent-gradient flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold tabular-nums text-white">
                  {count}
                </span>
              )}
            </span>
          </button>
        </div>
      </header>

      <main className="relative overflow-hidden pb-16 pt-40 md:pb-24 md:pt-40">
        <div className="pointer-events-none absolute -top-24 left-[-10%] h-96 w-96 rounded-full bg-purple/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-[-12%] top-1/3 h-96 w-96 rounded-full bg-kawaii/10 blur-[140px]" />

        <div className="relative mx-auto max-w-[1200px] px-4 md:px-10 lg:px-16">
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="accent-gradient h-px w-8" />
              <span className="text-xs uppercase tracking-[0.3em] text-muted">
                Loja · Press On
              </span>
            </div>
            <h1 className="text-3xl leading-tight tracking-tight text-text-primary sm:text-4xl md:text-6xl">
              Press ons do{' '}
              <span className="font-display italic text-violet">studio</span>
            </h1>
            <p className="mt-3 max-w-md text-sm text-muted">
              Unhas postiças artesanais, feitas à mão no Rockstar Studio.
              Escolha seus kits, monte o pedido e finalize pelo WhatsApp.
            </p>
          </m.div>

          {isLoading ? (
            <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse overflow-hidden rounded-2xl border border-stroke bg-surface"
                >
                  <div className="aspect-square" />
                  <div className="space-y-2 p-4">
                    <div className="h-4 w-2/3 rounded bg-stroke/60" />
                    <div className="h-3 w-full rounded bg-stroke/40" />
                    <div className="h-4 w-1/3 rounded bg-stroke/60" />
                  </div>
                </div>
              ))}
            </div>
          ) : unavailable || products.length === 0 ? (
            <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-stroke bg-surface px-6 py-20 text-center">
              <p className="font-display text-2xl italic text-text-primary">
                {unavailable
                  ? 'Catálogo indisponível no momento'
                  : 'Nenhum press on cadastrado ainda'}
              </p>
              <p className="max-w-sm text-sm text-muted">
                {unavailable
                  ? 'Mas o pedido não para: chame no WhatsApp e a gente monta seu kit por lá.'
                  : 'Os primeiros kits estão chegando. Enquanto isso, chame no WhatsApp para encomendar o seu.'}
              </p>
              <GlowButton href={WHATSAPP_URL} external variant="cta">
                Pedir pelo WhatsApp
                <span aria-hidden>↗</span>
              </GlowButton>
            </div>
          ) : (
            <>
              <div className="mt-10 flex flex-col gap-4">
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por nome, estilo ou detalhe..."
                  aria-label="Buscar press on"
                  className="w-full max-w-md rounded-full border border-stroke bg-surface px-5 py-3 text-sm text-text-primary placeholder:text-muted focus:border-violet/50 focus:outline-none"
                />
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2.5">
                    {[ALL_CATEGORIES, ...categories].map((category) => (
                      <button
                        key={category}
                        type="button"
                        aria-pressed={activeCategory === category}
                        onClick={() => setActiveCategory(category)}
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
              </div>

              {filtered.length === 0 ? (
                <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-stroke bg-surface px-6 py-16 text-center">
                  <p className="font-display text-2xl italic text-text-primary">
                    Nenhum press on encontrado
                  </p>
                  <p className="max-w-sm text-sm text-muted">
                    Tente outra busca ou categoria — ou peça um modelo
                    personalizado logo abaixo.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-2 rounded-full bg-text-primary px-5 py-2 text-xs font-medium text-bg transition-transform duration-200 hover:scale-105"
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : (
                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                  {filtered.map((product, i) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={i}
                      onOpen={() => setSelected(product)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {count > 0 && (
            <div className="mt-14 flex justify-center">
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="group relative inline-flex transition-transform duration-300 hover:scale-105"
              >
                <span className="flex items-center gap-2 rounded-full border-2 border-transparent bg-blood px-7 py-3.5 text-sm font-medium text-white shadow-[0_0_24px_rgba(196,30,58,0.3)] transition-all duration-300 group-hover:bg-[#d92645] group-hover:shadow-[0_0_44px_rgba(196,30,58,0.55)]">
                  Revisar pedido ({count} {count === 1 ? 'item' : 'itens'})
                </span>
              </button>
            </div>
          )}

          <CustomOrderSection />
        </div>
      </main>

      <ProductModal product={selected} onClose={() => setSelected(null)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <Footer />
    </div>
  )
}

export default function Shop() {
  return (
    <CartProvider>
      <ShopContent />
    </CartProvider>
  )
}
