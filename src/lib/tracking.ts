// Tracking seguro e sem dependências. O site ainda NÃO tem GA/GTM/Meta Pixel;
// este helper apenas entrega o evento para o que existir no window (dataLayer
// do GTM, gtag do GA4 ou fbq do Meta Pixel). Enquanto nada estiver instalado,
// é um no-op — os botões já ficam "preparados" para o tracking futuro.

type TrackParams = Record<string, unknown>

type TrackingWindow = Window & {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
  fbq?: (...args: unknown[]) => void
}

export function track(event: string, params: TrackParams = {}) {
  if (typeof window === 'undefined') return
  const w = window as TrackingWindow
  try {
    if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event, ...params })
    if (typeof w.gtag === 'function') w.gtag('event', event, params)
    if (typeof w.fbq === 'function') w.fbq('trackCustom', event, params)
  } catch {
    // tracking nunca pode quebrar a UI
  }
}

const UTM = {
  utm_source: 'rockstarstudio',
  utm_medium: 'website',
  utm_campaign: 'rockstar_academy',
} as const

// Anexa os parâmetros UTM a uma URL externa (Hotmart). `content` diferencia
// de onde o clique veio (ex.: 'course_section', 'course_01').
export function withUtm(url: string, content = 'course_section') {
  if (!url) return url
  try {
    const u = new URL(url)
    u.searchParams.set('utm_source', UTM.utm_source)
    u.searchParams.set('utm_medium', UTM.utm_medium)
    u.searchParams.set('utm_campaign', UTM.utm_campaign)
    u.searchParams.set('utm_content', content)
    return u.toString()
  } catch {
    // URL relativa/ inválida: devolve como está
    return url
  }
}
