import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen } from '@testing-library/react';
import MapRefineStep from '../../components/MapRefineStep';

describe('<MapRefineStep />', () => {
  test('should render <MapRefineStep />', () => {
    render(
      <RecoilRoot>
        <MapRefineStep />
      </RecoilRoot>,
    );

    expect(screen.getByText(/Time to refine your data?/i)).toBeInTheDocument();
  });
});
