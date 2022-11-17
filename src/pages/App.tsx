/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import {
  Box, Button,
  Grid, Grommet, Header, Heading, Main,
  Select, TableBody, TableCell,
  TableRow, Text,
} from 'grommet';
import { useRecoilState } from 'recoil';

import DataInput from '../components/DataInput';
import MapDetails from '../components/MapDetails';
import RenderMap from '../components/RenderMap';
import StepLabel from '../components/StepLabel';
import { CHOROPLETH_COLORS, STEPS } from '../constants';
import { recoilState } from '../store';
import MapRefine from '../components/MapRefine';

const CustomTheme = {
  global: {
    colors: {
      brand: '#3d9fa0',
    },
  },
};

function App() {
  const [choroplethColorScheme, setChoroplethColorScheme] = useState('Reds');
  const [symbolColorScheme, setSymbolColorScheme] = useState('Red');
  const [symbolShape, setSymbolShape] = useState('Circle');

  const [appState, setAppState] = useRecoilState<AppState>(recoilState);

  const symbolColorOptions: string[] = ['Red', 'Blue', 'Green', 'Orange'];
  const symbolShapeOptions: string[] = ['Circle', 'Square', 'Triangle', 'Diamond'];

  function advanceToNext() {
    const currentStep = appState.currentStep + 1;
    setAppState({ ...appState, currentStep });
  }

  function revertToLast() {
    const currentStep = appState.currentStep - 1;
    setAppState({ ...appState, currentStep });
  }

  function reset() {
    setAppState({
      map: { title: '', type: '', region: 'Africa' },
      userData: { data: [], ready: false },
      currentStep: 0,
      dataKeys: {},
      mismatchedRegions: 0,
      choroplethColorScheme: 'Reds',
      symbolColorScheme: 'Red',
      symbolShape: 'Circle',
    });

    setChoroplethColorScheme('Reds');
    setSymbolColorScheme('Red');
    setSymbolShape('Circle');
  }

  function renderSymbolVisualizeStep() {
    return (
      <Box height="large">
        <Box pad="medium">
          <Heading level={3}>Colors</Heading>
          <TableBody>
            <TableRow>
              <TableCell>
                <Text margin="small">Select symbol shape:</Text>
              </TableCell>
              <TableCell>
                <Select
                  options={symbolShapeOptions}
                  value={symbolShape}
                  onChange={({ option }) => setSymbolShape(option)}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Text margin="small">Select color:</Text>
              </TableCell>
              <TableCell>
                <Select
                  options={symbolColorOptions}
                  value={symbolColorScheme}
                  onChange={({ option }) => setSymbolColorScheme(option)}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Box>
      </Box>
    );
  }

  function renderChoroplethVisualizeStep() {
    return (
      <Box height="large">
        <Box pad="medium">
          <Heading level={3}>Colors</Heading>
          <TableBody>
            <TableRow>
              <TableCell>
                <Text margin="small">Select palette:</Text>
              </TableCell>
              <TableCell>
                <Select
                  options={CHOROPLETH_COLORS}
                  value={choroplethColorScheme}
                  onChange={({ option }) => setChoroplethColorScheme(option)}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Box>
      </Box>
    );
  }

  function renderVisualizeStep() {
    if (appState.map.type === 'Symbol') return renderSymbolVisualizeStep();

    return renderChoroplethVisualizeStep();
  }

  function toggleContinue() {
    if (appState.currentStep === 0) return appState.map.type === '';
    if (appState.currentStep === 1) return !appState.userData.ready;
    if (appState.currentStep === 2) {
      if (appState.map.type === 'Symbol') return !appState.dataKeys.latitude || !appState.dataKeys.longitude || !appState.dataKeys.sizeValues;

      return !appState.dataKeys.name || !appState.dataKeys.values;
    }

    return true;
  }

  return (
    <Grommet theme={CustomTheme}>
      <Main fill="vertical" pad="none">
        <Header background="white" pad="xxsmall">
          <Heading level="4" margin={{ vertical: 'small', horizontal: 'small' }}>Batian</Heading>
        </Header>
        <Box pad="large" align="center">
          <Grid
            rows={['large']}
            columns={['large', 'large']}
            gap="small"
            areas={[
              { name: 'nav', start: [0, 0], end: [0, 0] },
              { name: 'main', start: [1, 0], end: [1, 0] },
            ]}
          >
            <Box gridArea="nav">
              <Box direction="row" pad="medium">
                {
                  STEPS
                    .map((step, i) => (
                      <StepLabel
                        key={i}
                        active={i === appState.currentStep}
                        completed={i < appState.currentStep}
                        text={step}
                        step={i + 1}
                      />
                    ))
                }
              </Box>
              <Box pad="medium">
                { appState.currentStep === 0 && (<MapDetails />) }
                { appState.currentStep === 1 && (<DataInput />) }
                { appState.currentStep === 2 && (<MapRefine />) }
                { appState.currentStep === 3 && renderVisualizeStep() }

                <Box direction="row" justify="between">
                  <Button onClick={revertToLast} alignSelf="start" label="Back" disabled={appState.currentStep === 0} />
                  <Box direction="row">
                    <Button onClick={reset} alignSelf="end" label="Cancel" margin={{ right: 'small' }} />
                    <Button onClick={advanceToNext} alignSelf="end" primary label="Continue" disabled={toggleContinue()} />
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box gridArea="main" height="large">
              <Box background="white" border={{ color: 'light-5', size: 'xsmall' }}>
                <Heading level="3" margin="medium">{ appState.map.title || '[Map Title]'}</Heading>
                <RenderMap
                  choroplethColorScheme={choroplethColorScheme}
                  symbolColorScheme={symbolColorScheme}
                  shape={symbolShape}
                />
              </Box>
            </Box>
          </Grid>
        </Box>
      </Main>
    </Grommet>
  );
}

export default App;
