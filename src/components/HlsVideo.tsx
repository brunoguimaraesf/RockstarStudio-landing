import { useEffect, useRef } from 'react'

type HlsVideoProps = {
  src: string
  className?: string
}

export default function HlsVideo({ src, className }: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (src.endsWith('.m3u8')) {
      // hls.js só entra no bundle quando a fonte é HLS de fato
      let hls: import('hls.js').default | undefined
      let cancelled = false
      import('hls.js').then(({ default: Hls }) => {
        if (cancelled) return
        if (Hls.isSupported()) {
          hls = new Hls()
          hls.loadSource(src)
          hls.attachMedia(video)
        } else {
          // HLS nativo (Safari)
          video.src = src
        }
      })
      return () => {
        cancelled = true
        hls?.destroy()
      }
    }
    // Fonte .mp4 direta
    video.src = src
  }, [src])

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      muted
      loop
      playsInline
    />
  )
}
