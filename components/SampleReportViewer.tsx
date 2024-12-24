'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react'

interface SampleReportViewerProps {
  reportUrl: string
}

export function SampleReportViewer({ reportUrl }: SampleReportViewerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5))

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <div>
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-center"
      >
        {isOpen ? 'Close Sample Report' : 'View Sample Report'}
      </Button>
      {isOpen && (
        <div 
          ref={containerRef}
          className="mt-4 border border-gray-200 rounded-lg overflow-hidden bg-white"
        >
          <div className="bg-gray-100 p-2 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600 px-2">
              Sample Report
            </span>
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleZoomOut} 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600 w-16 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button 
                onClick={handleZoomIn} 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button 
                onClick={toggleFullscreen} 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div 
            className={`overflow-auto transition-all duration-200 ease-in-out${
              isFullscreen ? ' h-screen' : ' h-[600px]'
            }`}
          >
            <iframe
              ref={iframeRef}
              src={reportUrl}
              className="w-full h-full"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
                width: `${100 / zoom}%`,
                height: `${100 / zoom}%`,
              }}
              title="Sample Life Insurance Policy Review"
            />
          </div>
        </div>
      )}
    </div>
  )
}

