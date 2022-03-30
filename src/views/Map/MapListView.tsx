import {
  Anchor, Box, Card, CardBody, CardHeader, Grommet, Heading, Main,
} from 'grommet';
import React, { useEffect, useState } from 'react';
import { getMaps } from '../../API';
import { MapObject } from './Map.types';

export default function MapListView() {
  const [maps, setMaps] = useState<Array<MapObject>>([]);

  useEffect(() => {
    getMaps().then((response) => {
      setMaps(response);
    }).catch((error) => console.log(JSON.stringify(error)));
  }, []);

  return (
    <Grommet>
      <Main pad="large">
        <Box align="center">
          <Heading>Demo Maps</Heading>
          {maps.map((m) => (
            <Card height="small" width="small" background="light-1">
              <CardHeader pad="small">{m.name}</CardHeader>
              <CardBody pad="small">{m.description}</CardBody>
              <Anchor key={m.id} href={`/maps/${m.id}`} label="See the map" color="status-ok" />
            </Card>
          ))}
        </Box>
      </Main>
    </Grommet>
  );
}
