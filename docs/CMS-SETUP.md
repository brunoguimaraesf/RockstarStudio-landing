# Setup do CMS Sanity

Este projeto suporta uma galeria gerenciavel pelo Sanity. O site continua funcionando sem Sanity configurado, usando as fotos de `src/media.ts` como fallback.

## 1. Criar o projeto no Sanity

1. Acesse https://www.sanity.io/manage.
2. Crie um projeto chamado `Rockstar Studio`.
3. Use o dataset `production`.
4. Copie o Project ID.

## 2. Configurar o site

Crie um arquivo `.env.local` na raiz do projeto, usando `.env.example` como base:

```bash
VITE_SANITY_PROJECT_ID=seu_project_id
VITE_SANITY_DATASET=production
```

Sem esse arquivo, o site usa o fallback local e nao tenta carregar fotos do CMS.

## 3. Configurar o Studio

Edite `studio/env.ts`:

```ts
export const projectId = 'seu_project_id'
export const dataset = 'production'
```

Depois instale e rode o Studio:

```bash
cd studio
npm install
npm run dev
```

Para publicar o painel em um dominio do Sanity:

```bash
npm run deploy
```

Durante o deploy, use um hostname como:

```text
rockstarstudio
```

O painel ficará em:

```text
https://rockstarstudio.sanity.studio
```

## 4. Liberar CORS

No painel do Sanity, acesse:

```text
Manage Project > API > CORS Origins
```

Adicione as origens:

```text
http://localhost:5173
https://seu-dominio-final.com
```

Marque apenas o necessario para leitura publica. Nao precisa liberar credenciais para o site publico.

## 5. Convidar usuarios

Em `Manage Project > Members`, convide:

- dona do studio
- desenvolvedor responsavel

Ela poderá entrar pelo celular, criar foto, escolher/criar categoria, marcar destaque e publicar.

## 6. Migrar fotos atuais

Crie um token de escrita no Sanity em:

```text
Manage Project > API > Tokens
```

No PowerShell, rode na raiz do projeto:

```powershell
$env:SANITY_PROJECT_ID="seu_project_id"
$env:SANITY_DATASET="production"
$env:SANITY_TOKEN="seu_token_de_escrita"
node scripts/migrate-to-sanity.mjs
```

O script cria categorias e documentos de foto a partir de `public/images/works/`, todos marcados como destaque para manter a home preenchida.

## 7. Fluxo semanal da artista

1. Abrir o Studio no celular.
2. Criar `Nova foto`.
3. Subir a imagem.
4. Escolher ou criar categoria.
5. Marcar `Destaque na pagina inicial` se quiser aparecer na home.
6. Clicar em `Publish`.

A galeria publica busca direto da CDN do Sanity. Foto publicada aparece no site em segundos, sem rebuild.

## 8. Deploy do site

Como o site tem a rota `/galeria`, configure SPA fallback no host.

Em Vercel/Netlify isso geralmente ja funciona para Vite. Em hospedagem manual, qualquer rota deve devolver `index.html`.

## 9. Resiliencia

Se o Sanity estiver fora, sem CORS, sem project ID ou sem internet, o site nao quebra:

- home usa `WORK_IMAGES` como fallback;
- `/galeria` mostra as fotos hardcoded de `src/media.ts`.
