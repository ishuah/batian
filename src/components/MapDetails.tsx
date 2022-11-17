import {
  Box, Heading, TextInput, RadioButtonGroup, Select,
} from 'grommet';
import React from 'react';
import { useRecoilState } from 'recoil';
import { REGIONS } from '../constants';
import { recoilState } from '../store';

function MapDetails() {
  const [appState, setAppState] = useRecoilState<AppState>(recoilState);

  function setMapTitle(title: string) {
    setAppState({ ...appState, map: { ...appState.map, title } });
  }

  function setMapType(mapType: string) {
    setAppState({ ...appState, map: { ...appState.map, type: mapType } });
  }

  function setRegion(region: string) {
    setAppState({ ...appState, map: { ...appState.map, region } });
  }

  return (
    <Box height="large">
      <Box pad="medium">
        <Heading level="4">Map details</Heading>
        <TextInput
          placeholder="[Map title]"
          value={appState.map.title}
          onChange={(event) => setMapTitle(event.target.value)}
          data-testid="map-title-input"
        />
        <Heading level="4">What type of map do you want to create?</Heading>
        <RadioButtonGroup
          name="mapType"
          options={['Choropleth', 'Symbol']}
          value={appState.map.type}
          onChange={(event) => {
            setMapType(event.target.value);
          }}
          data-testid="map-type"
        />
      </Box>
      { appState.map.type && (
        <Box>
          <Heading level="4">Select map</Heading>
          <Select
            options={Object.keys(REGIONS)}
            value={appState.map.region}
            onChange={({ option }) => setRegion(option)}
            data-testid="map-region"
          />
        </Box>
      )}
    </Box>
  );
}

export default MapDetails;
