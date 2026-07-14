import { useEffect, useRef, useState } from 'react'

type HlsVideoProps = {
  src: string
  mobileSrc?: string
  className?: string
}

export default function HlsVideo({ src, mobileSrc, className }: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [resolvedSrc, setResolvedSrc] = useState(() => {
    if (typeof window === 'undefined' || !mobileSrc) return src
    return window.matchMedia('(max-width: 767px)').matches ? mobileSrc : src
  })

  useEffect(() => {
    if (!mobileSrc) {
      setResolvedSrc(src)
      return
    }

    const media = window.matchMedia('(max-width: 767px)')
    const updateSource = () => setResolvedSrc(media.matches ? mobileSrc : src)

    updateSource()
    if (media.addEventListener) {
      media.addEventListener('change', updateSource)
      return () => media.removeEventListener('change', updateSource)
    }

    media.addListener(updateSource)
    return () => media.removeListener(updateSource)
  }, [mobileSrc, src])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (resolvedSrc.endsWith('.m3u8')) {
      // hls.js só entra no bundle quando a fonte é HLS de fato
      let hls: import('hls.js').default | undefined
      let cancelled = false
      import('hls.js').then(({ default: Hls }) => {
        if (cancelled) return
        if (Hls.isSupported()) {
          hls = new Hls()
          hls.loadSource(resolvedSrc)
          hls.attachMedia(video)
        } else {
          // HLS nativo (Safari)
          video.src = resolvedSrc
        }
      })
      return () => {
        cancelled = true
        hls?.destroy()
      }
    }
    // Fonte .mp4 direta
    video.src = resolvedSrc
    video.load()
    video.play().catch(() => undefined)
  }, [resolvedSrc])

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
    />
  )
}
