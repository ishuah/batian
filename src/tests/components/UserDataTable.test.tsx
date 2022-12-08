import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import UserDataTable from '../../components/UserDataTable';

describe('<UserDataTable />', () => {
  const mockOnUpdateRow = jest.fn();
  const mockOnDeleteRow = jest.fn();
  beforeEach(() => {
    const data = [{ country: 'string', happy_index: 'number' }] as never[];
    render(
      <UserDataTable
        data={data}
        onUpdateRow={mockOnUpdateRow}
        onDeleteRow={mockOnDeleteRow}
        mismatchedRegions={[]}
        regionSuggestions={[]}
      />,
    );
  });

  afterEach(cleanup);

  test('should render <UserDataTable />', () => {
    expect(screen.getByText(/country?/i)).toBeInTheDocument();
    expect(screen.getByText(/happy_index?/i)).toBeInTheDocument();
    expect(screen.getByText(/string/i)).toBeInTheDocument();
  });

  test('should call onUpdateRow callback when save button is pressed <UserDataTable />', () => {
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
