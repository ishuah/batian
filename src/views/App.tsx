/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import Papa from 'papaparse';
import {
  Grommet, Header, Heading, Main, Box, Grid, Button, Select,
  RadioButtonGroup,
  Paragraph,
  FileInput,
  DataTable,
  TextInput,
} from 'grommet';
import StepLabel from '../components/StepLabel';
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
  const [mapTitle, setMapTitle] = useState('[Map title]');
  const [mapType, setMapType] = useState('');
  const [mapRegion, setMapRegion] = useState('Africa');
  const steps = ['Map details', 'Load your data', 'Refine', 'Visualize'];
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({ data: [], ready: false });

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
  }

  function revertToLast() {
    setCurrentStep(currentStep - 1);
  }

  function reset() {
    setCurrentStep(0);
    setMapType('');
  }

  function parseCSV(file: File) {
    Papa.parse(file, {
      header: true,
      complete(results) {
        setUserData({ data: results.data as [], ready: true });
      },
    });
  }

  function onFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const fileList = event.target.files;
    if (fileList && fileList.length === 1) {
      const file = fileList[0];
      parseCSV(file);
    }
  }

  function renderDataTable() {
    const columns = Object.keys(userData.data[0]).map((header) => ({ property: header, header }));

    return (
      <DataTable
        data-testid="data-table"
        size="small"
        margin={{ top: 'large' }}
        background="white"
        border
        columns={columns}
        data={userData.data}
      />
    );
  }

  function renderMapDetailsStep() {
    return (
      <Box height="large">
        <Box pad="medium">
          <Heading level="4">Map details</Heading>
          <TextInput
            placeholder="[Map title]"
            value={mapTitle}
            onChange={(event) => setMapTitle(event.target.value)}
          />
          <Heading level="4">What type of map do you want to create?</Heading>
          <RadioButtonGroup
            name="mapType"
            options={['Choropleth', 'Symbol']}
            value={mapType}
            onChange={(event) => {
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
    );
  }

  function renderChoroplethMapDataInputForm() {
    return (
      <Box height="large">
        <Box pad="medium">
          <Heading level="4">Time to add some data</Heading>
          <Paragraph margin="none">
            Upload a CSV file with the following structure:
          </Paragraph>
          <Paragraph margin="small">
            NAME, VALUE
          </Paragraph>
          <FileInput
            data-testid="choropleth-file-input"
            name="file"
            accept=".csv"
            multiple={false}
            onChange={onFileUpload}
          />
          { userData.ready && renderDataTable() }
        </Box>
      </Box>
    );
  }

  function renderSymbolMapDataInputForm() {
    return (
      <Box height="large">
        <Box pad="medium">
          <Heading level="4">Time to add some data</Heading>
          <Paragraph margin="none">
            Upload a CSV file with the following structure:
          </Paragraph>
          <Paragraph margin="small">
            TITLE, LATITUDE, LONGITUDE, VALUE
          </Paragraph>
          <FileInput
            data-testid="symbol-file-input"
            name="file"
            accept=".csv"
            multiple={false}
            onChange={onFileUpload}
          />
          { userData.ready && renderDataTable() }
        </Box>
      </Box>
    );
  }

  function renderDataStep() {
    if (mapType === 'Symbol') return renderSymbolMapDataInputForm();

    return renderChoroplethMapDataInputForm();
  }

  function toggleContinue() {
    if (currentStep === 0) return mapType === '';
    if (currentStep === 1) return !userData.ready;

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
                { currentStep === 0 && renderMapDetailsStep() }
                { currentStep === 1 && renderDataStep() }

                <Box direction="row" justify="between">
                  <Button onClick={revertToLast} alignSelf="start" label="Back" disabled={currentStep === 0} />
                  <Box direction="row">
                    <Button onClick={reset} alignSelf="end" label="Cancel" margin={{ right: 'small' }} />
                    <Button onClick={advanceToNext} alignSelf="end" primary label="Continue" disabled={toggleContinue()} />
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box gridArea="main" height="large">
              <Box background="white" border={{ color: 'light-5', size: 'xsmall' }}>
                <Heading level="3" margin="medium">{mapTitle}</Heading>
                <RenderMap url={mapRegions[mapRegion]} mapType={mapType} userData={userData} />
              </Box>
            </Box>
          </Grid>
        </Box>
      </Main>
    </Grommet>
  );
}

export default App;
