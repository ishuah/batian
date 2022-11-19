/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import {
  Box, Button,
  Grid, Grommet, Header, Heading, Main,
} from 'grommet';
import { useRecoilState } from 'recoil';

import DataInputStep from '../components/DataInputStep';
import MapDetailStep from '../components/MapDetailStep';
import RenderMap from '../components/RenderMap';
import StepLabel from '../components/StepLabel';
import { STEPS } from '../constants';
import { recoilState } from '../store';
import MapRefineStep from '../components/MapRefineStep';
import VisualizeStep from '../components/VisualizeStep';

const CustomTheme = {
  global: {
    colors: {
      brand: '#3d9fa0',
    },
  },
};

function App() {
  const [appState, setAppState] = useRecoilState<AppState>(recoilState);

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
                { appState.currentStep === 0 && (<MapDetailStep />) }
                { appState.currentStep === 1 && (<DataInputStep />) }
                { appState.currentStep === 2 && (<MapRefineStep />) }
                { appState.currentStep === 3 && (<VisualizeStep />) }

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
                <RenderMap />
              </Box>
            </Box>
          </Grid>
        </Box>
      </Main>
    </Grommet>
  );
}

export default App;
