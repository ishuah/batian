import {
  Box, Card, CardBody, CardHeader, Grommet, Heading, Main, Text,
} from 'grommet';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMap, getSites } from '../../API';
import ComposedMap from '../../components/ComposedMap';
import NotFound from '../NotFound';
import { LayerObject, MapObject } from './Map.types';

export default function MapView() {
  const params = useParams();
  const [map, setMap] = useState<MapObject>();
  const [layers, setLayers] = useState<Array<LayerObject>>([]);
  const [requestError, setRequestError] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return { width, height };
  }

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  function handleResize() {
    setWindowDimensions(getWindowDimensions());
  }

  useEffect(() => {
    const getLayerData = async (layer: LayerObject) => getSites(layer, 1000, 7)
      .then((response) => response);

    if (map) {
      map.layers.map((layer) => {
        /* eslint-disable no-param-reassign */
        layer.sites = [];
        return getLayerData(layer)
          .then((response) => {
            setLayers((array) => [...array, response]);
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
    /* eslint-disable no-unused-expressions */
    params.mapId && getMap(params.mapId).then((response) => {
      setMap(response);
    }).catch((error) => {
      setRequestError(error.response);
      setIsLoading(false);
    });

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Grommet>
      <Main>
        {requestError ? (<NotFound message={requestError.statusText} />) : (
          <Box height={{ max: `${windowDimensions.height}px` }}>
            { !isLoading && map && (
              <Card
                style={
                  { position: 'absolute', top: `${windowDimensions.height * 0.25}px`, left: `${windowDimensions.width * 0.05}px` }
                }
                height="small"
                width="medium"
                background="light-1"
                round="xsmall"
              >
                <CardHeader pad={{ vertical: 'small', horizontal: 'medium' }}>
                  <Heading level="3" margin="xxsmall">
                    {map && map.name}
                  </Heading>
                </CardHeader>
                <CardBody pad={{ vertical: 'small', horizontal: 'medium' }}><Text>{map && map.description}</Text></CardBody>
              </Card>
            )}
            <ComposedMap layers={layers} isLoading={isLoading} />
          </Box>
        )}
      </Main>
    </Grommet>
  );
}
