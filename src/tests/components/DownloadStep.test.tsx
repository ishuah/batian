import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen } from '@testing-library/react';
import DownloadStep from '../../components/DownloadStep';

describe('<DownloadStep />', () => {
  beforeEach(() => {
    render(
      <RecoilRoot>
        <DownloadStep />
      </RecoilRoot>,
    );
  });

  test('should render <DownloadStep />', () => {
    expect(screen.getByText(/Download visualization?/i)).toBeInTheDocument();
    expect(screen.getByText(/Download your visualization in either SVG or PNG format.?/i)).toBeInTheDocument();

    expect(screen.getByTestId(/download-svg/i)).toBeInTheDocument();
    expect(screen.getByTestId(/download-png/i)).toBeInTheDocument();
  });
});
