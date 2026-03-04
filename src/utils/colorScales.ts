import * as d3 from 'd3'
import type { ColorScaleType } from '../types'

export interface ColorScalePreset {
  id: string
  label: string
  type: ColorScaleType
  colors: readonly string[]
}

export const COLOR_SCALE_PRESETS: ColorScalePreset[] = [
  // Sequential
  { id: 'blues', label: 'Blues', type: 'sequential', colors: d3.schemeBlues[7] },
  { id: 'greens', label: 'Greens', type: 'sequential', colors: d3.schemeGreens[7] },
  { id: 'oranges', label: 'Oranges', type: 'sequential', colors: d3.schemeOranges[7] },
  { id: 'reds', label: 'Reds', type: 'sequential', colors: d3.schemeReds[7] },
  { id: 'purples', label: 'Purples', type: 'sequential', colors: d3.schemePurples[7] },
  { id: 'viridis', label: 'Viridis', type: 'sequential', colors: d3.schemeTableau10 },
  // Diverging
  { id: 'rdbu', label: 'Red–Blue', type: 'diverging', colors: d3.schemeRdBu[7] },
  { id: 'rdylgn', label: 'Red–Yellow–Green', type: 'diverging', colors: d3.schemeRdYlGn[7] },
  { id: 'piyg', label: 'Pink–Green', type: 'diverging', colors: d3.schemePiYG[7] },
  // Categorical
  { id: 'tableau10', label: 'Tableau 10', type: 'categorical', colors: d3.schemeTableau10 },
  { id: 'set1', label: 'Set 1', type: 'categorical', colors: d3.schemeSet1 },
  { id: 'set2', label: 'Set 2', type: 'categorical', colors: d3.schemeSet2 },
]

export function buildColorScale(
  preset: ColorScalePreset,
  domain: [number, number],
): d3.ScaleSequential<string> | d3.ScaleDiverging<string> | d3.ScaleOrdinal<string, string> {
  const colors = Array.from(preset.colors)

  if (preset.type === 'sequential') {
    return d3.scaleSequential(d3.interpolateRgbBasis(colors)).domain(domain)
  }

  if (preset.type === 'diverging') {
    const mid = (domain[0] + domain[1]) / 2
    return d3.scaleDiverging(d3.interpolateRgbBasis(colors)).domain([domain[0], mid, domain[1]])
  }

  return d3.scaleOrdinal<string, string>().range(colors)
}

export function getPresetById(id: string): ColorScalePreset {
  return COLOR_SCALE_PRESETS.find((p) => p.id === id) ?? COLOR_SCALE_PRESETS[0]
}
