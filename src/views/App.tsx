/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import {
  Grommet, Header, Heading, Main, Box, Grid, Button, Select,
  RadioButtonGroup,
} from 'grommet';
import StepLabel from '../components/StepLabel/StepLabel';
import RenderMap from '../components/RenderMap';

const CustomTheme = {
  global: {
    colors: {
      brand: '#3d9fa0',
    },
  },
};

type MapRegions = {
  [key: string]: string
}

function App() {
  const [mapType, setMapType] = useState('');
  const [mapRegion, setMapRegion] = useState('Africa');
  const [toggleContinue, setToggleContinue] = useState(true);
  const steps = ['Map details', 'Load your data', 'Refine', 'Visualize'];
  const [currentStep, setCurrentStep] = useState(0);

  const mapRegions: MapRegions = {
    Africa: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/africa.geojson',
    Asia: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/asia.geojson',
    Australia: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/australia.geojson',
    Europe: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/europe.geojson',
    'North America': 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/north-america.geojson',
    'South America': 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/south-america.geojson',
    'South East Asia': 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/southeast-asia.geojson',
  };

  function advanceToNext() {
    setCurrentStep(currentStep + 1);
    setToggleContinue(true);
  }

  function revertToLast() {
    setCurrentStep(currentStep - 1);
    setToggleContinue(false);
  }

  function reset() {
    setCurrentStep(0);
    setToggleContinue(true);
    setMapType('');
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
            <Box gridArea="nav" background="white">
              <Box direction="row" pad="medium">
                {
                  steps
                    .map((step, i) => (
                      <StepLabel
                        key={i}
                        active={i === currentStep}
                        completed={i < currentStep}
                        text={step}
                        step={i + 1}
                      />
                    ))
                }
              </Box>
              <Box pad="medium">
                { currentStep === 0
                && (
                  <Box height="large">
                    <Box pad="medium">
                      <Heading level="4">What type of map do you want to create?</Heading>
                      <RadioButtonGroup
                        name="mapType"
                        options={['Choropleth', 'Symbol']}
                        value={mapType}
                        onChange={(event) => {
                          setToggleContinue(false);
                          setMapType(event.target.value);
                        }}
                      />
                    </Box>
                    { mapType && (
                      <Box>
                        <Heading level="4">Select map</Heading>
                        <Select
                          options={Object.keys(mapRegions)}
                          value={mapRegion}
                          onChange={({ option }) => setMapRegion(option)}
                        />
                      </Box>
                    )}
                  </Box>
                )}

                <Box direction="row" justify="between">
                  <Button onClick={revertToLast} alignSelf="start" label="Back" />
                  <Box direction="row">
                    <Button onClick={reset} alignSelf="end" label="Cancel" margin={{ right: 'small' }} />
                    <Button onClick={advanceToNext} alignSelf="end" primary label="Continue" disabled={toggleContinue} />
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box gridArea="main">
              <RenderMap url={mapRegions[mapRegion]} />
            </Box>
          </Grid>
        </Box>
      </Main>
    </Grommet>
  );
}

export default App;
