import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, fireEvent, screen } from '@testing-library/react';
import MapDetails from '../../components/MapDetails';

describe('<MapDetails />', () => {
  test('should render <MapDetails />', () => {
    render(
      <RecoilRoot>
        <MapDetails />
      </RecoilRoot>,
    );

    expect(screen.getByText(/Map Details?/i)).toBeInTheDocument();
    expect(screen.getByText(/What type of map do you want to create??/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/[Map title]?/i)).toBeInTheDocument();

    const input = screen.getByTestId('map-title-input') as HTMLInputElement;
    fireEvent.change(input, {
      target: { value: 'The Sternness of Plates' },
    });
    expect(input.value).toBe('The Sternness of Plates');
  });
});
