import {
  Box, Heading, TableBody, TableRow,
  TableCell, Text, Select, Table,
} from 'grommet';
import React, { useCallback } from 'react';
import ReactGA from 'react-ga4';
import { useRecoilState } from 'recoil';
import {
  CHOROPLETH_COLORS,
  INTERPOLATION_TYPE,
  SYMBOLS,
  SYMBOL_PALETTE,
} from '../constants';
import { recoilState } from '../store';

function VisualizeStep() {
  ReactGA.send({ hitType: "pageview", page: "VisualizeStep", title: "Visualize Step" });
  const [appState, setAppState] = useRecoilState<AppState>(recoilState);

  const setSymbolShape = useCallback((event: any) => {
    setAppState({ ...appState, symbolShape: event.option });
  }, [appState]);

  const setSymbolColor = useCallback((event: any) => {
    setAppState({ ...appState, symbolColorScheme: event.option });
  }, [appState]);

  const setChoroplethColorScheme = useCallback((event: any) => {
    setAppState({ ...appState, choroplethColorScheme: event.option });
  }, [appState]);

  const setInterpolationType = useCallback((event: any) => {
    setAppState({ ...appState, interpolationType: event.option });
  }, [appState]);
  return (
    <Box height="large">
      <Box pad="medium">
        <Heading level={3}>Visualize</Heading>
        <Table>
          <TableBody>
            { appState.map.type === 'Symbol'
              ? (
                <>
                  <TableRow>
                    <TableCell>
                      <Text margin="small">Symbol shape:</Text>
                    </TableCell>
                    <TableCell>
                      <Select
                        options={SYMBOLS}
                        value={appState.symbolShape}
                        onChange={setSymbolShape}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Text margin="small">Select palette:</Text>
                    </TableCell>
                    <TableCell>
                      <Select
                        options={Object.keys(SYMBOL_PALETTE)}
                        value={appState.symbolColorScheme}
                        onChange={setSymbolColor}
                      />
                    </TableCell>
                  </TableRow>
                </>
              )
              : (
                <>
                  <TableRow>
                    <TableCell>
                      <Text margin="small">Select palette:</Text>
                    </TableCell>
                    <TableCell>
                      <Select
                        options={CHOROPLETH_COLORS}
                        value={appState.choroplethColorScheme}
                        onChange={setChoroplethColorScheme}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Text margin="small">Interpolation:</Text>
                    </TableCell>
                    <TableCell>
                      <Select
                        options={INTERPOLATION_TYPE}
                        value={appState.interpolationType}
                        onChange={setInterpolationType}
                      />
                    </TableCell>
                  </TableRow>
                </>
              )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}

export default VisualizeStep;
