import React from 'react';
import { Grommet, Box, Main, Heading, Paragraph, WorldMap } from 'grommet';

function App() {
  return (
    <Grommet>
      <Main align="center" pad="large">
        <Heading>Batian</Heading>
        <Paragraph>A happy spatial data visualization tool.</Paragraph>
        <Box pad="large">
          <WorldMap
            color='status-ok'
          />
        </Box>
      </Main>
  </Grommet>
  );
}

export default App;
