import {
  Box, Heading, TableBody, TableRow, TableCell,
  Select, Text, Notification, Table,
} from 'grommet';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { REGIONS } from '../constants';
import { recoilState } from '../store';

function MapRefineStep() {
  const [appState, setAppState] = useRecoilState<AppState>(recoilState);
  const columns = appState.userData.data.length > 0
    ? Object.keys(appState.userData.data[0]).map((header) => header) : [];

  useEffect(() => {
    if (!appState.dataKeys.name) return;
    fetch(REGIONS[appState.map.region])
      .then((response) => response.json())
      .then((geojson) => {
        const userDataRegions: string[] = appState
          .userData.data.map((row) => row[appState.dataKeys.name!]);
        const regions: string[] = geojson.features.map((x: any) => x.properties.name);
        const mismatchedRegions = userDataRegions.filter(
          (region) => !regions.includes(region),
        ) as [];
        setAppState({ ...appState, mismatchedRegions: mismatchedRegions.length });
      });
  }, [appState.dataKeys.name]);

  return (
    <Box height="large">
      <Box pad="medium">
        <Heading level="4">Time to refine your data</Heading>
        <Table>
          <TableBody>
            { appState.map.type === 'Symbol'
              ? (
                <>
                  <TableRow>
                    <TableCell scope="row">
                      <Text alignSelf="start" margin="small">Select column for latitude:</Text>
                    </TableCell>
                    <TableCell>
                      <Select
                        options={columns}
                        alignSelf="end"
                        value={appState.dataKeys.latitude}
                        onChange={({ option }) => {
                          setAppState({
                            ...appState,
                            dataKeys: { ...appState.dataKeys, latitude: option },
                          });
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
                        value={appState.dataKeys.longitude}
                        onChange={({ option }) => {
                          setAppState({
                            ...appState,
                            dataKeys: { ...appState.dataKeys, longitude: option },
                          });
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
                        value={appState.dataKeys.sizeValues}
                        onChange={
                          ({ option }) => {
                            setAppState({
                              ...appState,
                              dataKeys: { ...appState.dataKeys, sizeValues: option },
                            });
                          }
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
                        value={appState.dataKeys.colorValues}
                        onChange={
                          ({ option }) => {
                            setAppState({
                              ...appState,
                              dataKeys: { ...appState.dataKeys, colorValues: option },
                            });
                          }
                        }
                      />
                    </TableCell>
                  </TableRow>
                </>
              )
              : (
                <>
                  <TableRow>
                    <TableCell>
                      <Text alignSelf="start" margin="small">Select column for name:</Text>
                    </TableCell>
                    <TableCell>
                      <Select
                        options={columns}
                        value={appState.dataKeys.name}
                        alignSelf="end"
                        onChange={({ option }) => {
                          setAppState({
                            ...appState,
                            dataKeys: { ...appState.dataKeys, name: option },
                          });
                        }}
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
                        value={appState.dataKeys.values}
                        alignSelf="end"
                        onChange={({ option }) => {
                          setAppState({
                            ...appState,
                            dataKeys: { ...appState.dataKeys, values: option },
                          });
                        }}
                      />
                    </TableCell>
                  </TableRow>
                </>
              )}
          </TableBody>
        </Table>
        {appState.dataKeys.name
          && (
            <Box margin="small" pad="small">
              <Notification
                status={appState.mismatchedRegions > 0 ? 'warning' : 'normal'}
                title={appState.mismatchedRegions > 0 ? 'Data mismatch detected' : 'Data looks good!'}
                message={appState.mismatchedRegions > 0
                  ? `We couldn't match ${appState.mismatchedRegions} entries from your file,
                  your visualization might not be complete. To resolve this issue, please
                  make sure your data matches the country names for ${appState.map.region}`
                  : `All the entries in your map correspond to the set of countries for ${appState.map.region}`}
              />
            </Box>
          )}
      </Box>
    </Box>
  );
}

export default MapRefineStep;
