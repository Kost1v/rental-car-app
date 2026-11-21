import { useEffect, useRef, useState } from 'react'
import { Box } from 'lucide-react'
import '@google/model-viewer'

interface Car3DViewerProps {
  modelUrl: string
  posterUrl: string
  alt: string
}

function Car3DViewer({ modelUrl, posterUrl, alt }: Car3DViewerProps) {
  const viewerRef = useRef<HTMLElement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    const handleLoad = () => setIsLoading(false)
    const handleError = () => {
      setIsLoading(false)
      setHasError(true)
    }

    viewer.addEventListener('load', handleLoad)
    viewer.addEventListener('error', handleError)
    return () => {
      viewer.removeEventListener('load', handleLoad)
      viewer.removeEventListener('error', handleError)
    }
  }, [modelUrl])

  if (hasError) {
    return (
      <img
        alt={alt}
        className="h-70 w-full rounded-3xl object-cover shadow-sm sm:h-105"
        onError={(event) => {
          event.currentTarget.onerror = null
          event.currentTarget.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=85'
        }}
        src={posterUrl}
      />
    )
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-b from-slate-100 to-slate-200/70">
      <model-viewer
        alt={alt}
        auto-rotate
        camera-controls
        className="h-70 w-full sm:h-105"
        loading="eager"
        poster={posterUrl}
        ref={viewerRef}
        shadow-intensity="1"
        src={modelUrl}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100/60">
          <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
            Завантаження 3D-моделі...
          </div>
        </div>
      )}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-slate-950/65 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm">
        <Box className="h-4 w-4 shrink-0" />
        Потягніть, щоб обертати 360° • Коліщатко для масштабу
      </div>
    </div>
  )
}

export default Car3DViewer
