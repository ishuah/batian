import { scaleLinear } from "d3-scale";
import { Avatar, Box, Button, Card, CardBody, Text, CardHeader, Grommet, Layer, Main, Nav, Sidebar, Spinner, Heading } from "grommet";
import { Clock, Favorite, Help, Projects, ShareOption } from "grommet-icons/icons";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import AxiosInstance from "../../AxiosInstance";
import { LayerObject, MapObject, Point } from "./Map.types";


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
      .catch((error) => {
        console.log(error.response);
        setIsLoading(false);
      });
  }

  function getSites(layer: LayerObject, limit: number, page: number): Promise<any> {
    const offset = (page - 1) * limit;
    return AxiosInstance
    .get(`/site/?limit=${limit}&offset=${offset}&layer=${layer.id}`)
    .then((res) => {
      layer.sites = [...layer.sites, ...res.data["objects"]];

      if (res.data["meta"]["next"]) {
        return getSites(layer, limit, page+1);
      }
      setLayers(layers => [...layers, layer]);
      return;
    })
    .finally(() => setIsLoading(false))
    .catch((err) => {
      console.log(err);
      setIsLoading(false);
    });
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
        { !isLoading &&
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
      </Main>
    </Grommet>
  );

}