# Rockstar Studio Landing Page

Landing page para o Rockstar Studio, um site visual para apresentar trabalhos de nail art, estilo da artista, tipos de clientes atendidos, Instagram, localização e canais de contato.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- GSAP
- HLS.js
- Oxlint

## Funcionalidades

- Hero com vídeo e reveal guiado por scroll.
- Galeria de trabalhos em destaque.
- Seção de processo e cuidados.
- Sobre a nail artist.
- Tipos de clientes atendidos com cards visuais.
- Playground visual com imagens e animação de espalhamento.
- Feed/atalho para Instagram.
- Estatísticas do studio.
- Seção de localização com rota pelo Google Maps.
- Seção de contato com WhatsApp, Instagram e endereço.

## Links do studio

- Instagram: https://www.instagram.com/_rockstarstudio/
- WhatsApp: https://api.whatsapp.com/message/NYOM6K4TU2REO1?autoload=1&app_absent=0
- Localização: https://www.google.com/maps?q=-17.798274993896484,-50.933448791503906&z=17&hl=pt-BR

## Endereço

Centro, Rua Henriqueta Assunção N° 150 C2, portão de grade marrom ao lado da escola Oscar Ribeiro.

## Como rodar localmente

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev      # inicia o servidor local
npm run lint     # roda o Oxlint
npm run build    # gera o build de produção
npm run preview  # pré-visualiza o build
```

## Estrutura principal

```text
src/
  components/  # seções e componentes visuais da landing
  pages/       # página principal
  constants.ts # links e informações fixas do studio
  media.ts     # imagens usadas nas seções
public/
  images/      # imagens do portfólio, artista e tipos de clientes
  videos/      # vídeo principal do hero/footer
```

## Build

Para gerar a versão de produção:

```bash
npm run build
```

O resultado fica em `dist/`.
