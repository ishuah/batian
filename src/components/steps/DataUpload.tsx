import React, { useCallback, useState } from 'react'
import type { ParsedData } from '../../types'
import { useDataParser } from '../../hooks/useDataParser'

interface DataUploadProps {
  onDataReady: (data: ParsedData) => void
}

const DataUpload: React.FC<DataUploadProps> = ({ onDataReady }) => {
  const { parsedData, error, isLoading, parseFile } = useDataParser()
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return
      const file = files[0]
      parseFile(file)
    },
    [parseFile],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  React.useEffect(() => {
    if (parsedData) onDataReady(parsedData)
  }, [parsedData, onDataReady])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-slate-800">Upload Data</h2>
        <p className="text-xs text-slate-500 mt-0.5">CSV or GeoJSON — your data never leaves the browser</p>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={[
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : 'border-slate-200 hover:border-slate-300 bg-slate-50',
        ].join(' ')}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-8 h-8 mx-auto text-slate-400 mb-2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="text-sm text-slate-600 mb-1">Drag & drop a file here</p>
        <p className="text-xs text-slate-400 mb-3">Supports .csv and .geojson</p>
        <label className="inline-block cursor-pointer">
          <input
            type="file"
            accept=".csv,.geojson,.json"
            className="sr-only"
            onChange={handleFileInput}
          />
          <span className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors">
            Browse file
          </span>
        </label>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Parsing…
        </div>
      )}

      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
          {error}
        </div>
      )}

      {parsedData && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700">
              {parsedData.rows.length} rows · {parsedData.columns.length} columns
            </span>
            <span className="text-xs text-green-600 font-medium">✓ Loaded</span>
          </div>
          <div className="overflow-x-auto rounded border border-slate-200">
            <table className="text-xs w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {parsedData.columns.slice(0, 5).map((col) => (
                    <th
                      key={col.name}
                      className="px-2 py-1.5 text-left font-medium text-slate-700 whitespace-nowrap"
                    >
                      {col.name}
                      <span className="ml-1 text-slate-400 font-normal">({col.type})</span>
                    </th>
                  ))}
                  {parsedData.columns.length > 5 && (
                    <th className="px-2 py-1.5 text-slate-400">+{parsedData.columns.length - 5}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {parsedData.rows.slice(0, 5).map((row, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                    {parsedData.columns.slice(0, 5).map((col) => (
                      <td key={col.name} className="px-2 py-1 text-slate-600 max-w-20 truncate">
                        {String(row[col.name] ?? '')}
                      </td>
                    ))}
                    {parsedData.columns.length > 5 && <td />}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataUpload
