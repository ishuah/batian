import React from 'react';
import {
  Grommet, Header, Heading, Main, Box, Text, Card, CardHeader, CardBody, Image,
} from 'grommet';
import StepLabel from '../components/StepLabel/StepLabel';

function App() {
  return (
    <Grommet>
      <Main fill="vertical" pad="none">
        <Header background="white" pad="xxsmall">
          <Heading level="3" margin={{ vertical: 'small', horizontal: 'small' }}>Batian</Heading>
        </Header>
        <Box pad="xlarge" align="center">
          <Text size="xlarge">What kind of map do you want to create?</Text>
          <Box direction="row" gap="large" margin={{ vertical: 'medium', horizontal: 'xlarge' }} pad="medium">
            <Card height="small" width="small" background="white">
              <CardHeader pad="none">
                <Image
                  fit="cover"
                  src="//v2.grommet.io/assets/Wilderpeople_Ricky.jpg"
                />
              </CardHeader>
              <CardBody pad="medium">Symbol Map</CardBody>
            </Card>
            <Card height="small" width="small" background="white">
              <CardHeader>
                <Image
                  fit="cover"
                  src="//v2.grommet.io/assets/Wilderpeople_Ricky.jpg"
                />
              </CardHeader>
              <CardBody pad="medium">Choropleth Map</CardBody>
            </Card>
          </Box>
        </Box>
      </Main>
    </Grommet>
  );
}

export default App;
