import {
  Box, Heading, TextInput, RadioButtonGroup, Select,
} from 'grommet';
import React, { useCallback } from 'react';
import ReactGA from 'react-ga4';
import { useRecoilState } from 'recoil';
import { REGIONS } from '../constants';
import { recoilState } from '../store';

function MapDetailStep() {
  ReactGA.send({ hitType: 'pageview', page: 'MapDetailStep', title: 'Map Detail Step' });
  const [appState, setAppState] = useRecoilState<AppState>(recoilState);

  const setMapTitle = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setAppState({ ...appState, map: { ...appState.map, title: event.target.value } });
  }, [appState.map]);

  const setMapType = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setAppState({ ...appState, map: { ...appState.map, type: event.target.value } });
  }, [appState.map]);

  const setRegion = useCallback((event: any) => {
    setAppState({ ...appState, map: { ...appState.map, region: event.option } });
  }, [appState.map]);

  return (
    <Box height="large">
      <Box pad="medium">
        <Heading level="4">Map details</Heading>
        <TextInput
          placeholder="[Map title]"
          value={appState.map.title}
          onChange={setMapTitle}
          data-testid="map-title-input"
        />
        <Heading level="4">What type of map do you want to create?</Heading>
        <RadioButtonGroup
          name="mapType"
          options={['Choropleth', 'Symbol']}
          value={appState.map.type}
          onChange={setMapType}
          data-testid="map-type"
        />
      </Box>
      { appState.map.type && (
        <Box>
          <Heading level="4">Select map</Heading>
          <Select
            options={Object.keys(REGIONS)}
            value={appState.map.region}
            onChange={setRegion}
            data-testid="map-region"
          />
        </Box>
      )}
    </Box>
  );
}

export default MapDetailStep;
