import React from 'react';
import { DataTable } from 'grommet';

type UserDataTableProps = {
  data: never[]
}

function UserDataTable(props: UserDataTableProps) {
  const { data } = props;
  const columns = Object.keys(data[0]).map((header) => ({ property: header, header }));

  return (
    <DataTable
      data-testid="data-table"
      size="small"
      margin={{ top: 'large' }}
      background="white"
      border
      columns={columns}
      data={data}
    />
  );
}

export default UserDataTable;
