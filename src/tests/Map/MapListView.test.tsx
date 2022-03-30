import React from 'react';
import { render } from '@testing-library/react';
import MapListView from '../../views/Map/MapListView';

describe('<MapListView />', () => {
  test('renders without crashing', () => {
    render(<MapListView />);
  });
});
