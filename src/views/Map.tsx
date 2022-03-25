import { Grommet, Main, Box, Card, CardBody, Heading, CardHeader, Text, CardFooter } from "grommet";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import AxiosInstance from "../AxiosInstance";
import { MapObject, Point, Site } from "./Map.types";


export default function Map() {
  let params = useParams();
  const [map, setMap] = useState<MapObject>();
  const [sites, setSites] = useState<Array<Site>>([]);

  const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";
  
  useEffect(() => {
    if (!map) {
      getMap();
    }

    if (map && sites.length == 0) {
      map.layers.map((layer) => {
        getSites(layer.id);
      });
    }
  }, [map, sites]);

  function getMap() {
    AxiosInstance
      .get(`/map/${params.mapId}`)
      .then((res) => {
        setMap(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }

  function getSites(layerId: number) {
    AxiosInstance
    .get(`/site/?limit=100&layer=${layerId}`)
    .then((res) => {
      setSites(sites => [...sites, ...res.data["objects"]]);
    })
    .catch((err) => console.log(err));
  }

  return (
    <Grommet>
      <Main pad="small" background="light-2">
        <Box pad="xlarge" align="center">
        <Card pad="medium" height="large" width="large" background="#FFFFFF" round="false">
          <CardHeader>
            <Heading margin="xsmnoneall" level="4">{map && map.name}</Heading>
          </CardHeader>
          <CardBody pad="xsmall">
            <ComposableMap projection="geoMercator">
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                geographies.map(geo => <Geography key={geo.rsmKey} geography={geo} fill="#EAEAEC"
                stroke="#D6D6DA" />)
                }
              </Geographies>
              {sites.map(({ name, shapes }) => {
                const point = shapes[0].shape as Point;
                return (
                <Marker key={name} coordinates={point.coordinates}>
                <circle r={10} fill="#F00" stroke="#fff" strokeWidth={2} />
                    {name}
                </Marker>
              )})}
            </ComposableMap>
          </CardBody>
          <CardFooter>
            <Text size="small">Built by Ishuah Kariuki</Text>
          </CardFooter>
        </Card>
        </Box>
      </Main>
    </Grommet>
  );
  
}