export const WHATSAPP_URL =
  'https://api.whatsapp.com/message/NYOM6K4TU2REO1?autoload=1&app_absent=0'

// Número para pedidos da loja, formato internacional sem símbolos (ex.: '5564999998888').
// O short-link acima não aceita mensagem pré-preenchida; enquanto este campo
// estiver vazio, o checkout copia o pedido e abre o WHATSAPP_URL.
export const WHATSAPP_PHONE = '5564981624311'

export const INSTAGRAM_URL = 'https://www.instagram.com/_rockstarstudio/'

// Hotmart: destino de venda/checkout dos cursos da Rockstar Academy.
// Enquanto estiver vazio, a seção opera em modo PRÉ-LANÇAMENTO (lista VIP no
// WhatsApp). Quando a página de vendas estiver no ar, cole a URL aqui — os CTAs
// da Academia passam a apontar pra Hotmart sem tocar em nenhum componente.
// Cada curso pode ter a própria URL (ver hotmartUrl em src/lib/academy.ts);
// esta é o fallback/padrão.
export const HOTMART_COURSE_URL = ''

export const VIDEO_SRC = '/videos/rockstar-nails.mp4'

export const MOBILE_VIDEO_SRC = '/videos/rockstar-nails-mobile.mp4'

// Poster do hero (1º frame do vídeo). Pinta imediato e vira o LCP no mobile,
// em vez de esperar o vídeo carregar.
export const HERO_POSTER_SRC = '/images/hero-poster.webp'

export const BRAND_LOGO_SRC = '/images/brand/rockstar-logo.jpeg'
