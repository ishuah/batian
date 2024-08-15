/* eslint-disable react/jsx-no-bind */
import {
  Box, Heading, Paragraph, FileInput, Notification,
} from 'grommet';
import Papa from 'papaparse';
import React, { useCallback } from 'react';
import ReactGA from 'react-ga4';
import { useRecoilState } from 'recoil';
import { recoilState } from '../store';

function DataInputStep() {
  ReactGA.send({ hitType: "pageview", page: "DataInputStep", title: "Data Input Step" });
  const [appState, setAppState] = useRecoilState<AppState>(recoilState);
  const choroplethCopy = `Upload a CSV file containing a column that corresponds to the name of countries in ${appState.map.region}.`;
  const symbolCopy = ` Upload a CSV file containing the points you want to map.
  This file should contain a longitude and a latitude column.`;

  const onFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length === 1) {
      const file = fileList[0];
      if (file.type !== 'text/csv') {
        setAppState({ ...appState, userData: { ...appState.userData, errors: [`${file.type} is not supported.`] } });
        return;
      }

      Papa.parse(file, {
        header: true,
        complete(results) {
          if (results.data.length === 0) {
            setAppState({ ...appState, userData: { ...appState.userData, errors: [`We couldn't load any data from ${file.name}.`] } });
            return;
          }

          setAppState({
            ...appState,
            userData: {
              data: results.data as [],
              errors: results.errors.map((error) => error.message),
              ready: true,
            },
          });
        },
      });
    }
  }, [appState]);

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
        { appState.userData.errors.length > 0
          && (
            <Box margin="small" pad="small">
              <Notification
                status="critical"
                title="Data error"
                message={appState.userData.errors.toString()}
              />
            </Box>
          ) }
      </Box>
    </Box>
  );
}

export default DataInputStep;
