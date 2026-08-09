# Integração Sanity na galeria atual — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A dona do studio adiciona fotos e marca destaques pelo painel do Sanity; a página `/galeria/` atual (versão estática do usuário) passa a consumir o CMS com fallback para `src/media.ts`. A home **não muda**.

**Architecture:** A camada de dados completa já existe no commit `8a3ef6d` (cliente GROQ via fetch, hook `usePhotos`, Sanity Studio em `studio/`, script de migração) e foi removida no `ed67d88`. Este plano **restaura esses arquivos do git** e pluga o hook na `Gallery.tsx` atual, preservando 100% do visual dela (grupos por categoria, pills, `?categoria=` na URL). Contrato do hook: `undefined` = carregando (skeleton), `null`/lista vazia = fallback estático, lista com fotos = CMS. Fotos `featured` formam a seção/pill **"Destaques"**, exibida primeiro.

**Tech Stack:** Zero dependências novas no site. Sanity v4 apenas dentro de `studio/` (projeto npm separado, fora do build).

**Mudança de desenho vs. spec anterior:** a spec de hoje cedo previa fotos em destaque na home. O refactor `ed67d88` (do usuário) removeu o grid de fotos da home de propósito — os destaques agora aparecem na galeria, e a home continua estática.

**Nota sobre testes:** o repo não tem suíte de testes (CLAUDE.md). Verificação = `npm run lint`, `npm run build` e checagem no dev server.

**Docs relacionadas (já commitadas junto com este plano):** `docs/CMS-SETUP.md` (setup técnico) e `docs/GUIA-DA-DONA.md` (manual da artista).

---

### Task 1: Restaurar a camada de dados do commit 8a3ef6d

**Files:**
- Restore: `src/lib/sanity.ts`, `src/lib/usePhotos.ts`, `studio/**`, `scripts/migrate-to-sanity.mjs`, `.env.example`
- Modify: `studio/schemaTypes/photo.ts` (só o rótulo do campo `featured`)

- [ ] **Step 1: Restaurar os arquivos do git** (nenhum conflita com arquivos atuais — todos foram deletados no `ed67d88`):

```bash
git checkout 8a3ef6d -- src/lib/sanity.ts src/lib/usePhotos.ts studio scripts/migrate-to-sanity.mjs .env.example
```

- [ ] **Step 2: Ajustar o rótulo do campo `featured`** em `studio/schemaTypes/photo.ts` (o texto antigo prometia a home; agora o destaque vive na galeria). Trocar o `defineField` do `featured` por:

```ts
    defineField({
      name: 'featured',
      title: 'Destaque',
      description:
        'Ligue para a foto aparecer na seção "Destaques", exibida primeiro na galeria.',
      type: 'boolean',
      initialValue: false,
    }),
```

- [ ] **Step 3: Verificar** — Run: `npm run lint` → limpo. Run: `npm run build` → passa (studio/ está fora do build do site).

- [ ] **Step 4: Commit**

```bash
git add src/lib .env.example studio scripts/migrate-to-sanity.mjs
git commit -m "feat: restore Sanity data layer (client, hook, studio, migration)"
```

### Task 2: Plugar o CMS na Gallery.tsx atual (visual preservado)

**Files:**
- Modify: `src/pages/Gallery.tsx`

O componente atual usa `const items: GalleryItem[] = WORK_IMAGES` (linha 49). As mudanças abaixo trocam a fonte de dados e adicionam "Destaques" + skeleton; todo o JSX de grupos/pills/top bar permanece como está.

- [ ] **Step 1: Adicionar import do hook** (junto aos imports existentes):

```tsx
import { usePhotos } from '../lib/usePhotos'
```

- [ ] **Step 2: Adicionar a constante de destaque** ao lado de `ALL_CATEGORIES`:

```tsx
const FEATURED_CATEGORY = 'Destaques'
```

- [ ] **Step 3: Trocar a fonte de dados** no topo do componente `Gallery()`. Substituir a linha `const items: GalleryItem[] = WORK_IMAGES` por:

```tsx
  const photos = usePhotos()
  const isLoading = photos === undefined
  // null/vazio = CMS indisponível ou sem fotos → fallback estático de media.ts
  const items: GalleryItem[] = useMemo(
    () => (photos && photos.length > 0 ? photos : WORK_IMAGES),
    [photos],
  )
  const featuredPhotos = useMemo(
    () => (photos ?? []).filter((photo) => photo.featured),
    [photos],
  )
```

- [ ] **Step 4: Incluir "Destaques" nas categorias válidas.** Substituir o bloco de `categoryParam`/`requestedCategory` para validar contra a lista com destaque:

```tsx
  const selectableCategories = useMemo(
    () =>
      featuredPhotos.length > 0 ? [FEATURED_CATEGORY, ...categories] : categories,
    [featuredPhotos, categories],
  )

  const categoryParam =
    searchParams.get('categoria') ?? searchParams.get('category')
  const requestedCategory =
    categoryParam && selectableCategories.includes(categoryParam)
      ? categoryParam
      : ALL_CATEGORIES
```

- [ ] **Step 5: Grupos e filtro cientes do destaque.** Substituir `groupedItems` e `filtered` por:

```tsx
  const groupedItems = useMemo(() => {
    const groups = categories.map((category) => ({
      category,
      photos: items.filter((item) => item.category === category),
    }))
    return featuredPhotos.length > 0
      ? [{ category: FEATURED_CATEGORY, photos: featuredPhotos }, ...groups]
      : groups
  }, [categories, items, featuredPhotos])

  const filtered =
    activeCategory === ALL_CATEGORIES
      ? items
      : activeCategory === FEATURED_CATEGORY
        ? featuredPhotos
        : items.filter((item) => item.category === activeCategory)
```

- [ ] **Step 6: Pills usando `selectableCategories`.** No JSX, trocar `{[ALL_CATEGORIES, ...categories].map(...)}` por `{[ALL_CATEGORIES, ...selectableCategories].map(...)}` (mesmo corpo do map).

- [ ] **Step 7: Skeleton de carregamento.** Envolver o bloco condicional de conteúdo (o ternário que começa em `filtered.length === 0 ?`) com o estado de loading — inserir antes dele:

```tsx
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
```

e esconder as pills durante o loading: `{!isLoading && categories.length > 0 && (`.

- [ ] **Step 8: Verificar** — Run: `npm run lint` e `npm run build` → limpos. Dev server: `/galeria/` renderiza com as fotos estáticas (fallback, já que não há `.env.local`), pills e `?categoria=` funcionando como antes; sem pill "Destaques" (não há CMS ainda).

- [ ] **Step 9: Commit**

```bash
git add src/pages/Gallery.tsx
git commit -m "feat: gallery consumes Sanity photos with Destaques section and static fallback"
```

### Task 3: Atualizar CLAUDE.md

**Files:**
- Modify: `CLAUDE.md` (linhas 7 e 24 atuais)

- [ ] **Step 1:** Na linha 7, trocar "There is no backend and no CMS; content is maintained in code…" por: conteúdo base em código (`src/constants.ts`, `src/media.ts`); fotos da galeria opcionalmente servidas pelo Sanity (runtime fetch, sem backend próprio), com `src/media.ts` como fallback permanente.

- [ ] **Step 2:** Na linha 24 (**Gallery content**), documentar: `usePhotos()` retorna `undefined` (loading) | `null` (CMS off → fallback) | `GalleryPhoto[]`; fotos com `featured` formam a seção "Destaques"; `studio/` é projeto npm separado; setup em `docs/CMS-SETUP.md`.

- [ ] **Step 3: Commit** — `git add CLAUDE.md && git commit -m "docs: document Sanity-fed gallery in CLAUDE.md"`

### Task 4: Setup externo (manual — depende de conta no sanity.io)

Sem código; seguir `docs/CMS-SETUP.md` na ordem: criar projeto → `.env.local` + `studio/env.ts` → CORS (`http://localhost:5173` + domínio final) → `cd studio && npm install && npm run dev` (ou `npm run deploy`) → token de escrita → `node scripts/migrate-to-sanity.mjs` → convidar a dona em Members → entregar `docs/GUIA-DA-DONA.md` para ela.

- [ ] **Verificação fim-a-fim:** publicar uma foto de teste pelo painel → aparecer em `/galeria/` em segundos; marcar destaque → aparecer na pill/seção "Destaques"; remover `.env.local` e recarregar → site volta ao fallback sem erro no console.

## Self-review

- **Cobertura:** adicionar fotos (Task 1 studio + Task 4 setup), destacar (schema `featured` + Task 2 seção Destaques), baixo custo (plano free, zero deps novas), lançar hoje (fallback permite deploy imediato; CMS liga depois do setup sem novo deploy — env é lida em build… **atenção:** `VITE_*` é injetada no build; ligar o CMS exige um rebuild/redeploy com `.env` configurada no host. Documentado no CMS-SETUP §8).
- **Placeholders:** nenhum; código completo nos steps, restauração por comando git exato.
- **Consistência:** `GalleryPhoto` (restaurado) é estruturalmente compatível com `GalleryItem` da Gallery atual (`featured` extra é ignorado); `selectableCategories` usada em pills, validação de URL e filtro.
