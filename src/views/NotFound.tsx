import { Grommet, Heading, Main } from "grommet";
import { Halt } from "grommet-icons";
import React from "react";

type NotFoundProps = {
  message: string
}

export default function NotFound(props: NotFoundProps) {
    return (
      <Grommet>
        <Main pad="large" align="center">
          <Halt size="large" color="black"/>
          <Heading level="3">{props.message}</Heading>
        </Main>
      </Grommet>
    );
}