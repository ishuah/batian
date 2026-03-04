import { useRef, useEffect, useCallback } from 'react'
import * as d3 from 'd3'
import type { MapConfig, DataRow, ChoroplethColumnMapping, SymbolColumnMapping } from '../types'
import { getPresetById, buildColorScale } from '../utils/colorScales'

type GeoFeature = GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>

interface UseMapRendererOptions {
  width?: number
  height?: number
}

interface UseMapRendererReturn {
  svgRef: React.RefObject<SVGSVGElement | null>
  render: (
    geojson: GeoJSON.FeatureCollection,
    data: DataRow[],
    config: MapConfig,
  ) => void
}

export function useMapRenderer(
  options: UseMapRendererOptions = {},
): UseMapRendererReturn {
  const { width = 800, height = 500 } = options
  const svgRef = useRef<SVGSVGElement | null>(null)

  const render = useCallback(
    (geojson: GeoJSON.FeatureCollection, data: DataRow[], config: MapConfig) => {
      const svg = d3.select(svgRef.current)
      svg.selectAll('*').remove()
      svg.attr('width', width).attr('height', height)

      const projFn =
        (d3 as unknown as Record<string, () => d3.GeoProjection>)[config.style.projection] ??
        d3.geoNaturalEarth1

      const projection = projFn().fitSize([width, height], geojson)
      const pathGen = d3.geoPath().projection(projection)

      const mapGroup = svg.append('g').attr('class', 'map-layer')

      if (config.mapType === 'choropleth') {
        const mapping = config.columnMapping as ChoroplethColumnMapping
        const valueMap = new Map<string, number>()
        for (const row of data) {
          const region = String(row[mapping.regionColumn] ?? '')
          const value = Number(row[mapping.valueColumn] ?? 0)
          valueMap.set(region.toLowerCase(), value)
        }

        const values = Array.from(valueMap.values()).filter(isFinite)
        const domain: [number, number] = [d3.min(values) ?? 0, d3.max(values) ?? 1]
        const preset = getPresetById(config.style.colorScheme)
        const scale = buildColorScale(preset, domain)

        mapGroup
          .selectAll<SVGPathElement, GeoFeature>('path')
          .data(geojson.features)
          .join('path')
          .attr('d', pathGen)
          .attr('fill', (feature) => {
            const name =
              (feature.properties?.['name'] ?? feature.properties?.['NAME'] ?? '')
                .toString()
                .toLowerCase()
            const val = valueMap.get(name)
            if (val == null) return '#e2e8f0'
            if (preset.type === 'categorical') {
              return (scale as d3.ScaleOrdinal<string, string>)(String(val))
            }
            return (scale as d3.ScaleSequential<string>)(val)
          })
          .attr('stroke', '#fff')
          .attr('stroke-width', 0.5)
      } else {
        // Symbol map — draw base geography first
        mapGroup
          .selectAll<SVGPathElement, GeoFeature>('path')
          .data(geojson.features)
          .join('path')
          .attr('d', pathGen)
          .attr('fill', '#e2e8f0')
          .attr('stroke', '#fff')
          .attr('stroke-width', 0.5)

        const mapping = config.columnMapping as SymbolColumnMapping
        const values = data
          .map((row) => Number(row[mapping.valueColumn ?? ''] ?? 0))
          .filter(isFinite)
        const domain: [number, number] = [d3.min(values) ?? 0, d3.max(values) ?? 1]
        const sizeScale = d3
          .scaleSqrt()
          .domain(domain)
          .range([config.style.symbolSizeMin, config.style.symbolSizeMax])

        const symbolGroup = svg.append('g').attr('class', 'symbol-layer')

        for (const row of data) {
          const lat = Number(row[mapping.latColumn] ?? NaN)
          const lng = Number(row[mapping.lngColumn] ?? NaN)
          if (!isFinite(lat) || !isFinite(lng)) continue
          const projected = projection([lng, lat])
          if (!projected) continue
          const [x, y] = projected
          const val = mapping.valueColumn ? Number(row[mapping.valueColumn] ?? 0) : 5
          symbolGroup
            .append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', isFinite(val) ? sizeScale(val) : config.style.symbolSizeMin)
            .attr('fill', '#3b82f6')
            .attr('fill-opacity', 0.7)
            .attr('stroke', '#1d4ed8')
            .attr('stroke-width', 0.5)
        }
      }

      // Legend
      if (config.style.showLegend) {
        const legendGroup = svg.append('g').attr('class', 'legend').attr('transform', 'translate(20,20)')
        legendGroup
          .append('rect')
          .attr('width', 120)
          .attr('height', 24)
          .attr('fill', 'white')
          .attr('fill-opacity', 0.8)
          .attr('rx', 4)
        legendGroup
          .append('text')
          .attr('x', 8)
          .attr('y', 16)
          .attr('font-size', 12)
          .attr('fill', '#374151')
          .text(
            config.mapType === 'choropleth'
              ? (config.columnMapping as ChoroplethColumnMapping).valueColumn
              : ((config.columnMapping as SymbolColumnMapping).valueColumn ?? 'Size'),
          )
      }
    },
    [width, height],
  )

  useEffect(() => {
    // Clean up on unmount
    return () => {
      if (svgRef.current) {
        d3.select(svgRef.current).selectAll('*').remove()
      }
    }
  }, [])

  return { svgRef, render }
}
