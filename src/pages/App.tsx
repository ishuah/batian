/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-array-index-key */
import React, { useCallback } from 'react';
import {
  Box, Button,
  Grid, Grommet, Header, Heading, Main, Image,
} from 'grommet';
import { useRecoilState } from 'recoil';
import * as d3 from 'd3';

import DataInputStep from '../components/DataInputStep';
import MapDetailStep from '../components/MapDetailStep';
import RenderMap from '../components/RenderMap';
import StepLabel from '../components/StepLabel';
import { STEPS } from '../constants';
import { recoilState } from '../store';
import MapRefineStep from '../components/MapRefineStep';
import VisualizeStep from '../components/VisualizeStep';
import UserDataTable from '../components/UserDataTable';
import DownloadStep from '../components/DownloadStep';

const CustomTheme = {
  global: {
    colors: {
      brand: '#236A87',
      background: '#FFF8EF',
    },
  },
};

function App() {
  const [appState, setAppState] = useRecoilState<AppState>(recoilState);

  const advanceToNext = useCallback(() => {
    const currentStep = appState.currentStep + 1;
    setAppState({ ...appState, currentStep });
  }, [appState]);

  const revertToLast = useCallback(() => {
    const currentStep = appState.currentStep - 1;
    setAppState({ ...appState, currentStep });
  }, [appState]);

  const reset = useCallback(() => {
    setAppState({
      map: { title: '', type: '', region: 'Africa' },
      userData: { data: [], errors: [], ready: false },
      currentStep: 0,
      dataKeys: {},
      mismatchedRegions: [],
      regionSuggestions: [],
      choroplethColorScheme: 'Reds',
      symbolColorScheme: 'Red',
      symbolShape: 'Circle',
    });
  }, [appState]);

  function toggleContinue() {
    if (appState.currentStep === 0) return appState.map.type === '';
    if (appState.currentStep === 1) return !appState.userData.ready;
    if (appState.currentStep === 2) {
      if (appState.map.type === 'Symbol') return !appState.dataKeys.latitude || !appState.dataKeys.longitude || !appState.dataKeys.sizeValues;

      return !appState.dataKeys.name || !appState.dataKeys.values;
    }
    if (appState.currentStep === 3) {
      if (appState.map.type === 'Symbol') return !appState.symbolColorScheme || !appState.symbolShape;
      return !appState.choroplethColorScheme;
    }

    return true;
  }

  // eslint-disable-next-line
  const onUpdateRow = useCallback((updatedRow: any, index: number) => {
    const data = [
      ...appState.userData.data.slice(0, index),
      updatedRow,
      ...appState.userData.data.slice(index + 1),
    ];
    setAppState({
      ...appState,
      userData: {
        ...appState.userData,
        data: data as [],
      },
    });
  }, [appState]);

  const onDeleteRow = useCallback((index: number) => {
    const data = [
      ...appState.userData.data.slice(0, index),
      ...appState.userData.data.slice(index + 1),
    ];
    setAppState({
      ...appState,
      userData: {
        ...appState.userData,
        data: data as [],
      },
    });
  }, [appState]);

  function focusArea() {
    if (appState.userData.ready && (appState.currentStep === 1 || appState.currentStep === 2)) {
      return (
        <UserDataTable
          data={appState.userData.data}
          onUpdateRow={onUpdateRow}
          onDeleteRow={onDeleteRow}
          mismatchedRegions={appState.mismatchedRegions}
          regionSuggestions={appState.regionSuggestions}
        />
      );
    }

    return (
      <Box background="white" border={{ color: 'light-5', size: 'xsmall' }}>
        <Heading level="3" margin="medium">{ appState.map.title || '[Map Title]'}</Heading>
        <RenderMap />
      </Box>
    );
  }

  return (
    <Grommet theme={CustomTheme}>
      <Main pad="medium">
        <Header pad="none" align="center">
          <Image
            width={75}
            height={75}
            src={`${process.env.PUBLIC_URL}/img/batian-logo.png`}
          />
        </Header>
        <Box pad="medium" align="center">
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
                        key={step}
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
                { appState.currentStep === 4 && (<DownloadStep />)}

                <Box direction="row" justify="between">
                  <Button onClick={revertToLast} alignSelf="start" label="Back" disabled={appState.currentStep === 0} />
                  <Box direction="row">
                    <Button onClick={reset} alignSelf="end" label="Cancel" margin={{ right: 'small' }} />
                    <Button onClick={advanceToNext} alignSelf="end" primary label="Continue" disabled={toggleContinue()} />
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box gridArea="main" height="large" overflow="auto">
              {focusArea()}
            </Box>
          </Grid>
        </Box>
      </Main>
    </Grommet>
  );
}

export default App;
