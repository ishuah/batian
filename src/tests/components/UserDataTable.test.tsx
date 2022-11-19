import React from 'react';
import { render, screen } from '@testing-library/react';
import UserDataTable from '../../components/UserDataTable';

describe('<UserDataTable />', () => {
  test('should render <UserDataTable />', () => {
    const data = [{ country: 'string', happy_index: 'number' }] as never[];
    render(
      <UserDataTable data={data} />,
    );

    expect(screen.getByText(/country?/i)).toBeInTheDocument();
    expect(screen.getByText(/happy_index?/i)).toBeInTheDocument();
  });
});
