import { Box, CardBody, Grommet, Main } from "grommet";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import AxiosInstance from "../AxiosInstance";
import { MapObject, Point, Site } from "./Map.types";


export default function MapView() {
  let params = useParams();
  const [map, setMap] = useState<MapObject>();
  const [sites, setSites] = useState<Array<Site>>([]);
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
        getSites(layer.id, 1000, 1);
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
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }

  function getSites(layerId: number, limit: number, page: number): Promise<any> {
    const offset = (page - 1) * limit;
    return AxiosInstance
    .get(`/site/?limit=${limit}&offset=${offset}&layer=${layerId}`)
    .then((res) => {
      setSites(sites => [...sites, ...res.data["objects"]]);
      if (res.data["meta"]["next"]) {
        return getSites(layerId, limit, page+1);
      }
      return;
    })
    .catch((err) => console.log(err));
  }

  return (
    <Grommet>
      <Main>
        <Box height={{ max: `${windowDimensions.height}px`}}>
          <CardBody>
            <ComposableMap projection="geoMercator">
              <ZoomableGroup zoom={1}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                  geographies.map(geo => <Geography key={geo.rsmKey} geography={geo} fill="#EAEAEC"
                  stroke="#D6D6DA" />)
                  }
                </Geographies>
                {sites.map(({ id, name, shapes }) => {
                  const point = shapes[0].shape as Point;
                  return (
                  <Marker key={id} coordinates={point.coordinates}>
                  <circle r={10} fill="#F00" stroke="#fff" strokeWidth={2} />
                      {name}
                  </Marker>
                )})}
              </ZoomableGroup>
          </ComposableMap>
          </CardBody>
        </Box>
      </Main>
    </Grommet>
  );

}