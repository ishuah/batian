import {
  Box, Heading, TableBody, TableRow,
  TableCell, Text, Select,
} from 'grommet';
import React from 'react';
import { useRecoilState } from 'recoil';
import { CHOROPLETH_COLORS, SYMBOLS, SYMBOL_COLORS } from '../constants';
import { recoilState } from '../store';

function VisualizeStep() {
  const [appState, setAppState] = useRecoilState<AppState>(recoilState);

  return (
    <Box height="large">
      <Box pad="medium">
        <Heading level={3}>Visualize</Heading>
        <TableBody>
          { appState.map.type === 'Symbol'
            ? (
              <>
                <TableRow>
                  <TableCell>
                    <Text margin="small">Select symbol shape:</Text>
                  </TableCell>
                  <TableCell>
                    <Select
                      options={SYMBOLS}
                      value={appState.symbolShape}
                      onChange={({ option }) => setAppState({ ...appState, symbolShape: option })}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Text margin="small">Select color:</Text>
                  </TableCell>
                  <TableCell>
                    <Select
                      options={SYMBOL_COLORS}
                      value={appState.symbolColorScheme}
                      onChange={({ option }) => {
                        setAppState({ ...appState, symbolColorScheme: option });
                      }}
                    />
                  </TableCell>
                </TableRow>
              </>
            )
            : (
              <TableRow>
                <TableCell>
                  <Text margin="small">Select palette:</Text>
                </TableCell>
                <TableCell>
                  <Select
                    options={CHOROPLETH_COLORS}
                    value={appState.choroplethColorScheme}
                    onChange={({ option }) => {
                      setAppState({ ...appState, choroplethColorScheme: option });
                    }}
                  />
                </TableCell>
              </TableRow>
            )}
        </TableBody>
      </Box>
    </Box>
  );
}

export default VisualizeStep;
