import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, fireEvent, screen } from '@testing-library/react';
import DataInputStep from '../../components/DataInputStep';

describe('<DataInput />', () => {
  test('should render <DataInput />', () => {
    render(
      <RecoilRoot>
        <DataInputStep />
      </RecoilRoot>,
    );

    expect(screen.getByText(/Time to add some data?/i)).toBeInTheDocument();
  });
});