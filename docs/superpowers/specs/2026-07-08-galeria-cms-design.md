# Galeria gerenciável por CMS (Sanity) — Design

**Data:** 2026-07-08
**Status:** Aprovado pelo usuário em conversa

## Problema

Todas as fotos do site são hardcoded em `src/media.ts` e servidas de `public/images/`.
Cada foto nova exige editar código e republicar. A dona do studio quer adicionar
fotos novas toda semana (ou mais), separadas por categoria, sem depender de
desenvolvedor.

## Decisões tomadas (com o usuário)

1. **Frequência de uso:** semanal ou maior → autonomia total justifica o investimento.
2. **Abordagem:** painel pronto de CMS headless (**Sanity**, plano gratuito), em vez
   de página admin custom (Supabase) ou fluxo via Git (Decap). Menos código a manter;
   login, upload e CDN de imagens já resolvidos.
3. **Escopo:** nova página de galeria **e** a seção Works da home passam a ser
   alimentadas pelo CMS — fonte única de fotos.
4. **Seleção da home:** fotos marcadas com flag **destaque** no painel aparecem na home.

## Arquitetura

```
Dona do studio ──login──▶ Sanity Studio (rockstarstudio.sanity.studio ou studio/ local)
                              │ publica documentos "foto" / "categoria"
                              ▼
                    Sanity Content Lake + CDN de imagens
                              │ GROQ via HTTP GET (apicdn.sanity.io), sem SDK
                              ▼
        Site React (Vite) ── busca em runtime ──▶ /galeria e seção Works
                              │ falha ou CMS não configurado?
                              ▼
                    Fallback: WORK_IMAGES de src/media.ts (site nunca quebra)
```

### Conteúdo no Sanity

- **categoria**: `title` (string, obrigatório). A dona pode criar novas categorias.
- **foto**: `title` (string), `image` (image, hotspot), `category` (reference →
  categoria, obrigatório), `featured` (boolean, default false).

### Lado do site

- `src/lib/sanity.ts` — cliente mínimo via `fetch` contra a API GROQ do Sanity
  (`https://<projectId>.apicdn.sanity.io/...`). Sem dependência nova. Config via
  `VITE_SANITY_PROJECT_ID` / `VITE_SANITY_DATASET` (`.env.local`, já ignorado pelo
  git via `*.local`). Sem projectId configurado, as funções retornam `null` e os
  consumidores usam o fallback hardcoded.
- Tipo compartilhado `GalleryPhoto { title, category, src, featured }`.
  `src` já vem com parâmetros de otimização da CDN (`?w=…&auto=format&q=80`).
- **Nova rota `/galeria`** (`src/pages/Gallery.tsx`): pills de filtro por categoria
  ("Todas" + categorias existentes nas fotos), grid responsivo, reveals com Framer
  Motion no padrão do projeto, visual com os tokens existentes (bg/surface/stroke,
  font-display itálico nos flourishes). Estados: loading (skeleton), vazio, erro
  (cai no fallback). Navbar não aparece (âncoras são da home); a página tem seu
  próprio cabeçalho com link de volta e CTA de agendamento no fim.
- **Works.tsx (home)**: o grid secundário (hoje `WORK_IMAGES`) passa a exibir as
  fotos `featured` do CMS, com fallback para `WORK_IMAGES`. Os 4 cards editoriais
  grandes (`FEATURED` local, com gradientes artesanais) permanecem como estão.
  O CTA "Ver tudo" do cabeçalho da seção passa a apontar para `/galeria` em vez
  do Instagram.

### Painel e migração

- `studio/` — scaffold do Sanity Studio (projeto npm próprio, fora do build do
  site) com os dois schemas. Pode rodar local (`npm run dev`) ou ser publicado
  com `npx sanity deploy`.
- `scripts/migrate-to-sanity.mjs` — sobe as 11 fotos atuais de `public/images/works`
  como assets + documentos (categorias e fotos) uma única vez. Requer
  `SANITY_TOKEN` (token de escrita) e `SANITY_PROJECT_ID` no ambiente.
- `docs/CMS-SETUP.md` — passo a passo em português: criar projeto no sanity.io,
  configurar CORS, `.env.local`, rodar migração, convidar a dona, publicar o Studio.

## Erros e resiliência

- Qualquer falha de rede/CMS → fallback silencioso para as fotos hardcoded
  (home) / fallback + aviso discreto (galeria). O site continua 100% funcional
  sem o Sanity configurado — inclusive neste repositório, antes do setup.

## Fora de escopo (YAGNI)

- Fotos de "tipos de clientes" e demais imagens do site seguem hardcoded.
- Reordenação manual das fotos (ordem = mais recentes primeiro).
- Preview/draft mode, i18n do painel, contas além de dona + desenvolvedor.

## Critérios de sucesso

1. `npm run lint` e `npm run build` passam.
2. Sem `.env.local`, o site renderiza exatamente como hoje (fallback) e `/galeria`
   mostra as fotos hardcoded com filtro por categoria funcionando.
3. Com o Sanity configurado, foto publicada no painel aparece na galeria em
   segundos (sem rebuild) e, se marcada como destaque, na home.
