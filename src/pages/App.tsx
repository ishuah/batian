/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import Papa from 'papaparse';
import {
  Grommet, Header, Heading, Main, Box, Grid, Button, Select,
  Paragraph,
  FileInput,
  DataTable,
  Text,
  Card,
  CardBody,
  TableCell,
  TableRow,
  TableBody,
} from 'grommet';

import StepLabel from '../components/StepLabel';
import RenderMap from '../components/RenderMap';
import MapDetails from '../components/MapDetails';
import { recoilState } from '../store';

const CustomTheme = {
  global: {
    colors: {
      brand: '#3d9fa0',
    },
  },
};

function App() {
  const [mapRegion, setMapRegion] = useState('Africa');
  const steps = ['Map details', 'Load your data', 'Refine', 'Visualize'];
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({ data: [], ready: false });
  const [choroplethDataKeys, setChoroplethDataKeys] = useState<ChoroplethDataKeys>({ name: '', values: '' });
  const [symbolDataKeys, setSymbolDataKeys] = useState<SymbolDataKeys>({
    latitude: '', longitude: '', sizeValues: '', colorValues: '',
  });
  const [mismatchedRegionsCount, setMismatchedRegionsCount] = useState(0);
  const [choroplethColorScheme, setChoroplethColorScheme] = useState('Reds');
  const [symbolColorScheme, setSymbolColorScheme] = useState('Red');
  const [symbolShape, setSymbolShape] = useState('Circle');

  const appState = useRecoilValue<AppState>(recoilState);

  const mapRegions: Regions = {
    Africa: `${process.env.PUBLIC_URL}/geojson/africa.geojson`,
    Asia: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/asia.geojson',
    Australia: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/australia.geojson',
    Europe: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/europe.geojson',
    'North America': 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/north-america.geojson',
    'South America': 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/south-america.geojson',
    'South East Asia': 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/southeast-asia.geojson',
  };

  const choroplethColorOptions: string[] = ['Reds', 'Blues', 'Greens', 'Cool', 'Warm', 'Spectral'];
  const symbolColorOptions: string[] = ['Red', 'Blue', 'Green', 'Orange'];
  const symbolShapeOptions: string[] = ['Circle', 'Square', 'Triangle', 'Diamond'];

  useEffect(() => {
    if (!choroplethDataKeys.name) return;
    fetch(mapRegions[mapRegion])
      .then((response) => response.json())
      .then((geojson) => {
        const userDataRegions: string[] = userData.data.map((row) => row[choroplethDataKeys.name]);
        const regions: string[] = geojson.features.map((x: any) => x.properties.name);
        const mismatchedRegions = userDataRegions.filter(
          (region) => !regions.includes(region),
        ) as [];
        setMismatchedRegionsCount(mismatchedRegions.length);
      });
  }, [choroplethDataKeys.name]);

  function advanceToNext() {
    setCurrentStep(currentStep + 1);
  }

  function revertToLast() {
    setCurrentStep(currentStep - 1);
  }

  function reset() {
    setCurrentStep(0);
    setUserData({ data: [], ready: false });
    setChoroplethDataKeys({ name: '', values: '' });
    setSymbolDataKeys({
      latitude: '', longitude: '', sizeValues: '', colorValues: '',
    });
    setChoroplethColorScheme('Reds');
    setSymbolColorScheme('Red');
    setSymbolShape('Circle');
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

  function renderChoroplethMapDataInputForm() {
    return (
      <Box height="xlarge">
        <Box pad="medium">
          <Heading level="4">Time to add some data</Heading>
          <Paragraph margin={{ bottom: 'medium' }} fill>
            Upload a CSV file containing a column that corresponds to the name of countries in&nbsp;
            {mapRegion}
            .
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
          <Paragraph margin={{ bottom: 'medium' }} fill>
            Upload a CSV file containing the points you want to map.&nbsp;
            This file should contain a longitude and a latitude column.
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
    if (appState.map.type === 'Symbol') return renderSymbolMapDataInputForm();

    return renderChoroplethMapDataInputForm();
  }

  function renderSymbolMapRefineInputForm() {
    const columns = Object.keys(userData.data[0]).map((header) => header);
    return (
      <Box height="large">
        <Box pad="medium">
          <Heading level="4">Time to refine your data</Heading>
          <TableBody>
            <TableRow>
              <TableCell scope="row">
                <Text alignSelf="start" margin="small">Select column for latitude:</Text>
              </TableCell>
              <TableCell>
                <Select
                  options={columns}
                  alignSelf="end"
                  value={symbolDataKeys.latitude}
                  onChange={({ option }) => {
                    setSymbolDataKeys({ ...symbolDataKeys, latitude: option });
                  }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Text alignSelf="start" margin="small">Select column for longitude:</Text>
              </TableCell>
              <TableCell>
                <Select
                  options={columns}
                  alignSelf="end"
                  value={symbolDataKeys.longitude}
                  onChange={({ option }) => {
                    setSymbolDataKeys({ ...symbolDataKeys, longitude: option });
                  }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Text alignSelf="start" margin="small">Select column for size:</Text>
              </TableCell>
              <TableCell>
                <Select
                  options={columns}
                  alignSelf="end"
                  value={symbolDataKeys.sizeValues}
                  onChange={
                    ({ option }) => setSymbolDataKeys({ ...symbolDataKeys, sizeValues: option })
                  }
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Text alignSelf="start" margin="small">Select column for color (optional):</Text>
              </TableCell>
              <TableCell>
                <Select
                  options={columns}
                  alignSelf="end"
                  value={symbolDataKeys.colorValues}
                  onChange={
                    ({ option }) => setSymbolDataKeys({ ...symbolDataKeys, colorValues: option })
                  }
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Box>
      </Box>
    );
  }

  function renderChoroplethMapRefineInputForm() {
    const columns = Object.keys(userData.data[0]).map((header) => header);
    return (
      <Box height="large">
        <Box pad="medium">
          <Heading level="4">Time to refine your data</Heading>
          <TableBody>
            <TableRow>
              <TableCell>
                <Text alignSelf="start" margin="small">Select column for name:</Text>
              </TableCell>
              <TableCell>
                <Select
                  options={columns}
                  value={choroplethDataKeys.name}
                  alignSelf="end"
                  onChange={({ option }) => setChoroplethDataKeys({
                    ...choroplethDataKeys, name: option,
                  })}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Text alignSelf="start" margin="small">Select column for value:</Text>
              </TableCell>
              <TableCell>
                <Select
                  options={columns}
                  value={choroplethDataKeys.values}
                  alignSelf="end"
                  onChange={({ option }) => setChoroplethDataKeys({
                    ...choroplethDataKeys, values: option,
                  })}
                />
              </TableCell>
            </TableRow>
          </TableBody>

          {choroplethDataKeys.name
          && (
            <Card margin="small" pad="small" height="small" width="large" background="white">
              <CardBody pad="xsmall" width="large">
                { (mismatchedRegionsCount > 0)
                  ? (
                    <Paragraph margin="none">
                      We couldn&#39;t match&nbsp;
                      {mismatchedRegionsCount}
                      &nbsp;entries from your file,
                      &nbsp;your visualization might not be complete.
                      To resolve this issue, please make sure your data
                      &nbsp;matches the country names for&nbsp;
                      {mapRegion}
                      .&nbsp;
                    </Paragraph>
                  )
                  : (
                    <Paragraph margin="none">
                      Data looks good! All the entries in your map correspond to the set&nbsp;
                      of country names for&nbsp;
                      {mapRegion}
                      .&nbsp;
                    </Paragraph>
                  )}
                {}
              </CardBody>
            </Card>
          )}
        </Box>
      </Box>
    );
  }

  function renderRefineStep() {
    if (appState.map.type === 'Symbol') return renderSymbolMapRefineInputForm();

    return renderChoroplethMapRefineInputForm();
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
                  options={choroplethColorOptions}
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
    if (currentStep === 0) return appState.map.type === '';
    if (currentStep === 1) return !userData.ready;
    if (currentStep === 2) {
      if (appState.map.type === 'Symbol') return !symbolDataKeys.latitude || !symbolDataKeys.longitude || !symbolDataKeys.sizeValues;

      return !choroplethDataKeys.name || !choroplethDataKeys.values;
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
                { currentStep === 0 && (<MapDetails />) }
                { currentStep === 1 && renderDataStep() }
                { currentStep === 2 && renderRefineStep() }
                { currentStep === 3 && renderVisualizeStep() }

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
                <Heading level="3" margin="medium">{ appState.map.title || '[Map Title]'}</Heading>
                <RenderMap
                  userData={userData}
                  dataKeys={appState.map.type && appState.map.type === 'Symbol' ? symbolDataKeys : choroplethDataKeys}
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
