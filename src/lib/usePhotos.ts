import { useEffect, useState } from 'react'
import { fetchPhotos, type GalleryPhoto } from './sanity'

// undefined = carregando | null = CMS indisponivel/nao configurado | [] = CMS sem fotos
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
