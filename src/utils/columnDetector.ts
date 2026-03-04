import type { ColumnDef, ColumnType } from '../types'

const LAT_NAMES = new Set(['lat', 'latitude', 'y', 'lat_dd', 'latitude_dd'])
const LNG_NAMES = new Set(['lng', 'lon', 'long', 'longitude', 'x', 'lng_dd', 'longitude_dd'])
const REGION_NAMES = new Set([
  'country', 'region', 'state', 'province', 'county', 'district',
  'name', 'admin', 'iso', 'iso2', 'iso3', 'code', 'adm0_a3',
])

function isNumeric(value: string): boolean {
  return value.trim() !== '' && !isNaN(Number(value))
}

function detectType(name: string, samples: string[]): ColumnType {
  const lower = name.toLowerCase().replace(/[^a-z0-9]/g, '')

  if (LAT_NAMES.has(lower)) {
    const allNumeric = samples.every(isNumeric)
    if (allNumeric) {
      const allInRange = samples.every((v) => {
        const n = Number(v)
        return n >= -90 && n <= 90
      })
      if (allInRange) return 'latitude'
    }
  }
  if (LNG_NAMES.has(lower)) {
    const allNumeric = samples.every(isNumeric)
    if (allNumeric) {
      const allInRange = samples.every((v) => {
        const n = Number(v)
        return n >= -180 && n <= 180
      })
      if (allInRange) return 'longitude'
    }
  }
  if (REGION_NAMES.has(lower)) return 'region'

  const numericCount = samples.filter(isNumeric).length
  if (numericCount / samples.length >= 0.8) return 'numeric'

  return 'text'
}

export function detectColumns(rows: Record<string, string | number>[]): ColumnDef[] {
  if (rows.length === 0) return []

  const keys = Object.keys(rows[0])
  return keys.map((key) => {
    const samples = rows
      .slice(0, 20)
      .map((row) => String(row[key] ?? ''))
      .filter(Boolean)

    return {
      name: key,
      type: detectType(key, samples),
      sample: samples.slice(0, 3),
    }
  })
}

export function suggestMapType(columns: ColumnDef[]): 'choropleth' | 'symbol' {
  const hasLatLng =
    columns.some((c) => c.type === 'latitude') &&
    columns.some((c) => c.type === 'longitude')

  if (hasLatLng) return 'symbol'
  return 'choropleth'
}
