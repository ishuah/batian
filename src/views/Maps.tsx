import axios from "axios";
import { Anchor, Box, Card, CardBody, CardHeader, Grommet, Heading, Main } from "grommet";
import { Link } from 'grommet-icons';
import React, { useEffect, useState } from "react";
import AxiosInstance from '../AxiosInstance';
import { MapObject } from "./Map.types";

export default function Maps() {
  const [maps, setMaps] = useState<Array<MapObject>>([]);

  useEffect(() => {
    getMaps();
  }, []);

  function getMaps() {
    AxiosInstance
      .get('/map')
      .then((res) => {
        for (let index in res.data["objects"]) {
          const mapObject = res.data["objects"][index] as MapObject;
          setMaps(maps => [...maps, mapObject])
          console.log(mapObject);
        }
      })
      .catch((err) => console.log(err));
  }
  
  
  return (
    <Grommet>
      <Main pad="large">
        <Box align="center">
          <Heading>Demo Maps</Heading>
          {maps.map((m) => (
            <Card  height="small" width="small" background="light-1">
              <CardHeader pad="small">{m.name}</CardHeader>
              <CardBody pad="small">{m.description}</CardBody>
              <Link color='status-ok' />
              <Anchor key={m.id} href={`/maps/${m.id}`} label="See the map" color='status-ok'/>
            </Card>
          ))}
        </Box>
      </Main>
    </Grommet>
  )

}