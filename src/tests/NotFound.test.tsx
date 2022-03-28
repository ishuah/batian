import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from '../views/NotFound';

describe('<NotFound />', () => {
  test('renders message', () => {
    render(<NotFound message="something is missing" />);
    const linkElement = screen.getByText(/something is missing/i);
    expect(linkElement).toBeInTheDocument();
  });
});