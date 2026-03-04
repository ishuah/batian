import React, { useState } from 'react'
import type { ColumnDef, MapType, ColumnMapping, ChoroplethColumnMapping, SymbolColumnMapping } from '../../types'

interface ColumnMapperProps {
  columns: ColumnDef[]
  mapType: MapType
  mapping: ColumnMapping | null
  onMappingChange: (mapping: ColumnMapping) => void
}

interface SelectFieldProps {
  label: string
  description: string
  value: string
  onChange: (value: string) => void
  columns: ColumnDef[]
  required?: boolean
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  description,
  value,
  onChange,
  columns,
  required = false,
}) => (
  <div className="space-y-1">
    <label className="block text-xs font-medium text-slate-700">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <p className="text-xs text-slate-400">{description}</p>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full text-sm border border-slate-200 rounded-md px-2 py-1.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
      <option value="">— select column —</option>
      {columns.map((col) => (
        <option key={col.name} value={col.name}>
          {col.name} ({col.type})
        </option>
      ))}
    </select>
  </div>
)

const ColumnMapper: React.FC<ColumnMapperProps> = ({ columns, mapType, mapping, onMappingChange }) => {
  const choropleth = (mapping as ChoroplethColumnMapping | null) ?? {
    regionColumn: '',
    valueColumn: '',
    labelColumn: '',
  }
  const symbol = (mapping as SymbolColumnMapping | null) ?? {
    latColumn: '',
    lngColumn: '',
    valueColumn: '',
    labelColumn: '',
  }

  const [choroplethState, setChoroplethState] = useState<ChoroplethColumnMapping>({
    regionColumn: choropleth.regionColumn ?? '',
    valueColumn: (choropleth as ChoroplethColumnMapping).valueColumn ?? '',
    labelColumn: (choropleth as ChoroplethColumnMapping).labelColumn ?? '',
  })

  const [symbolState, setSymbolState] = useState<SymbolColumnMapping>({
    latColumn: (symbol as SymbolColumnMapping).latColumn ?? '',
    lngColumn: (symbol as SymbolColumnMapping).lngColumn ?? '',
    valueColumn: (symbol as SymbolColumnMapping).valueColumn ?? '',
    labelColumn: (symbol as SymbolColumnMapping).labelColumn ?? '',
  })

  const updateChoropleth = (field: keyof ChoroplethColumnMapping, value: string) => {
    const next = { ...choroplethState, [field]: value }
    setChoroplethState(next)
    onMappingChange(next)
  }

  const updateSymbol = (field: keyof SymbolColumnMapping, value: string) => {
    const next = { ...symbolState, [field]: value }
    setSymbolState(next)
    onMappingChange(next)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-slate-800">Map Columns</h2>
        <p className="text-xs text-slate-500 mt-0.5">Tell Batian which columns contain location and value data</p>
      </div>

      <div className="space-y-3">
        {mapType === 'choropleth' ? (
          <>
            <SelectField
              label="Region column"
              description="Column containing region names (countries, states, etc.)"
              value={choroplethState.regionColumn}
              onChange={(v) => updateChoropleth('regionColumn', v)}
              columns={columns}
              required
            />
            <SelectField
              label="Value column"
              description="Numeric column to encode as fill colour"
              value={choroplethState.valueColumn}
              onChange={(v) => updateChoropleth('valueColumn', v)}
              columns={columns.filter((c) => c.type === 'numeric')}
              required
            />
            <SelectField
              label="Label column (optional)"
              description="Column to use for map labels"
              value={choroplethState.labelColumn ?? ''}
              onChange={(v) => updateChoropleth('labelColumn', v)}
              columns={columns}
            />
          </>
        ) : (
          <>
            <SelectField
              label="Latitude column"
              description="Column containing latitude values"
              value={symbolState.latColumn}
              onChange={(v) => updateSymbol('latColumn', v)}
              columns={columns.filter((c) => c.type === 'latitude' || c.type === 'numeric')}
              required
            />
            <SelectField
              label="Longitude column"
              description="Column containing longitude values"
              value={symbolState.lngColumn}
              onChange={(v) => updateSymbol('lngColumn', v)}
              columns={columns.filter((c) => c.type === 'longitude' || c.type === 'numeric')}
              required
            />
            <SelectField
              label="Value column (optional)"
              description="Numeric column to control symbol size"
              value={symbolState.valueColumn ?? ''}
              onChange={(v) => updateSymbol('valueColumn', v)}
              columns={columns.filter((c) => c.type === 'numeric')}
            />
            <SelectField
              label="Label column (optional)"
              description="Column to use for symbol labels"
              value={symbolState.labelColumn ?? ''}
              onChange={(v) => updateSymbol('labelColumn', v)}
              columns={columns}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default ColumnMapper
