export type GalleryPhoto = {
  title: string
  category: string
  src: string
  featured: boolean
}

export type Product = {
  id: string
  name: string
  description: string
  category: string
  price: number
  src: string
  available: boolean
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

type ProductResult = {
  id: string | null
  name: string | null
  description: string | null
  category: string | null
  price: number | null
  url: string | null
  available: boolean | null
}

const PHOTOS_QUERY = `*[_type == "photo" && defined(image.asset)] | order(_createdAt desc) {
  title,
  "category": category->title,
  "url": image.asset->url,
  featured
}`

const PRODUCTS_QUERY = `*[_type == "product" && defined(image.asset)] | order(_createdAt desc) {
  "id": _id,
  name,
  description,
  "category": category->title,
  price,
  "url": image.asset->url,
  available
}`

function optimizedImageUrl(url: string, width = 900) {
  return `${url}?w=${width}&auto=format&q=80`
}

async function runQuery<T>(query: string): Promise<T[] | null> {
  if (!projectId) return null

  try {
    const endpoint = `https://${projectId}.apicdn.sanity.io/${API_VERSION}/data/query/${dataset}?query=${encodeURIComponent(query)}`
    const response = await fetch(endpoint)
    if (!response.ok) return null

    const { result } = (await response.json()) as { result?: T[] }
    return Array.isArray(result) ? result : null
  } catch {
    return null
  }
}

export async function fetchPhotos(): Promise<GalleryPhoto[] | null> {
  const result = await runQuery<PhotoResult>(PHOTOS_QUERY)
  if (!result) return null

  return result
    .filter((photo) => photo.url && photo.category)
    .map((photo) => ({
      title: photo.title || photo.category || 'Nail art Rockstar Studio',
      category: photo.category || '',
      src: optimizedImageUrl(photo.url || ''),
      featured: photo.featured ?? false,
    }))
}

export async function fetchProducts(): Promise<Product[] | null> {
  const result = await runQuery<ProductResult>(PRODUCTS_QUERY)
  if (!result) return null

  return result
    .filter((item) => item.id && item.url && item.name && typeof item.price === 'number')
    .map((item) => ({
      id: item.id || '',
      name: item.name || '',
      description: item.description || '',
      category: item.category || '',
      price: item.price || 0,
      src: optimizedImageUrl(item.url || '', 600),
      available: item.available ?? true,
    }))
}
