import { Box, Button, Grommet, Heading, Main, Paragraph, WorldMap } from 'grommet';
import React from 'react';


function App() {
  return (
    <Grommet>
      <Main pad="large">
        <Box align="center">
          <Heading>Batian</Heading>
          <Paragraph>A happy spatial data visualization tool.</Paragraph>
          <Button href="/maps/1" label="Demo Map" color='status-ok' />
          <Box pad="large">
            <WorldMap
              color='status-ok'
            />
          </Box>
        </Box>
      </Main>
  </Grommet>
  );
}

export default App;
