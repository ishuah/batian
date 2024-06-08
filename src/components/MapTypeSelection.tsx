import React from 'react';
// import { recoilState } from '../store';
// import { useRecoilState } from 'recoil';
import {
  Box, Card, CardBody, CardFooter, CardHeader, Heading, Image, Paragraph,
} from 'grommet';

function MapTypeSelection() {
  // const [appState, setAppState] = useRecoilState<AppState>(recoilState);

  return (
    <Box height="large">
      <Box pad="medium">
        <Heading level="2">Which type of map do you want to create?</Heading>
        <Box direction="column" gap="medium" margin="medium">
          <Card height="small" width="large" elevation="none">
            <CardBody pad="none">
              <Box direction="row" gap="small">
                <Image
                  src={`${process.env.PUBLIC_URL}/img/choropleth-map-button-image.png`}
                />
                <Box>
                  <Heading level="4" margin="xsmall">Choropleth Map</Heading>
                  <Paragraph margin="xsmall">
                    A choropleth map displays different regions in various
                    colors based on underlying data, such as population or
                    income. Darker colors usually indicate higher values,
                    while lighter colors signify lower values.
                    It&lsquo;s a visual way to compare data across geographic
                    regions at a glance.
                  </Paragraph>
                </Box>
              </Box>
            </CardBody>
          </Card>
          <Paragraph margin="0 auto">- OR -</Paragraph>
          <Card height="small" width="large" elevation="none">
            <CardBody pad="none">
              <Box direction="row" gap="small">
                <Image
                  src={`${process.env.PUBLIC_URL}/img/symbol-map-button-image.png`}
                />
                <Box>
                  <Heading level="4" margin="xsmall">Symbol Map</Heading>
                  <Paragraph margin="xsmall">
                    A symbol map represents data points with symbols,
                    such as dots or icons, placed on specific geographic locations.
                    The size, color, or style of the symbols can vary to reflect
                    differences in the data they represent, making it easy to
                    visualize variations across a space.
                  </Paragraph>
                </Box>
              </Box>
            </CardBody>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

export default MapTypeSelection;
