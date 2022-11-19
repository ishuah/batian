import React from 'react';
import { useRecoilValue } from 'recoil';
import { DataTable } from 'grommet';
import { recoilState } from '../store';

function UserDataTable() {
  const appState = useRecoilValue<AppState>(recoilState);
  const columns = Object.keys(appState
    .userData.data[0]).map((header) => ({ property: header, header }));

  return (
    <DataTable
      data-testid="data-table"
      size="small"
      margin={{ top: 'large' }}
      background="white"
      border
      columns={columns}
      data={appState.userData.data}
    />
  );
}

export default UserDataTable;
