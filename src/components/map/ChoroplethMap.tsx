import React, { useEffect } from 'react'
import type { MapConfig, DataRow } from '../../types'
import { useMapRenderer } from '../../hooks/useMapRenderer'

interface ChoroplethMapProps {
  geojson: GeoJSON.FeatureCollection
  data: DataRow[]
  config: MapConfig
  svgRef?: React.RefObject<SVGSVGElement | null>
  width?: number
  height?: number
}

const ChoroplethMap: React.FC<ChoroplethMapProps> = ({
  geojson,
  data,
  config,
  svgRef: externalRef,
  width = 800,
  height = 500,
}) => {
  const { svgRef: internalRef, render } = useMapRenderer({ width, height })

  useEffect(() => {
    if (geojson.features.length > 0) {
      render(geojson, data, config)
    }
  }, [geojson, data, config, render])

  if (externalRef) return null

  return (
    <svg
      ref={internalRef}
      width={width}
      height={height}
      className="w-full h-full"
    />
  )
}

export default ChoroplethMap
