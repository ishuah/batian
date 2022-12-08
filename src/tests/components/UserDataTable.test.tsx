import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import UserDataTable from '../../components/UserDataTable';

describe('<UserDataTable />', () => {
  test('should render <UserDataTable />', () => {
    const data = [{ country: 'string', happy_index: 'number' }] as never[];
    const mockOnUpdateRow = jest.fn();
    const mockOnDeleteRow = jest.fn();
    render(
      <UserDataTable
        data={data}
        onUpdateRow={mockOnUpdateRow}
        onDeleteRow={mockOnDeleteRow}
        mismatchedRegions={[]}
        regionSuggestions={[]}
      />,
    );

    expect(screen.getByText(/country?/i)).toBeInTheDocument();
    expect(screen.getByText(/happy_index?/i)).toBeInTheDocument();
    expect(screen.getByText(/string/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/string/i));
    expect(screen.getByText(/Edit Row/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/string/i)).toBeInTheDocument();

    const input = screen.getByDisplayValue(/string/i) as HTMLInputElement;
    fireEvent.change(input, {
      target: { value: 'updated string' },
    });

    fireEvent.click(screen.getByText(/Save/i));
    expect(mockOnUpdateRow).toHaveBeenCalled();
  });
});
