import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen } from '@testing-library/react';
import DataInputStep from '../../components/DataInputStep';

describe('<DataInputStep />', () => {
  test('should render <DataInputStep />', () => {
    render(
      <RecoilRoot>
        <DataInputStep />
      </RecoilRoot>,
    );

    expect(screen.getByText(/Time to add some data?/i)).toBeInTheDocument();
  });
});
