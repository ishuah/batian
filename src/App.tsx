import React, { useCallback, useEffect, useRef, useState } from 'react'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import MapCanvas from './components/map/MapCanvas'
import DataUpload from './components/steps/DataUpload'
import MapTypePicker from './components/steps/MapTypePicker'
import ColumnMapper from './components/steps/ColumnMapper'
import StylePanel from './components/steps/StylePanel'
import ExportPanel from './components/steps/ExportPanel'
import { useMapRenderer } from './hooks/useMapRenderer'
import type {
  AppState,
  AppStep,
  ColumnMapping,
  GeographyKey,
  MapType,
  ParsedData,
  StyleConfig,
} from './types'

import worldCountries from './data/world-countries.json'
import africaCountries from './data/africa-countries.json'
import kenyaCounties from './data/kenya-counties.json'

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_STYLE: StyleConfig = {
  colorScale: 'sequential',
  colorScheme: 'blues',
  showLegend: true,
  legendPosition: 'bottom-right',
  showLabels: false,
  labelFontSize: 11,
  projection: 'geoNaturalEarth1',
  symbolSizeMin: 4,
  symbolSizeMax: 30,
}

const STEP_ORDER: AppStep[] = ['UPLOAD', 'MAP_TYPE', 'COLUMN_MAP', 'STYLE', 'EXPORT']

function nextStep(current: AppStep): AppStep {
  const idx = STEP_ORDER.indexOf(current)
  return STEP_ORDER[Math.min(idx + 1, STEP_ORDER.length - 1)]
}

function getGeoJSON(key: GeographyKey): GeoJSON.FeatureCollection {
  switch (key) {
    case 'africa-countries':
      return africaCountries as GeoJSON.FeatureCollection
    case 'kenya-counties':
      return kenyaCounties as GeoJSON.FeatureCollection
    default:
      return worldCountries as GeoJSON.FeatureCollection
  }
}

// ─── App ──────────────────────────────────────────────────────────────────────

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentStep: 'UPLOAD',
    parsedData: null,
    mapType: null,
    geography: 'world-countries',
    columnMapping: null,
    style: DEFAULT_STYLE,
    completedSteps: new Set(),
  })

  const canvasRef = useRef<HTMLDivElement>(null)
  const { svgRef, render } = useMapRenderer({
    width: canvasRef.current?.clientWidth ?? 900,
    height: canvasRef.current?.clientHeight ?? 560,
  })

  // Advance to next step and mark current complete
  const completeStep = useCallback((step: AppStep) => {
    setState((prev) => ({
      ...prev,
      currentStep: nextStep(step),
      completedSteps: new Set([...prev.completedSteps, step]),
    }))
  }, [])

  const goToStep = useCallback((step: AppStep) => {
    setState((prev) => ({ ...prev, currentStep: step }))
  }, [])

  // Re-render map whenever relevant state changes
  useEffect(() => {
    const { parsedData, mapType, columnMapping, style, geography, completedSteps } = state
    if (!parsedData || !mapType || !columnMapping) return
    if (!completedSteps.has('COLUMN_MAP')) return

    const geojson = getGeoJSON(geography)
    render(geojson, parsedData.rows, {
      mapType,
      geography,
      columnMapping,
      style,
    })
  }, [state, render])

  const isMapVisible =
    state.parsedData !== null &&
    state.mapType !== null &&
    state.columnMapping !== null &&
    state.completedSteps.has('COLUMN_MAP')

  // ─── Step content ────────────────────────────────────────────────────────

  const stepContent = React.useMemo(() => {
    switch (state.currentStep) {
      case 'UPLOAD':
        return (
          <DataUpload
            onDataReady={(data: ParsedData) => {
              setState((prev) => ({ ...prev, parsedData: data }))
              completeStep('UPLOAD')
            }}
          />
        )

      case 'MAP_TYPE':
        return (
          <div className="space-y-4">
            <MapTypePicker
              parsedData={state.parsedData!}
              selected={state.mapType}
              onSelect={(mapType: MapType) => {
                setState((prev) => ({ ...prev, mapType }))
              }}
            />
            {/* Geography picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Base geography</label>
              <select
                value={state.geography}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    geography: e.target.value as GeographyKey,
                  }))
                }
                className="w-full text-sm border border-slate-200 rounded-md px-2 py-1.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="world-countries">World countries</option>
                <option value="africa-countries">African countries</option>
                <option value="kenya-counties">Kenya counties</option>
              </select>
            </div>
            <button
              disabled={!state.mapType}
              onClick={() => completeStep('MAP_TYPE')}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Next: Map Columns →
            </button>
          </div>
        )

      case 'COLUMN_MAP':
        return (
          <div className="space-y-4">
            <ColumnMapper
              columns={state.parsedData?.columns ?? []}
              mapType={state.mapType!}
              mapping={state.columnMapping}
              onMappingChange={(mapping: ColumnMapping) =>
                setState((prev) => ({ ...prev, columnMapping: mapping }))
              }
            />
            <button
              disabled={!state.columnMapping}
              onClick={() => completeStep('COLUMN_MAP')}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Next: Style →
            </button>
          </div>
        )

      case 'STYLE':
        return (
          <div className="space-y-4">
            <StylePanel
              mapType={state.mapType!}
              style={state.style}
              onStyleChange={(style: StyleConfig) =>
                setState((prev) => ({ ...prev, style }))
              }
            />
            <button
              onClick={() => completeStep('STYLE')}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Next: Export →
            </button>
          </div>
        )

      case 'EXPORT':
        return <ExportPanel svgRef={svgRef} />
    }
  }, [state, completeStep, svgRef])

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar state={state} onStepChange={goToStep}>
          {stepContent}
        </Sidebar>
        <main ref={canvasRef} className="flex-1 flex overflow-hidden">
          <MapCanvas svgRef={svgRef} isEmpty={!isMapVisible} />
        </main>
      </div>
    </div>
  )
}

export default App
