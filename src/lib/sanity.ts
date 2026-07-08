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

function optimizedImageUrl(url: string) {
  return `${url}?w=900&auto=format&q=80`
}

export async function fetchPhotos(): Promise<GalleryPhoto[] | null> {
  if (!projectId) return null

  try {
    const endpoint = `https://${projectId}.apicdn.sanity.io/${API_VERSION}/data/query/${dataset}?query=${encodeURIComponent(PHOTOS_QUERY)}`
    const response = await fetch(endpoint)
    if (!response.ok) return null

    const { result } = (await response.json()) as { result?: PhotoResult[] }
    if (!Array.isArray(result)) return null

    return result
      .filter((photo) => photo.url && photo.category)
      .map((photo) => ({
        title: photo.title || photo.category || 'Nail art Rockstar Studio',
        category: photo.category || '',
        src: optimizedImageUrl(photo.url || ''),
        featured: photo.featured ?? false,
      }))
  } catch {
    return null
  }
}
