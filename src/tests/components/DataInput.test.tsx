import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, fireEvent, screen } from '@testing-library/react';
import DataInput from '../../components/DataInput';

describe('<DataInput />', () => {
  test('should render <DataInput />', () => {
    render(
      <RecoilRoot>
        <DataInput />
      </RecoilRoot>,
    );

    expect(screen.getByText(/Time to add some data?/i)).toBeInTheDocument();
    
  });
});