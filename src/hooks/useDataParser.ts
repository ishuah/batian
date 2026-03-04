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

function parseGeoJSON(text: string): ParsedData {
  const geojson = JSON.parse(text) as GeoJSON.FeatureCollection
  const rows: DataRow[] = geojson.features.map((feature) => ({
    ...(feature.properties ?? {}),
    _geometry_type: feature.geometry?.type ?? '',
  }))
  const columns = detectColumns(rows)
  return { rows, columns, rawText: text }
}

function parseCSV(text: string): ParsedData {
  const result = Papa.parse<DataRow>(text, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  })
  const rows = result.data
  const columns = detectColumns(rows)
  return { rows, columns, rawText: text }
}

export function useDataParser(): UseDataParserReturn {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const parseText = useCallback((text: string, isGeoJSON = false) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = isGeoJSON ? parseGeoJSON(text) : parseCSV(text)
      setParsedData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const parseFile = useCallback(
    (file: File) => {
      setIsLoading(true)
      setError(null)
      const isGeoJSON = file.name.endsWith('.geojson') || file.name.endsWith('.json')
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        parseText(text, isGeoJSON)
      }
      reader.onerror = () => setError('Failed to read file')
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
