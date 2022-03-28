import React from 'react';
import { render, screen } from '@testing-library/react';
import Landing from '../views/Landing';

describe('<Landing />', () => {
  test('renders header', () => {
    render(<Landing />);
    const linkElement = screen.getByText(/batian/i);
    expect(linkElement).toBeInTheDocument();
  });
});
