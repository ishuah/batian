import React, { useRef, useState } from 'react'
import type { ExportFormat } from '../../types'
import { useExport } from '../../hooks/useExport'

interface ExportPanelProps {
  svgRef: React.RefObject<SVGSVGElement | null>
}

const FORMATS: { key: ExportFormat; label: string; description: string }[] = [
  { key: 'svg', label: 'SVG', description: 'Vector — scalable, editable in Inkscape / Figma' },
  { key: 'png', label: 'PNG', description: 'Raster — fixed 2x resolution, ready to embed' },
  { key: 'iframe', label: 'iframe', description: 'Self-contained HTML snippet for embedding' },
]

const ExportPanel: React.FC<ExportPanelProps> = ({ svgRef }) => {
  const { exportMap } = useExport()
  const [selected, setSelected] = useState<ExportFormat>('svg')
  const [isExporting, setIsExporting] = useState(false)
  const [exportedFormat, setExportedFormat] = useState<ExportFormat | null>(null)
  const filenameRef = useRef<HTMLInputElement>(null)

  const handleExport = async () => {
    if (!svgRef.current) return
    const filename = filenameRef.current?.value.trim() || 'batian-map'
    setIsExporting(true)
    try {
      await exportMap(svgRef.current, selected, filename)
      setExportedFormat(selected)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-slate-800">Export</h2>
        <p className="text-xs text-slate-500 mt-0.5">Download your map in the format you need</p>
      </div>

      {/* Format selector */}
      <div className="space-y-2">
        {FORMATS.map((fmt) => (
          <button
            key={fmt.key}
            onClick={() => setSelected(fmt.key)}
            className={[
              'w-full text-left p-3 rounded-lg border-2 transition-all',
              selected === fmt.key
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300 bg-white',
            ].join(' ')}
          >
            <div className="flex items-center gap-2">
              <span
                className={[
                  'text-xs font-bold px-1.5 py-0.5 rounded',
                  selected === fmt.key ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600',
                ].join(' ')}
              >
                {fmt.label}
              </span>
              <span className="text-xs text-slate-500">{fmt.description}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Filename */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">Filename</label>
        <input
          ref={filenameRef}
          type="text"
          defaultValue="batian-map"
          className="w-full text-sm border border-slate-200 rounded-md px-2 py-1.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="batian-map"
        />
      </div>

      {/* Export button */}
      <button
        onClick={handleExport}
        disabled={isExporting || !svgRef.current}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-sm font-medium rounded-lg transition-colors"
      >
        {isExporting ? 'Exporting…' : `Download ${selected.toUpperCase()}`}
      </button>

      {exportedFormat && (
        <p className="text-xs text-green-600 text-center">
          ✓ {exportedFormat.toUpperCase()} downloaded
        </p>
      )}
    </div>
  )
}

export default ExportPanel
