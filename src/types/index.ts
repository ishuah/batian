// ─── Raw data types ───────────────────────────────────────────────────────────

export type ColumnType = 'latitude' | 'longitude' | 'region' | 'numeric' | 'text'

export interface ColumnDef {
  name: string
  type: ColumnType
  sample: string[]
}

export type DataRow = Record<string, string | number>

export interface ParsedData {
  rows: DataRow[]
  columns: ColumnDef[]
  rowCount: number
  sourceType: 'csv' | 'geojson'
  rawText: string
}

// ─── Map types ────────────────────────────────────────────────────────────────

export type MapType = 'choropleth' | 'symbol'

export type GeographyKey = 'world-countries' | 'africa-countries' | 'kenya-counties' | 'custom'

export type ProjectionName =
  | 'geoNaturalEarth1'
  | 'geoMercator'
  | 'geoEqualEarth'
  | 'geoOrthographic'

// ─── Column mapping ───────────────────────────────────────────────────────────

export interface ChoroplethColumnMapping {
  regionColumn: string
  valueColumn: string
  labelColumn?: string
}

export interface SymbolColumnMapping {
  latColumn: string
  lngColumn: string
  valueColumn?: string
  labelColumn?: string
}

export type ColumnMapping = ChoroplethColumnMapping | SymbolColumnMapping

// ─── Style ────────────────────────────────────────────────────────────────────

export type ColorScaleType = 'sequential' | 'diverging' | 'categorical'

export type LegendPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export interface StyleConfig {
  colorScale: ColorScaleType
  colorScheme: string
  showLegend: boolean
  legendPosition: LegendPosition
  showLabels: boolean
  labelFontSize: number
  projection: ProjectionName
  symbolSizeMin: number
  symbolSizeMax: number
}

// ─── Full map config ──────────────────────────────────────────────────────────

export interface MapConfig {
  mapType: MapType
  geography: GeographyKey
  customGeoJSON?: GeoJSON.FeatureCollection
  columnMapping: ColumnMapping
  style: StyleConfig
}

// ─── Region match ─────────────────────────────────────────────────────────────

export interface RegionMatch {
  dataValue: string
  featureId: string | null
  featureName: string | null
  confidence: number
}

// ─── Export ───────────────────────────────────────────────────────────────────

export type ExportFormat = 'svg' | 'png' | 'iframe'

// ─── App step state ───────────────────────────────────────────────────────────

export type AppStep = 'UPLOAD' | 'MAP_TYPE' | 'COLUMN_MAP' | 'STYLE' | 'EXPORT'

export interface AppState {
  currentStep: AppStep
  parsedData: ParsedData | null
  mapType: MapType | null
  geography: GeographyKey
  columnMapping: ColumnMapping | null
  style: StyleConfig
  completedSteps: Set<AppStep>
}

