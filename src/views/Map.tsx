import { Box, Grid, Grommet } from "grommet";
import React from "react";
import { useParams } from "react-router-dom";

export default function Map() {
  let params = useParams();
  return (
    <Grommet>
      <Grid
        rows={['xxsmall', 'large']}
        columns={['medium']}
        gap="xxsmall"
        areas={[
          { name: 'header', start: [0, 0], end: [1, 0] },
          { name: 'nav', start: [0, 1], end: [0, 1] },
          { name: 'main', start: [1, 1], end: [1, 1] },
        ]}
      >
        <Box gridArea="header" background="brand" />
        <Box gridArea="nav" background="light-5" />
        <Box gridArea="main" background="light-2" />
      </Grid>
    </Grommet>
  );
  
}