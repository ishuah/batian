import React from 'react'
import type { StyleConfig, MapType, LegendPosition, ProjectionName } from '../../types'
import { COLOR_SCALE_PRESETS } from '../../utils/colorScales'

interface StylePanelProps {
  mapType: MapType
  style: StyleConfig
  onStyleChange: (style: StyleConfig) => void
}

const PROJECTIONS: { value: ProjectionName; label: string }[] = [
  { value: 'geoNaturalEarth1', label: 'Natural Earth' },
  { value: 'geoMercator', label: 'Mercator' },
  { value: 'geoEqualEarth', label: 'Equal Earth' },
  { value: 'geoOrthographic', label: 'Orthographic' },
]

const LEGEND_POSITIONS: { value: LegendPosition; label: string }[] = [
  { value: 'top-left', label: 'Top left' },
  { value: 'top-right', label: 'Top right' },
  { value: 'bottom-left', label: 'Bottom left' },
  { value: 'bottom-right', label: 'Bottom right' },
]

function update(style: StyleConfig, patch: Partial<StyleConfig>): StyleConfig {
  return { ...style, ...patch }
}

const StylePanel: React.FC<StylePanelProps> = ({ mapType, style, onStyleChange }) => {
  const sequential = COLOR_SCALE_PRESETS.filter((p) => p.type === 'sequential')
  const diverging = COLOR_SCALE_PRESETS.filter((p) => p.type === 'diverging')
  const categorical = COLOR_SCALE_PRESETS.filter((p) => p.type === 'categorical')

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-slate-800">Style</h2>
        <p className="text-xs text-slate-500 mt-0.5">Customize the look of your map</p>
      </div>

      {/* Color scale type */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-700">Color scale</label>
        <div className="flex gap-1">
          {(['sequential', 'diverging', 'categorical'] as const).map((t) => (
            <button
              key={t}
              onClick={() => onStyleChange(update(style, { colorScale: t }))}
              className={[
                'flex-1 py-1 text-xs rounded border font-medium capitalize transition-colors',
                style.colorScale === t
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300',
              ].join(' ')}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Color scheme */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-700">Color scheme</label>
        <select
          value={style.colorScheme}
          onChange={(e) => onStyleChange(update(style, { colorScheme: e.target.value }))}
          className="w-full text-sm border border-slate-200 rounded-md px-2 py-1.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <optgroup label="Sequential">
            {sequential.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </optgroup>
          <optgroup label="Diverging">
            {diverging.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </optgroup>
          <optgroup label="Categorical">
            {categorical.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Projection (choropleth only) */}
      {mapType === 'choropleth' && (
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700">Projection</label>
          <select
            value={style.projection}
            onChange={(e) => onStyleChange(update(style, { projection: e.target.value as ProjectionName }))}
            className="w-full text-sm border border-slate-200 rounded-md px-2 py-1.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {PROJECTIONS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Symbol size (symbol only) */}
      {mapType === 'symbol' && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-700">Symbol size range</label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 w-6">Min</span>
            <input
              type="range"
              min="2"
              max="20"
              value={style.symbolSizeMin}
              onChange={(e) => onStyleChange(update(style, { symbolSizeMin: Number(e.target.value) }))}
              className="flex-1"
            />
            <span className="text-xs text-slate-700 w-4">{style.symbolSizeMin}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 w-6">Max</span>
            <input
              type="range"
              min="5"
              max="60"
              value={style.symbolSizeMax}
              onChange={(e) => onStyleChange(update(style, { symbolSizeMax: Number(e.target.value) }))}
              className="flex-1"
            />
            <span className="text-xs text-slate-700 w-4">{style.symbolSizeMax}</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-700">Legend</label>
          <input
            type="checkbox"
            checked={style.showLegend}
            onChange={(e) => onStyleChange(update(style, { showLegend: e.target.checked }))}
            className="rounded"
          />
        </div>
        {style.showLegend && (
          <select
            value={style.legendPosition}
            onChange={(e) => onStyleChange(update(style, { legendPosition: e.target.value as LegendPosition }))}
            className="w-full text-sm border border-slate-200 rounded-md px-2 py-1.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {LEGEND_POSITIONS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        )}
      </div>

      {/* Labels */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-700">Labels</label>
          <input
            type="checkbox"
            checked={style.showLabels}
            onChange={(e) => onStyleChange(update(style, { showLabels: e.target.checked }))}
            className="rounded"
          />
        </div>
        {style.showLabels && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Font size</span>
            <input
              type="range"
              min="8"
              max="20"
              value={style.labelFontSize}
              onChange={(e) => onStyleChange(update(style, { labelFontSize: Number(e.target.value) }))}
              className="flex-1"
            />
            <span className="text-xs text-slate-700 w-4">{style.labelFontSize}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default StylePanel
