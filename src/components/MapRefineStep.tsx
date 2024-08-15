import {
  Box, Heading, TableBody, TableRow, TableCell,
  Select, Text, Notification, Table,
} from 'grommet';
import React, { useCallback, useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useRecoilState } from 'recoil';
import { REGIONS } from '../constants';
import { recoilState } from '../store';

function MapRefineStep() {
  ReactGA.send({ hitType: 'pageview', page: 'MapRefineStep', title: 'Map Refine Step' });
  const [appState, setAppState] = useRecoilState<AppState>(recoilState);
  const columns = appState.userData.data.length > 0
    ? Object.keys(appState.userData.data[0]).map((header) => header) : [];

  const setLatitude = useCallback((event: any) => {
    setAppState({
      ...appState,
      dataKeys: { ...appState.dataKeys, latitude: event.option },
    });
  }, [appState]);

  const setLongitude = useCallback((event: any) => {
    setAppState({
      ...appState,
      dataKeys: { ...appState.dataKeys, longitude: event.option },
    });
  }, [appState]);

  const setSizeValues = useCallback((event: any) => {
    setAppState({
      ...appState,
      dataKeys: { ...appState.dataKeys, sizeValues: event.option },
    });
  }, [appState]);

  const setColorValues = useCallback((event: any) => {
    setAppState({
      ...appState,
      dataKeys: { ...appState.dataKeys, colorValues: event.option },
    });
  }, [appState.dataKeys]);

  const setNameKey = useCallback((event: any) => {
    setAppState({
      ...appState,
      dataKeys: { ...appState.dataKeys, name: event.option },
    });
  }, [appState]);

  const setValueKey = useCallback((event: any) => {
    setAppState({
      ...appState,
      dataKeys: { ...appState.dataKeys, values: event.option },
    });
  }, [appState]);

  useEffect(() => {
    if (!appState.dataKeys.name) return;
    fetch(REGIONS[appState.map.region])
      .then((response) => response.json())
      .then((geojson) => {
        const userDataRegions: string[] = appState
          .userData.data.map((row) => row[appState.dataKeys.name!]);
        const regions: string[] = geojson.features.map((x: any) => x.properties.admin);
        const mismatchedRegions = userDataRegions.filter(
          (region) => !regions.includes(region),
        ) as [];
        const regionSuggestions = regions.filter(
          (region) => !userDataRegions.includes(region),
        );

        setAppState({ ...appState, mismatchedRegions, regionSuggestions });
      });
  }, [appState.dataKeys.name, appState.userData.data]);

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
                        onChange={setLatitude}
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
                        onChange={setLongitude}
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
                        onChange={setSizeValues}
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
                        onChange={setColorValues}
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
                        onChange={setNameKey}
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
                        onChange={setValueKey}
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
                status={appState.mismatchedRegions.length > 0 ? 'warning' : 'normal'}
                title={appState.mismatchedRegions.length > 0 ? 'Data mismatch detected' : 'Data looks good!'}
                message={appState.mismatchedRegions.length > 0
                  ? `We couldn't match ${appState.mismatchedRegions.length} entries from your file,
                  your visualization might not be complete. You can edit the values in red to match countries in ${appState.map.region}`
                  : `All the entries in your map correspond to the set of countries for ${appState.map.region}`}
              />
            </Box>
          )}
      </Box>
    </Box>
  );
}

export default MapRefineStep;
