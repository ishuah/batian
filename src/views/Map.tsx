import { Grommet, Heading, Main } from "grommet";
import React from "react";
import { useParams } from "react-router-dom";

export default function Map() {
  let params = useParams();
  return (
    <Grommet>
      <Main pad="large"></Main>
      <Heading>Draw Map</Heading>
    </Grommet>
  );
  
}