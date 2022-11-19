/* eslint-disable react/jsx-no-bind */
import {
  Box, Heading, Paragraph, FileInput,
} from 'grommet';
import Papa from 'papaparse';
import React from 'react';
import { useRecoilState } from 'recoil';
import { recoilState } from '../store';
import UserDataTable from './UserDataTable';

function DataInputStep() {
  const [appState, setAppState] = useRecoilState<AppState>(recoilState);
  const choroplethCopy = `Upload a CSV file containing a column that corresponds to the name of countries in ${appState.map.region}.`;
  const symbolCopy = ` Upload a CSV file containing the points you want to map.
  This file should contain a longitude and a latitude column.`;

  function onFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const fileList = event.target.files;
    if (fileList && fileList.length === 1) {
      const file = fileList[0];
      Papa.parse(file, {
        header: true,
        complete(results) {
          setAppState({ ...appState, userData: { data: results.data as [], ready: true } });
        },
      });
    }
  }

  return (
    <Box height="xlarge">
      <Box pad="medium">
        <Heading level="4">Time to add some data</Heading>
        <Paragraph margin={{ bottom: 'medium' }} fill>
          { appState.map.type === 'Symbol' ? symbolCopy : choroplethCopy }
        </Paragraph>

        <FileInput
          data-testid="file-input"
          name="file"
          accept=".csv"
          multiple={false}
          onChange={onFileUpload}
        />

        { appState.userData.ready && <UserDataTable /> }
      </Box>
    </Box>
  );
}

export default DataInputStep;
