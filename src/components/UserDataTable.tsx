import React, { useCallback, useState } from 'react';
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
  KeyPress,
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
      size: 'small',
      render: (datum: any) => (
        <Text color={mismatchedRegions.includes(datum[header]) ? 'red' : ''}>{datum[header]}</Text>
      ),
    }));

  const closeModal = useCallback(() => {
    setShow(false);
  }, [show]);

  const onClickRow = useCallback((event: MouseClick<any> | KeyPress<any>) => {
    const click = event as MouseClick<any>;
    setActiveRow(click.datum);
    setActiveRowIndex(click.index);
    setShow(true);
  }, [activeRow, activeRowIndex, show]);

  const deleteRow = useCallback(() => {
    if (activeRowIndex !== undefined) onDeleteRow(activeRowIndex);
    setShow(false);
  }, [activeRowIndex, show]);

  const updateRow = useCallback(() => {
    if (activeRowIndex !== undefined) onUpdateRow(activeRow, activeRowIndex);
    setShow(false);
  }, [activeRow, activeRowIndex, show]);

  return (
    <>
      <DataTable
        data-testid="data-table"
        size="large"
        background="white"
        border
        fill="horizontal"
        columns={columns}
        data={data}
        onClickRow={onClickRow}
      />
      {show && activeRow && (
        <Layer
          onEsc={closeModal}
          onClickOutside={closeModal}
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
              <Button label="Cancel" onClick={closeModal} />
              <Box direction="row" gap="xsmall">
                <Button
                  label="Delete"
                  color="red"
                  onClick={deleteRow}
                />
                <Button
                  label="Save"
                  primary
                  onClick={updateRow}
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
