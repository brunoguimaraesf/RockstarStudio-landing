# Setup do CMS Sanity

Este projeto suporta uma galeria gerenciável pelo Sanity. O site continua funcionando sem Sanity configurado, usando as fotos de `src/media.ts` como fallback — dá para colocar o site no ar antes de terminar este setup.

**Custo:** plano gratuito do Sanity (limites muito acima do necessário para este site).

## 1. Criar o projeto no Sanity

1. Acesse https://www.sanity.io/manage e crie uma conta (pode usar o Google).
2. Crie um projeto chamado `Rockstar Studio`.
3. Use o dataset `production`.
4. Copie o **Project ID** (aparece no topo da página do projeto).

## 2. Configurar o site

Crie um arquivo `.env.local` na raiz do projeto, usando `.env.example` como base:

```bash
VITE_SANITY_PROJECT_ID=seu_project_id
VITE_SANITY_DATASET=production
```

Sem esse arquivo, o site usa o fallback local e não tenta carregar fotos do CMS.

> **Importante (produção):** variáveis `VITE_*` são embutidas **no build**. No host
> (Vercel/Netlify/etc.), cadastre `VITE_SANITY_PROJECT_ID` e `VITE_SANITY_DATASET`
> nas Environment Variables do projeto e faça um novo deploy — só assim o site
> publicado passa a buscar do Sanity.

## 3. Configurar o Studio (painel)

Edite `studio/env.ts`:

```ts
export const projectId = 'seu_project_id'
export const dataset = 'production'
```

Depois instale e rode o Studio localmente:

```bash
cd studio
npm install
npm run dev
```

Para publicar o painel em um domínio do Sanity (recomendado — é o link que a dona vai usar no celular):

```bash
npm run deploy
```

Durante o deploy, escolha um hostname como `rockstarstudio`. O painel ficará em:

```text
https://rockstarstudio.sanity.studio
```

## 4. Liberar CORS

No painel do Sanity: `Manage Project > API > CORS Origins`. Adicione:

```text
http://localhost:5173
https://seu-dominio-final.com
```

Sem marcar "Allow credentials" — o site só faz leitura pública.

## 5. Convidar usuários

Em `Manage Project > Members`, convide:

- a dona do studio (e-mail dela);
- o desenvolvedor responsável.

Ela entra pelo celular no link do Studio, cria fotos, escolhe/cria categorias, marca destaques e publica. O passo a passo dela está em `docs/GUIA-DA-DONA.md`.

## 6. Migrar as fotos atuais

Crie um **token de escrita** em `Manage Project > API > Tokens` (permissão "Editor").

No PowerShell, na raiz do projeto:

```powershell
$env:SANITY_PROJECT_ID="seu_project_id"
$env:SANITY_DATASET="production"
$env:SANITY_TOKEN="seu_token_de_escrita"
node scripts/migrate-to-sanity.mjs
```

O script sobe as fotos de `public/images/works/`, cria as categorias e marca todas como destaque (a dona pode desmarcar depois no painel). É idempotente: rodar duas vezes não duplica nada.

## 7. Onde aparece o destaque

Fotos com **"Destaque"** ligado formam a seção/pill **"Destaques"**, exibida primeiro na página `/galeria/`. A home usa cards editoriais fixos e não muda via CMS.

## 8. Deploy do site

Como o site tem a rota `/galeria/` (React Router), o host precisa de **SPA fallback** (qualquer rota devolve `index.html`):

- **Vercel/Netlify:** normalmente automático para Vite; se a rota der 404, adicione a regra de rewrite/redirect para `/index.html`.
- **Hospedagem manual (nginx/apache):** configure fallback para `index.html`.

## 9. Resiliência

Se o Sanity estiver fora do ar, sem CORS liberado, sem project ID ou o visitante estiver sem internet no momento do fetch, o site **não quebra**: `/galeria/` mostra as fotos hardcoded de `src/media.ts` (sem seção Destaques). Nenhum erro visível para o visitante.

## Fluxo semanal (resumo)

1. Dona publica foto no Studio pelo celular (ver `GUIA-DA-DONA.md`).
2. Foto aparece em `/galeria/` em segundos — **sem rebuild, sem deploy**.
3. Fotos hardcoded continuam existindo apenas como rede de segurança.
