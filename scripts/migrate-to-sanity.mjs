import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_TOKEN
const apiVersion = 'v2024-01-01'

const photos = [
  { title: 'Alternativa I', category: 'Alternativa', file: 'ALTERNATIVA 1.jpg' },
  { title: 'Alternativa II', category: 'Alternativa', file: 'ALTERNATIVA 2.jpg' },
  { title: 'Autoral I', category: 'Autoral', file: 'AUTORAL 1.jpg' },
  { title: 'Autoral II', category: 'Autoral', file: 'AUTORAL 2.jpg' },
  { title: 'Gótica', category: 'Gótica', file: 'GOTICO 1.jpg' },
  { title: 'Kawaii', category: 'Kawaii', file: 'KAWAI 2.jpg' },
  { title: 'Work 1', category: 'Studio', file: 'WORK1.webp' },
  { title: 'Work 2', category: 'Studio', file: 'WORK2.webp' },
  { title: 'Work 3', category: 'Studio', file: 'WORK3.webp' },
  { title: 'Work 4', category: 'Studio', file: 'WORK4.webp' },
  { title: 'Work 5', category: 'Studio', file: 'WORK5.webp' },
]

function requireEnv() {
  const missing = []
  if (!projectId) missing.push('SANITY_PROJECT_ID')
  if (!token) missing.push('SANITY_TOKEN')

  if (missing.length > 0) {
    console.error(`Variaveis obrigatorias ausentes: ${missing.join(', ')}`)
    console.error(
      'Exemplo: $env:SANITY_PROJECT_ID="..."; $env:SANITY_TOKEN="..."; node scripts/migrate-to-sanity.mjs',
    )
    process.exit(1)
  }
}

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function mimeFor(file) {
  const ext = path.extname(file).toLowerCase()
  if (ext === '.webp') return 'image/webp'
  if (ext === '.png') return 'image/png'
  return 'image/jpeg'
}

async function sanityFetch(endpoint, options = {}) {
  const response = await fetch(`https://${projectId}.api.sanity.io/${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  })

  const body = await response.text()
  if (!response.ok) {
    throw new Error(`Sanity API ${response.status}: ${body}`)
  }

  return body ? JSON.parse(body) : null
}

async function createIfNotExists(doc) {
  await sanityFetch(`${apiVersion}/data/mutate/${dataset}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations: [{ createIfNotExists: doc }] }),
  })
}

async function uploadAsset(photo) {
  const filePath = path.join(rootDir, 'public', 'images', 'works', photo.file)
  const file = await readFile(filePath)
  const filename = encodeURIComponent(photo.file)
  const result = await sanityFetch(
    `${apiVersion}/assets/images/${dataset}?filename=${filename}`,
    {
      method: 'POST',
      headers: { 'Content-Type': mimeFor(photo.file) },
      body: file,
    },
  )

  const assetId = result?.document?._id
  if (!assetId) throw new Error(`Upload sem asset id para ${photo.file}`)
  return assetId
}

async function main() {
  requireEnv()

  const categories = Array.from(new Set(photos.map((photo) => photo.category)))
  for (const category of categories) {
    await createIfNotExists({
      _id: `category-${slugify(category)}`,
      _type: 'category',
      title: category,
    })
    console.log(`Categoria pronta: ${category}`)
  }

  for (const photo of photos) {
    const photoId = `photo-${slugify(photo.title)}`
    const assetId = await uploadAsset(photo)

    await createIfNotExists({
      _id: photoId,
      _type: 'photo',
      title: photo.title,
      category: {
        _type: 'reference',
        _ref: `category-${slugify(photo.category)}`,
      },
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
      },
      featured: true,
    })

    console.log(`Foto pronta: ${photo.title}`)
  }

  console.log('Migracao concluida.')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

