import { Box, Grommet, Layer, Main, Spinner } from "grommet";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import AxiosInstance from "../AxiosInstance";
import { LayerObject, MapObject, Point, Site } from "./Map.types";
import { scaleLinear } from "d3-scale";


export default function MapView() {
  let params = useParams();
  const [map, setMap] = useState<MapObject>();
  const [layers, setLayers] = useState<Array<LayerObject>>([]);
  //const [sites, setSites] = useState<Array<Site>>([]);
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
        getSites(layer, 1000, 8);
      });
    }
  }, [map]);

  useEffect(() => {
    getMap();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function getMap() {
    AxiosInstance
      .get(`/map/${params.mapId}`)
      .then((res) => {
        setMap(res.data);
      })
      .catch((err) => console.log(err));
  }

  function getSites(layer: LayerObject, limit: number, page: number): Promise<any> {
    const offset = (page - 1) * limit;
    return AxiosInstance
    .get(`/site/?limit=${limit}&offset=${offset}&layer=${layer.id}`)
    .then((res) => {
      layer.sites = [...layer.sites, ...res.data["objects"]];
      
      //setSites(sites => [...sites, ...res.data["objects"]]);
      if (res.data["meta"]["next"]) {
        return getSites(layer, limit, page+1);
      }
      setLayers(layers => [...layers, layer]);
      return;
    })
    .finally(() => setIsLoading(false))
    .catch((err) => console.log(err));
  }

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
        <Box height={{ max: `${windowDimensions.height}px`}}>
          <ComposableMap projection="geoMercator">
            <ZoomableGroup zoom={1}>
              <Spinner />
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                geographies.map(geo => <Geography key={geo.rsmKey} geography={geo} fill="#EAEAEC"
                stroke="#D6D6DA" />)
                }
              </Geographies>
              {isLoading ? (
                <Layer>
                  <Spinner color="status-ok" size="large" />
                </Layer>
              ) :
                renderLayers()
              }
            </ZoomableGroup>
        </ComposableMap>
        </Box>
      </Main>
    </Grommet>
  );

}