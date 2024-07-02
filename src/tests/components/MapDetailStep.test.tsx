import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, fireEvent, screen } from '@testing-library/react';
import MapDetailStep from '../../components/MapDetailStep';
import { RecoilObserver, recoilState } from '../../store';

describe('<MapDetailStep />', () => {
  test('should render <MapDetailStep />', () => {
    const onChange = jest.fn();
    const expectedState: AppState = {
      map: { title: 'The Sternness of Plates', type: '', region: 'Africa' },
      userData: { data: [], errors: [], ready: false },
      currentStep: 0,
      dataKeys: {},
      mismatchedRegions: [],
      regionSuggestions: [],
      choroplethColorScheme: 'Reds',
      symbolColorScheme: 'Red',
      symbolShape: 'Circle',
    };

    render(
      <RecoilRoot>
        <RecoilObserver node={recoilState} onChange={onChange} />
        <MapDetailStep />
      </RecoilRoot>,
    );

    expect(screen.getByText(/Map Details?/i)).toBeInTheDocument();
    expect(screen.getByText('What type of map do you want to create?')).toBeInTheDocument();

    expect(screen.getByPlaceholderText('[Map title]')).toBeInTheDocument();

    const input = screen.getByTestId('map-title-input') as HTMLInputElement;
    fireEvent.change(input, {
      target: { value: 'The Sternness of Plates' },
    });
    expect(input.value).toBe('The Sternness of Plates');
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(expectedState);
  });

  test('should update map type when radio button is selected <MapDetailStep />', () => {
    const onChange = jest.fn();
    const expectedState: AppState = {
      map: { title: '', type: 'Choropleth', region: 'Africa' },
      userData: { data: [], errors: [], ready: false },
      currentStep: 0,
      dataKeys: {},
      mismatchedRegions: [],
      regionSuggestions: [],
      choroplethColorScheme: 'Reds',
      symbolColorScheme: 'Red',
      symbolShape: 'Circle',
    };

    render(
      <RecoilRoot>
        <RecoilObserver node={recoilState} onChange={onChange} />
        <MapDetailStep />
      </RecoilRoot>,
    );

    fireEvent.click(screen.getByText('Choropleth'));
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(expectedState);
  });
});
