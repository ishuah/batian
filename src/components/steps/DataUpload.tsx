import React, { useCallback, useRef, useState } from 'react'
import type { ColumnType, ParsedData } from '../../types'
import { useDataParser } from '../../hooks/useDataParser'
import { SAMPLE_AFRICA_CSV } from '../../data/sampleData'

interface DataUploadProps {
  onDataReady: (data: ParsedData) => void
}

const TYPE_BADGE: Record<ColumnType, { label: string; className: string }> = {
  latitude:  { label: 'latitude',  className: 'bg-green-100 text-green-700' },
  longitude: { label: 'longitude', className: 'bg-green-100 text-green-700' },
  numeric:   { label: 'numeric',   className: 'bg-blue-100 text-blue-700' },
  region:    { label: 'region',    className: 'bg-purple-100 text-purple-700' },
  text:      { label: 'text',      className: 'bg-gray-100 text-gray-600' },
}

const DataUpload: React.FC<DataUploadProps> = ({ onDataReady }) => {
  const { parsedData, error, isLoading, parseFile, parseText, reset } = useDataParser()
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return
      parseFile(files[0])
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

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear drag state if leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }

  const handleClick = () => inputRef.current?.click()

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    // Reset so the same file can be re-selected
    e.target.value = ''
  }

  const handleSampleData = () => {
    reset()
    parseText(SAMPLE_AFRICA_CSV, false)
  }

  React.useEffect(() => {
    if (parsedData) onDataReady(parsedData)
  }, [parsedData, onDataReady])

  const previewColumns = parsedData?.columns ?? []
  const previewRows = parsedData?.rows.slice(0, 5) ?? []
  const showingCount = Math.min(5, parsedData?.rowCount ?? 0)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-slate-800">Upload your data</h2>
        <p className="text-xs text-slate-500 mt-0.5">Your data never leaves the browser</p>
      </div>

      {/* Drop zone */}
      {!parsedData && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload file"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          onKeyDown={(e) => e.key === 'Enter' && handleClick()}
          className={[
            'relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 select-none',
            isDragging
              ? 'border-blue-400 bg-blue-50 scale-[1.01]'
              : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/40',
          ].join(' ')}
        >
          {/* Animated drag overlay */}
          {isDragging && (
            <div className="absolute inset-0 rounded-xl bg-blue-100/60 flex items-center justify-center pointer-events-none">
              <p className="text-blue-600 font-semibold text-sm">Drop to upload</p>
            </div>
          )}

          <div className={isDragging ? 'opacity-20' : ''}>
            <div className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center mx-auto mb-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                className="w-6 h-6 text-slate-500"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-700 mb-1">Drag & drop a file here</p>
            <p className="text-xs text-slate-400 mb-3">or click to browse</p>
            <div className="flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-white border border-slate-200 text-slate-500 font-mono">
                .csv
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-white border border-slate-200 text-slate-500 font-mono">
                .geojson
              </span>
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".csv,.geojson,.json"
            className="sr-only"
            onChange={handleFileInput}
          />
        </div>
      )}

      {/* Sample data button */}
      {!parsedData && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-100" />
          <button
            onClick={handleSampleData}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors font-medium"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
            Try sample dataset
          </button>
          <div className="flex-1 h-px bg-slate-100" />
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-slate-500 justify-center py-4">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Parsing file…
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Data preview */}
      {parsedData && (
        <div className="space-y-3">
          {/* Stats bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              <span className="text-xs font-medium text-slate-700">
                {parsedData.rowCount.toLocaleString()} rows · {previewColumns.length} columns
              </span>
              <span className="text-xs text-slate-400 capitalize">{parsedData.sourceType}</span>
            </div>
            <button
              onClick={() => { reset() }}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Clear data"
            >
              ✕ Clear
            </button>
          </div>

          {/* Column type legend */}
          <div className="flex flex-wrap gap-1.5">
            {previewColumns.map((col) => {
              const badge = TYPE_BADGE[col.type]
              return (
                <span
                  key={col.name}
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${badge.className}`}
                  title={`${col.name}: ${badge.label} — e.g. ${col.sample.slice(0, 2).join(', ')}`}
                >
                  {col.name}
                  <span className="opacity-60 font-normal text-[10px]">{badge.label}</span>
                </span>
              )
            })}
          </div>

          {/* Preview table */}
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="text-xs w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {previewColumns.map((col) => {
                      const badge = TYPE_BADGE[col.type]
                      return (
                        <th
                          key={col.name}
                          className="px-3 py-2 text-left font-medium text-slate-700 whitespace-nowrap"
                        >
                          <span>{col.name}</span>
                          <span className={`ml-1.5 px-1 py-0.5 rounded text-[10px] font-normal ${badge.className}`}>
                            {badge.label}
                          </span>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
                      {previewColumns.map((col) => (
                        <td key={col.name} className="px-3 py-1.5 text-slate-600 max-w-28 truncate">
                          {String(row[col.name] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-400">
              Showing {showingCount} of {parsedData.rowCount.toLocaleString()} rows
            </div>
          </div>

          {/* Continue button */}
          <button
            onClick={() => onDataReady(parsedData)}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  )
}

export default DataUpload
