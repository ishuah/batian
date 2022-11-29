import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen } from '@testing-library/react';
import VisualizeStep from '../../components/VisualizeStep';

describe('<VisualizeStep />', () => {
  test('should render <VisualizeStep />', () => {
    render(
      <RecoilRoot>
        <VisualizeStep />
      </RecoilRoot>,
    );

    expect(screen.getByText(/Visualize?/i)).toBeInTheDocument();
  });
});
