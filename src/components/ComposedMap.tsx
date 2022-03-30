import { scaleLinear } from 'd3-scale';
import { Box, Layer, Spinner } from 'grommet';
import React from 'react';
import {
  ComposableMap, ZoomableGroup, Geographies, Geography, Marker,
} from 'react-simple-maps';
import { LayerObject, Point } from '../views/Map/Map.types';

interface ComposedMapProps {
  isLoading: boolean
  layers: LayerObject[]
}

function renderSites(layer: LayerObject) {
  const { sites } = layer;
  const max = Math.max(...sites.map((site) => site.data[layer.data_key]));
  const min = Math.min(...sites.map((site) => site.data[layer.data_key]));

  const sizeScale = scaleLinear()
    .domain([min, max])
    .range([0, 15]);

  return sites.map(({
    id, name, data, shapes,
  }) => {
    const point = shapes[0].shape as Point;
    return (
      <Marker key={id} coordinates={point.coordinates}>
        <circle r={sizeScale(data.pop_max)} fill="#F00" opacity={0.5} />
        {name}
      </Marker>
    );
  });
}

function renderLayers(layers: LayerObject[]) {
  return layers.map((layer) => renderSites(layer));
}

export default function ComposedMap(props: ComposedMapProps) {
  const { isLoading, layers } = props;
  const geoUrl = 'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json';

  return (
    <Box>
      { isLoading ? (
        <Layer>
          <Spinner color="status-ok" size="large" />
        </Layer>
      ) : (
        <ComposableMap projection="geoMercator">
          <ZoomableGroup zoom={1}>
            <Spinner />
            <Geographies geography={geoUrl}>
              {({ geographies }) => geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#EAEAEC"
                  stroke="#D6D6DA"
                />
              ))}
            </Geographies>
            {renderLayers(layers)}
          </ZoomableGroup>
        </ComposableMap>
      )}
    </Box>
  );
}
