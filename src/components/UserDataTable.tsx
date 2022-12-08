import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  DataTable,
  Layer,
  MouseClick,
  Table,
  Text,
  TableBody,
  TableCell,
  TableRow,
  TextInput,
  Box,
} from 'grommet';

type UserDataTableProps = {
  data: never[],
  onUpdateRow: (updatedRow: any, updatedRowIndex: number) => void,
  onDeleteRow: (deleteRowIndex: number) => void,
  mismatchedRegions: string[],
  regionSuggestions: string[],
}

function UserDataTable(props: UserDataTableProps) {
  const [show, setShow] = useState(false);
  const [activeRow, setActiveRow] = useState<any>();
  const [activeRowIndex, setActiveRowIndex] = useState<number>();
  const {
    data,
    onUpdateRow,
    onDeleteRow,
    mismatchedRegions,
    regionSuggestions,
  } = props;
  const x: React.CSSProperties = {
    overflow: 'auto',
  };
  const columns = Object
    .keys(data[0])
    .map((header) => ({
      property: header,
      header,
      render: (datum: any) => (
        <Text color={mismatchedRegions.includes(datum[header]) ? 'red' : ''}>{datum[header]}</Text>
      ),
    }));

  const onClickRow = (event: MouseClick<any>) => {
    setActiveRow(event.datum);
    setActiveRowIndex(event.index);
    setShow(true);
  };

  return (
    <>
      <DataTable
        data-testid="data-table"
        size="large"
        background="white"
        border
        columns={columns}
        data={data}
        onClickRow={(event) => onClickRow(event as MouseClick<any>)}
      />
      {show && activeRow && (
        <Layer
          onEsc={() => setShow(false)}
          onClickOutside={() => setShow(false)}
        >
          <Card height="medium" width="medium" background="light-1">
            <CardHeader pad="small">Edit Row</CardHeader>
            <CardBody pad="xxsmall" style={x}>
              <Table>
                <TableBody>
                  {Object.keys(data[0]).map((key) => (
                    <TableRow key={key}>
                      <TableCell scope="row">{key}</TableCell>
                      <TableCell>
                        <TextInput
                          key={key}
                          value={activeRow[key]}
                          size="small"
                          onChange={(event) => {
                            const editedRow = { ...activeRow };
                            editedRow[key] = event.target.value;
                            setActiveRow(editedRow);
                          }}
                          suggestions={regionSuggestions}
                          onSuggestionSelect={(event) => {
                            const editedRow = { ...activeRow };
                            editedRow[key] = event.suggestion;
                            setActiveRow(editedRow);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
            <CardFooter pad="small" background="light-2">
              <Button label="Cancel" onClick={() => setShow(false)} />
              <Box direction="row" gap="xsmall">
                <Button
                  label="Delete"
                  color="red"
                  onClick={() => {
                    onDeleteRow(activeRowIndex!);
                    setShow(false);
                  }}
                />
                <Button
                  label="Save"
                  primary
                  onClick={() => {
                    onUpdateRow(activeRow, activeRowIndex!);
                    setShow(false);
                  }}
                />
              </Box>
            </CardFooter>
          </Card>
        </Layer>
      )}
    </>
  );
}

export default UserDataTable;
