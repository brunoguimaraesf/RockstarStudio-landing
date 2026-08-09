// SEO por rota. O React 19 iça <title>/<meta>/<link> renderizados em qualquer
// componente para o <head> automaticamente — não precisa de lib de head.
// Mantém um canonical único por rota (o index.html não crava nenhum, para não
// canonizar /galeria/ e /loja/ como cópias da home nesta SPA).
const SITE_URL = 'https://www.rockstarstudio.com.br'

type SeoProps = {
  path: '/' | '/galeria/' | '/loja/'
  title: string
  description?: string
}

export default function Seo({ path, title, description }: SeoProps) {
  const canonical = `${SITE_URL}${path}`
  return (
    <>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonical} />
      <meta property="og:url" content={canonical} />
    </>
  )
}
