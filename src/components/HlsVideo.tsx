import Hls from 'hls.js'
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
    if (src.endsWith('.m3u8') && Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(video)
      return () => hls.destroy()
    }
    // Fonte .mp4 direta ou HLS nativo (Safari)
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
