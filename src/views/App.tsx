/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import {
  Grommet, Header, Heading, Main, Box, Text, WorldMap, Grid, Button,
} from 'grommet';
import StepLabel from '../components/StepLabel/StepLabel';

interface Workflow {
  steps: []
}

const CustomTheme = {
  global: {
    colors: {
      brand: '#3d9fa0',
    },
  },
};

function App() {
  const steps = ['Select map type', 'Load your data', 'Refine', 'Visualize'];
  const [currentStep, setCurrentStep] = useState(0);

  function advanceToNext() {
    setCurrentStep(currentStep + 1);
  }

  function revertToLast() {
    setCurrentStep(currentStep - 1);
  }

  function reset() {
    setCurrentStep(0);
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
                <Box height="large">
                  <Text>Step details</Text>
                </Box>
                <Box direction="row" justify="between">
                  <Button onClick={revertToLast} alignSelf="start" label="Back" />
                  <Box direction="row">
                    <Button onClick={reset} alignSelf="end" label="Cancel" margin={{ right: 'small' }} />
                    <Button onClick={advanceToNext} alignSelf="end" primary label="Continue" />
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box gridArea="main" pad="large">
              <WorldMap color="brand" />
            </Box>
          </Grid>
        </Box>
      </Main>
    </Grommet>
  );
}

export default App;
