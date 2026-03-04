import { useState, useCallback } from 'react'
import Papa from 'papaparse'
import type { ParsedData, DataRow } from '../types'
import { detectColumns } from '../utils/columnDetector'

interface UseDataParserReturn {
  parsedData: ParsedData | null
  error: string | null
  isLoading: boolean
  parseFile: (file: File) => void
  parseText: (text: string, isGeoJSON?: boolean) => void
  reset: () => void
}

function parseGeoJSONText(text: string): ParsedData {
  const geojson = JSON.parse(text) as GeoJSON.FeatureCollection
  if (!geojson.features || !Array.isArray(geojson.features)) {
    throw new Error('Invalid GeoJSON: missing features array')
  }
  const rows: DataRow[] = geojson.features.map((feature) => ({
    ...(feature.properties ?? {}),
    _geometry_type: feature.geometry?.type ?? '',
  }))
  const columns = detectColumns(rows)
  return { rows, columns, rowCount: rows.length, sourceType: 'geojson', rawText: text }
}

function parseCSVText(text: string): ParsedData {
  const result = Papa.parse<DataRow>(text, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  })
  if (result.errors.length > 0 && result.data.length === 0) {
    throw new Error(`CSV parse error: ${result.errors[0].message}`)
  }
  const rows = result.data
  const columns = detectColumns(rows)
  return { rows, columns, rowCount: rows.length, sourceType: 'csv', rawText: text }
}

export function useDataParser(): UseDataParserReturn {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const parseText = useCallback((text: string, isGeoJSON = false) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = isGeoJSON ? parseGeoJSONText(text) : parseCSVText(text)
      setParsedData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const parseFile = useCallback(
    (file: File) => {
      const ext = file.name.toLowerCase()
      const isGeoJSON = ext.endsWith('.geojson') || ext.endsWith('.json')
      const isCSV = ext.endsWith('.csv')
      if (!isGeoJSON && !isCSV) {
        setError('Unsupported file type. Please upload a .csv or .geojson file.')
        return
      }
      setIsLoading(true)
      setError(null)
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        parseText(text, isGeoJSON)
      }
      reader.onerror = () => {
        setError('Failed to read file')
        setIsLoading(false)
      }
      reader.readAsText(file)
    },
    [parseText],
  )

  const reset = useCallback(() => {
    setParsedData(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return { parsedData, error, isLoading, parseFile, parseText, reset }
}
