# Galeria gerenciável por CMS (Sanity) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Nova rota `/galeria` com filtro por categoria e seção Works da home alimentadas pelo Sanity (com fallback hardcoded), mais scaffold do Sanity Studio, script de migração e docs de setup.

**Architecture:** O site busca fotos em runtime via HTTP GET (GROQ) direto na CDN do Sanity, sem SDK novo. `undefined` = carregando, `null` = CMS indisponível/não configurado (fallback para `src/media.ts`), `[]` = vazio. O painel (Sanity Studio) vive em `studio/` como projeto npm separado, fora do build do site.

**Tech Stack:** React 19 + Vite + Tailwind + Framer Motion (existentes); Sanity v4 apenas em `studio/`. Zero dependências novas no site.

**Nota sobre testes:** o repo não tem suíte de testes (ver CLAUDE.md). Verificação = `npm run lint`, `npm run build` e checagem manual no dev server.

---

### Task 1: Cliente Sanity + hook + .env.example

**Files:**
- Create: `src/lib/sanity.ts`
- Create: `src/lib/usePhotos.ts`
- Create: `.env.example`

- [ ] **Step 1: Criar `src/lib/sanity.ts`**

```ts
// Cliente mínimo da API GROQ do Sanity — sem SDK, só fetch na CDN.
// Sem VITE_SANITY_PROJECT_ID configurado, fetchPhotos() resolve null e os
// consumidores caem no fallback hardcoded de src/media.ts.

export type GalleryPhoto = {
  title: string
  category: string
  src: string
  featured: boolean
}

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined
const dataset =
  (import.meta.env.VITE_SANITY_DATASET as string | undefined) || 'production'
const API_VERSION = 'v2024-01-01'

type PhotoResult = {
  title: string | null
  category: string | null
  url: string | null
  featured: boolean | null
}

const PHOTOS_QUERY = `*[_type == "photo" && defined(image.asset)] | order(_createdAt desc) {
  title,
  "category": category->title,
  "url": image.asset->url,
  featured
}`

export async function fetchPhotos(): Promise<GalleryPhoto[] | null> {
  if (!projectId) return null
  try {
    const endpoint = `https://${projectId}.apicdn.sanity.io/${API_VERSION}/data/query/${dataset}?query=${encodeURIComponent(PHOTOS_QUERY)}`
    const response = await fetch(endpoint)
    if (!response.ok) return null
    const { result } = (await response.json()) as { result: PhotoResult[] }
    return result
      .filter((photo) => photo.url && photo.category)
      .map((photo) => ({
        title: photo.title ?? photo.category ?? '',
        category: photo.category ?? '',
        // Parâmetros da CDN: redimensiona e converte pro melhor formato
        src: `${photo.url}?w=900&auto=format&q=80`,
        featured: photo.featured ?? false,
      }))
  } catch {
    return null
  }
}
```

- [ ] **Step 2: Criar `src/lib/usePhotos.ts`**

```ts
import { useEffect, useState } from 'react'
import { fetchPhotos, type GalleryPhoto } from './sanity'

// undefined = carregando | null = CMS indisponível (usar fallback) | [] = sem fotos
export function usePhotos() {
  const [photos, setPhotos] = useState<GalleryPhoto[] | null | undefined>(
    undefined,
  )

  useEffect(() => {
    let cancelled = false
    fetchPhotos().then((result) => {
      if (!cancelled) setPhotos(result)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return photos
}
```

- [ ] **Step 3: Criar `.env.example`**

```
# Copie este arquivo para .env.local (ignorado pelo git) e preencha.
# O ID do projeto fica em https://www.sanity.io/manage
VITE_SANITY_PROJECT_ID=
VITE_SANITY_DATASET=production
```

- [ ] **Step 4: Verificar** — Run: `npm run lint` → sem erros novos.

- [ ] **Step 5: Commit**

```bash
git add src/lib/sanity.ts src/lib/usePhotos.ts .env.example
git commit -m "feat: add minimal Sanity GROQ client with hardcoded fallback contract"
```

### Task 2: GlowButton com suporte a rota interna

**Files:**
- Modify: `src/components/GlowButton.tsx`

- [ ] **Step 1: Renderizar `Link` do react-router quando o href é rota interna** (começa com `/` e não é `external`), para navegação sem reload. Conteúdo interno idêntico; só o wrapper muda:

```tsx
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type GlowButtonProps = {
  href: string
  children: ReactNode
  variant?: 'solid' | 'outline' | 'cta'
  external?: boolean
  className?: string
}

export default function GlowButton({
  href,
  children,
  variant = 'outline',
  external,
  className = '',
}: GlowButtonProps) {
  const inner = {
    solid:
      'border-2 border-transparent bg-text-primary text-bg group-hover:bg-bg group-hover:text-text-primary',
    outline:
      'border-2 border-stroke bg-bg text-text-primary group-hover:border-transparent',
    // Vermelho sangue: reservado ao CTA de agendamento
    cta: 'border-2 border-transparent bg-blood font-medium text-white shadow-[0_0_24px_rgba(196,30,58,0.3)] transition-shadow group-hover:bg-[#d92645] group-hover:shadow-[0_0_44px_rgba(196,30,58,0.55)]',
  }[variant]

  const wrapperClassName = `group relative inline-flex transition-transform duration-300 hover:scale-105 ${className}`
  const content = (
    <>
      {variant !== 'cta' && (
        <span className="animate-gradient-shift absolute -inset-[2px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
      <span
        className={`relative flex items-center gap-2 rounded-full px-7 py-3.5 text-sm transition-colors duration-300 ${inner}`}
      >
        {children}
      </span>
    </>
  )

  // Rota interna do app (ex.: /galeria) navega via react-router, sem reload
  if (!external && href.startsWith('/')) {
    return (
      <Link to={href} className={wrapperClassName}>
        {content}
      </Link>
    )
  }

  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={wrapperClassName}
    >
      {content}
    </a>
  )
}
```

- [ ] **Step 2: Verificar** — Run: `npm run lint` → sem erros.

- [ ] **Step 3: Commit** — `git add src/components/GlowButton.tsx && git commit -m "feat: GlowButton navigates internal routes via react-router Link"`

### Task 3: Página /galeria + rota

**Files:**
- Create: `src/pages/Gallery.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Criar `src/pages/Gallery.tsx`** — top bar própria (as âncoras da Navbar são da home), cabeçalho no padrão SectionHeader, pills de categoria, grid com reveals, estados de loading/vazio, Footer reutilizado:

```tsx
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import { usePhotos } from '../lib/usePhotos'
import { WORK_IMAGES } from '../media'
import { WHATSAPP_URL } from '../constants'

const ALL_CATEGORIES = 'Todas'

export default function Gallery() {
  const photos = usePhotos()
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const isLoading = photos === undefined
  // null = CMS indisponível → fallback hardcoded; [] = CMS ligado porém vazio
  const items = photos === null ? WORK_IMAGES : (photos ?? [])

  const categories = useMemo(() => {
    const unique: string[] = []
    for (const item of items) {
      if (!unique.includes(item.category)) unique.push(item.category)
    }
    return unique
  }, [items])

  const filtered =
    activeCategory === ALL_CATEGORIES
      ? items
      : items.filter((item) => item.category === activeCategory)

  return (
    <div className="min-h-screen bg-bg">
      <header className="fixed left-0 right-0 top-0 z-50 flex justify-center px-3 pt-4 md:pt-6">
        <div className="inline-flex max-w-full items-center rounded-full border border-white/10 bg-surface px-2 py-2 backdrop-blur-md">
          <Link
            to="/"
            aria-label="Rockstar Studio — voltar ao início"
            className="flex h-9 w-9 shrink-0 rounded-full bg-[linear-gradient(90deg,#9D4EDD,#7B2FF7)] p-[2px] transition-transform duration-300 hover:scale-110"
          >
            <span className="flex h-full w-full items-center justify-center rounded-full bg-bg font-display text-[13px] italic text-text-primary">
              RS
            </span>
          </Link>
          <Link
            to="/"
            className="rounded-full px-3 py-1.5 text-xs text-muted transition-colors duration-200 hover:bg-stroke/50 hover:text-text-primary sm:px-4 sm:py-2 sm:text-sm"
          >
            ← Voltar ao início
          </Link>
          <span className="mx-1 hidden h-5 w-px shrink-0 bg-stroke md:block" />
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative ml-1 shrink-0"
          >
            <span className="animate-gradient-shift absolute -inset-[2px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <span className="relative flex items-center gap-1 rounded-full bg-surface px-3 py-1.5 text-xs text-text-primary backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm">
              Agendar
              <span aria-hidden>↗</span>
            </span>
          </a>
        </div>
      </header>

      <main className="relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
        {/* Luz roxa ambiente */}
        <div className="pointer-events-none absolute -top-24 left-[-10%] h-96 w-96 rounded-full bg-purple/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-[-12%] top-1/3 h-96 w-96 rounded-full bg-violet/10 blur-[140px]" />

        <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="accent-gradient h-px w-8" />
              <span className="text-xs uppercase tracking-[0.3em] text-muted">
                Portfólio completo
              </span>
            </div>
            <h1 className="text-4xl tracking-tight text-text-primary md:text-6xl">
              Galeria do{' '}
              <span className="font-display italic text-violet">studio</span>
            </h1>
            <p className="mt-3 max-w-md text-sm text-muted">
              Todos os trabalhos, separados por categoria — direto do painel da
              artista.
            </p>
          </motion.div>

          {!isLoading && categories.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2.5">
              {[ALL_CATEGORIES, ...categories].map((category) => (
                <button
                  key={category}
                  type="button"
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

          {isLoading ? (
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] animate-pulse rounded-2xl border border-stroke bg-surface"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-stroke bg-surface px-6 py-20 text-center">
              <p className="font-display text-2xl italic text-text-primary">
                Nenhuma foto por aqui ainda
              </p>
              <p className="max-w-sm text-sm text-muted">
                As novidades aparecem primeiro no painel da artista — em breve
                tem foto nova nesta categoria.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {filtered.map((photo, i) => (
                <motion.figure
                  key={photo.src}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: (i % 4) * 0.05 }}
                  className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-stroke bg-surface"
                >
                  <img
                    src={photo.src}
                    alt={`${photo.title} — nail art ${photo.category}`}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                  />
                  <figcaption>
                    <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="absolute bottom-2.5 left-3 right-3 text-[10px] uppercase tracking-[0.14em] text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {photo.category}
                    </span>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Adicionar rota em `src/App.tsx`**

```tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Index from './pages/Index'
import Gallery from './pages/Gallery'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/galeria" element={<Gallery />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

- [ ] **Step 3: Verificar** — Run: `npm run lint` e abrir `http://localhost:5173/galeria` no dev server → grid com as fotos hardcoded (fallback), pills funcionando.

- [ ] **Step 4: Commit** — `git add src/pages/Gallery.tsx src/App.tsx && git commit -m "feat: add /galeria page with category filter fed by Sanity"`

### Task 4: Works da home alimentado pelo CMS

**Files:**
- Modify: `src/components/Works.tsx`

- [ ] **Step 1: Trocar a fonte do grid secundário e o CTA.** Três mudanças, mantendo todo o resto intacto (os 4 cards editoriais `FEATURED` locais não mudam):

1. Import novo: `import { usePhotos } from '../lib/usePhotos'`
2. No topo do componente:

```tsx
export default function Works() {
  const photos = usePhotos()
  // Fotos marcadas como destaque no painel; sem CMS (ou vazio), mantém o hardcoded
  const cmsFeatured = (photos ?? []).filter((photo) => photo.featured)
  const gridImages = cmsFeatured.length > 0 ? cmsFeatured : WORK_IMAGES
```

3. `WORK_IMAGES.map(...)` no grid vira `gridImages.map(...)` (mesmo corpo) e o CTA do SectionHeader vira:

```tsx
cta={{ label: 'Ver galeria', href: '/galeria' }}
```

- [ ] **Step 2: Verificar** — Run: `npm run lint`; home no dev server idêntica à atual (fallback ativo), CTA "Ver galeria" navegando para `/galeria` sem reload.

- [ ] **Step 3: Commit** — `git add src/components/Works.tsx && git commit -m "feat: home Works grid shows CMS featured photos with hardcoded fallback"`

### Task 5: Scaffold do Sanity Studio

**Files:**
- Create: `studio/package.json`, `studio/env.ts`, `studio/sanity.config.ts`, `studio/sanity.cli.ts`, `studio/tsconfig.json`, `studio/.gitignore`
- Create: `studio/schemaTypes/index.ts`, `studio/schemaTypes/photo.ts`, `studio/schemaTypes/category.ts`

- [ ] **Step 1: Criar os arquivos** (conteúdos completos na implementação; pontos-chave):

`studio/env.ts` — único lugar a editar no setup:

```ts
// Preencha com o ID do projeto criado em https://www.sanity.io/manage
// (mesmo valor do VITE_SANITY_PROJECT_ID no .env.local do site).
export const projectId = 'COLOQUE_O_PROJECT_ID'
export const dataset = 'production'
```

`studio/sanity.config.ts`:

```ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import { dataset, projectId } from './env'

export default defineConfig({
  name: 'default',
  title: 'Rockstar Studio',
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
})
```

`studio/sanity.cli.ts`:

```ts
import { defineCliConfig } from 'sanity/cli'
import { dataset, projectId } from './env'

export default defineCliConfig({ api: { projectId, dataset } })
```

`studio/schemaTypes/category.ts`:

```ts
import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Categoria',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nome',
      type: 'string',
      validation: (rule) => rule.required().error('A categoria precisa de um nome.'),
    }),
  ],
})
```

`studio/schemaTypes/photo.ts`:

```ts
import { defineField, defineType } from 'sanity'

export const photo = defineType({
  name: 'photo',
  title: 'Foto',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (rule) => rule.required().error('Dê um nome para a foto.'),
    }),
    defineField({
      name: 'image',
      title: 'Imagem',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required().error('Envie a imagem da nail art.'),
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (rule) => rule.required().error('Escolha (ou crie) uma categoria.'),
    }),
    defineField({
      name: 'featured',
      title: 'Destaque na página inicial',
      description: 'Ligue para a foto aparecer na seção de trabalhos da home.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category.title', media: 'image' },
  },
})
```

`studio/schemaTypes/index.ts`:

```ts
import { category } from './category'
import { photo } from './photo'

export const schemaTypes = [photo, category]
```

`studio/package.json`: deps `sanity@^4`, `@sanity/vision@^4`, `react@^19`, `react-dom@^19`, `styled-components@^6`; scripts `dev`/`build`/`deploy` chamando o CLI do sanity. `studio/.gitignore`: `node_modules`, `dist`, `.sanity`. `studio/tsconfig.json` próprio (o `tsc -b` da raiz não inclui `studio/`, que só compila quando o usuário instalar as deps).

- [ ] **Step 2: Verificar** — `npm run build` na raiz continua passando (studio/ fora do build do site).

- [ ] **Step 3: Commit** — `git add studio && git commit -m "feat: scaffold Sanity Studio with photo/category schemas (pt-BR labels)"`

### Task 6: Script de migração das fotos atuais

**Files:**
- Create: `scripts/migrate-to-sanity.mjs`

- [ ] **Step 1: Criar o script** — idempotente (`createIfNotExists` com `_id` determinístico), roda com Node ≥ 18 (fetch global), lê `SANITY_PROJECT_ID`, `SANITY_DATASET` (default `production`) e `SANITY_TOKEN` do ambiente. Sobe cada arquivo de `public/images/works/` como asset e cria os documentos com `featured: true` (a home fica igual à atual após a virada). Lista de fotos duplicada do `src/media.ts` com os nomes de arquivo decodificados (`ALTERNATIVA 1.jpg` etc.) — script descartável de uso único.

- [ ] **Step 2: Verificar** — `node scripts/migrate-to-sanity.mjs` sem env → sai com mensagem de erro clara e exit code 1 (não tenta nada).

- [ ] **Step 3: Commit** — `git add scripts/migrate-to-sanity.mjs && git commit -m "feat: one-shot migration script for current gallery photos"`

### Task 7: Docs de setup + CLAUDE.md + verificação final

**Files:**
- Create: `docs/CMS-SETUP.md`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Criar `docs/CMS-SETUP.md`** em português: criar projeto no sanity.io; preencher `studio/env.ts` e `.env.local`; liberar CORS (localhost:5173 + domínio do site) em manage → API; `npm install` + `npm run dev`/`npx sanity deploy` dentro de `studio/`; rodar a migração; convidar a dona como membro; nota sobre SPA fallback no host para a rota `/galeria`.

- [ ] **Step 2: Atualizar `CLAUDE.md`** — corrigir "No backend, no CMS", documentar a rota `/galeria`, o contrato `undefined/null/[]` do `usePhotos`, `studio/` e o script de migração.

- [ ] **Step 3: Verificação final** — Run: `npm run lint` (limpo), `npm run build` (passa), dev server: `/` idêntica à atual e `/galeria` funcional com fallback.

- [ ] **Step 4: Commit** — `git add docs/CMS-SETUP.md CLAUDE.md && git commit -m "docs: Sanity setup guide and CLAUDE.md architecture update"`

## Self-review

- **Cobertura da spec:** cliente+fallback (T1), rota `/galeria` com pills/estados (T3), Works com destaque (T4), schemas foto/categoria (T5), migração (T6), docs/CORS/env (T7). CTA "Ver galeria" (T4) e navegação interna sem reload (T2). Sem lacunas.
- **Placeholders:** nenhum — T5/T6 têm conteúdo-chave definido e o restante é mecânico (package.json/tsconfig padrão do Sanity, lista de 11 fotos copiada de media.ts).
- **Consistência de tipos:** `GalleryPhoto` (T1) é usado em T3/T4; `WORK_IMAGES` (`{title, category, src}`) é aceito onde `featured` não é lido (T3) e como fallback direto do grid (T4). `usePhotos` retorna `GalleryPhoto[] | null | undefined` e T3/T4 tratam os três estados.
