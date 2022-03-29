import { scaleLinear } from "d3-scale";
import { Box, Card, CardBody, CardHeader, Grommet, Heading, Layer, Main, Spinner, Text } from "grommet";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import AxiosInstance, { getMap, getSites } from "../../API";
import NotFound from "../NotFound";
import { LayerObject, MapObject, Point } from "./Map.types";


export default function MapView() {
  let params = useParams();
  const [map, setMap] = useState<MapObject>();
  const [layers, setLayers] = useState<Array<LayerObject>>([]);
  const [requestError, setRequestError] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

  function getWindowDimensions() {
    const {innerWidth: width, innerHeight: height } = window;
    return { width, height }
  }

  function handleResize() {
    setWindowDimensions(getWindowDimensions());
  }

  useEffect(() => {
    if (map) {
      map.layers.map((layer) => {
        layer.sites = [];
        getSites(layer, 1000, 7).then((response) => {
          setLayers(layers => [...layers, response]);
        })
        .finally(() => setIsLoading(false))
        .catch((error) => {
          setRequestError(error.response);
          setIsLoading(false);
        });
      });
    }
  }, [map]);

  useEffect(() => {
    params.mapId && getMap(params.mapId).then((response) => {
      setMap(response);
    }).catch((error) => {
      setRequestError(error.response);
      setIsLoading(false);
    });

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function renderLayers() {
    return layers.map((layer) => {
      return renderSites(layer)
    });
  }

  function renderSites(layer: LayerObject) {
    const sites = layer.sites;
    const max = Math.max(...sites.map((site) => site.data[layer.data_key] ));
    const min = Math.min(...sites.map((site) => site.data[layer.data_key] ));

    const sizeScale = scaleLinear()
    .domain([min, max])
    .range([0,15]);

    return sites.map(({ id, name, data, shapes }) => {
      const point = shapes[0].shape as Point;
      return (
      <Marker key={id} coordinates={point.coordinates}>
      <circle r={sizeScale(data.pop_max)} fill="#F00" opacity={0.5} />
          {name}
      </Marker>
    )})
  }

  return (
    <Grommet>
      <Main>
        {requestError ? (<NotFound message={requestError.statusText} />) :
        (
          <Box height={{ max: `${windowDimensions.height}px`}}>
          { !isLoading && map &&
          (<Card style={{position: "absolute", top: `${windowDimensions.height * 0.25}px`, left: `${windowDimensions.width * 0.05}px`}}
          height="small" width="medium" background="light-1" round="xsmall">
            <CardHeader pad={{ vertical:"small", horizontal:"medium"}}>
              <Heading level="3" margin="xxsmall">{map && map.name}</Heading></CardHeader>
            <CardBody pad={{ vertical:"small", horizontal:"medium"}}><Text>{map && map.description}</Text></CardBody>
          </Card>)}
            { isLoading ?
                (
                  <Layer>
                    <Spinner color="status-ok" size="large" />
                  </Layer>
                ) :
              <ComposableMap projection="geoMercator">
                <ZoomableGroup zoom={1}>
                  <Spinner />
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                    geographies.map(geo => <Geography key={geo.rsmKey} geography={geo} fill="#EAEAEC"
                    stroke="#D6D6DA" />)
                    }
                  </Geographies>
                  {renderLayers()}
                </ZoomableGroup>
            </ComposableMap>}
          </Box>
        )}
      </Main>
    </Grommet>
  );

}