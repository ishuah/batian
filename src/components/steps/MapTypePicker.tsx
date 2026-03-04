import React from 'react'
import type { MapType, ParsedData } from '../../types'
import { suggestMapType } from '../../utils/columnDetector'

interface MapTypePickerProps {
  parsedData: ParsedData
  selected: MapType | null
  onSelect: (mapType: MapType) => void
}

const MAP_TYPES: { key: MapType; label: string; description: string; icon: React.ReactNode }[] = [
  {
    key: 'choropleth',
    label: 'Choropleth',
    description: 'Fill regions (countries, states, counties) by a numeric value',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <rect x="2" y="2" width="9" height="9" rx="1" opacity="0.9" />
        <rect x="13" y="2" width="9" height="9" rx="1" opacity="0.5" />
        <rect x="2" y="13" width="9" height="9" rx="1" opacity="0.3" />
        <rect x="13" y="13" width="9" height="9" rx="1" opacity="0.7" />
      </svg>
    ),
  },
  {
    key: 'symbol',
    label: 'Symbol',
    description: 'Place circles at lat/lng coordinates, sized or coloured by value',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <circle cx="8" cy="8" r="5" opacity="0.7" />
        <circle cx="17" cy="14" r="3" opacity="0.5" />
        <circle cx="6" cy="17" r="2" opacity="0.9" />
        <circle cx="19" cy="6" r="1.5" opacity="0.6" />
      </svg>
    ),
  },
]

const MapTypePicker: React.FC<MapTypePickerProps> = ({ parsedData, selected, onSelect }) => {
  const suggested = suggestMapType(parsedData.columns)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-slate-800">Choose Map Type</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Suggested:{' '}
          <span className="font-medium text-blue-600 capitalize">{suggested}</span> based on your data
        </p>
      </div>

      <div className="space-y-2">
        {MAP_TYPES.map((type) => {
          const isSelected = selected === type.key
          const isSuggested = suggested === type.key

          return (
            <button
              key={type.key}
              onClick={() => onSelect(type.key)}
              className={[
                'w-full text-left p-3 rounded-lg border-2 transition-all',
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300 bg-white',
              ].join(' ')}
            >
              <div className="flex items-start gap-3">
                <div className={isSelected ? 'text-blue-600' : 'text-slate-400'}>{type.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-slate-800">{type.label}</span>
                    {isSuggested && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                        Suggested
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{type.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MapTypePicker
