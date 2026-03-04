import React from 'react'

interface MapCanvasProps {
  svgRef: React.RefObject<SVGSVGElement | null>
  isEmpty?: boolean
}

const MapCanvas: React.FC<MapCanvasProps> = ({ svgRef, isEmpty = false }) => {
  return (
    <div className="flex-1 bg-slate-100 flex items-center justify-center overflow-hidden relative">
      {isEmpty && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="w-16 h-16 text-slate-300 mb-3"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <p className="text-slate-400 text-sm">Your map will appear here</p>
          <p className="text-slate-300 text-xs mt-1">Complete the steps on the left to get started</p>
        </div>
      )}
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ display: isEmpty ? 'none' : 'block' }}
      />
    </div>
  )
}

export default MapCanvas
