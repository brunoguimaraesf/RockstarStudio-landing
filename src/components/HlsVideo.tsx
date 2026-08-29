import { useEffect, useRef } from 'react'

type HlsVideoProps = {
  src: string
  mobileSrc?: string
  className?: string
  poster?: string
}

export default function HlsVideo({
  src,
  mobileSrc,
  className,
  poster,
}: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const media = mobileSrc ? window.matchMedia('(max-width: 767px)') : null
    // Escolhe a fonte na hora de aplicar (nunca deixa a versão desktop carregar
    // no mobile). Um único efeito, sem estado — evitava baixar dois vídeos.
    const pick = () => (media?.matches && mobileSrc ? mobileSrc : src)

    let hls: import('hls.js').default | undefined
    let cancelled = false

    const apply = () => {
      const chosen = pick()

      if (chosen.endsWith('.m3u8')) {
        // hls.js só entra no bundle quando a fonte é HLS de fato
        import('hls.js').then(({ default: Hls }) => {
          if (cancelled) return
          if (Hls.isSupported()) {
            hls?.destroy()
            hls = new Hls()
            hls.loadSource(chosen)
            hls.attachMedia(video)
          } else {
            // HLS nativo (Safari)
            video.src = chosen
          }
        })
        return
      }

      // Fonte .mp4 direta. Atribuir `src` já dispara o carregamento; só troca
      // quando muda de fato (evita baixar o mesmo arquivo — ou a versão errada
      // — mais de uma vez).
      const next = new URL(chosen, window.location.href).href
      if (video.currentSrc !== next && video.src !== next) video.src = chosen
      video.play().catch(() => undefined)
    }

    apply()

    if (media) {
      const onChange = () => apply()
      if (media.addEventListener) {
        media.addEventListener('change', onChange)
      } else {
        media.addListener(onChange)
      }
      return () => {
        cancelled = true
        hls?.destroy()
        if (media.removeEventListener) {
          media.removeEventListener('change', onChange)
        } else {
          media.removeListener(onChange)
        }
      }
    }

    return () => {
      cancelled = true
      hls?.destroy()
    }
  }, [src, mobileSrc])

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
    />
  )
}
