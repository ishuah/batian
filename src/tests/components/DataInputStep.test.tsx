import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataInputStep from '../../components/DataInputStep';

describe('<DataInputStep />', () => {
  beforeEach(() => {
    render(
      <RecoilRoot>
        <DataInputStep />
      </RecoilRoot>,
    );
  });

  test('should display error when wrong file type is uploaded', () => {
    expect(screen.getByText(/Time to add some data?/i)).toBeInTheDocument();

    const wrongFiletype = new File(['fail'], 'image.png', { type: 'image/png' });
    const fileInput = screen.getByTestId(/file-input/i) as HTMLInputElement;
    userEvent.upload(fileInput, wrongFiletype);

    expect(fileInput.files?.length).toBe(1);
    expect(screen.getByText(/Data error/i)).toBeInTheDocument();
    expect(screen.getByText('image/png is not supported.')).toBeInTheDocument();
  });
});
