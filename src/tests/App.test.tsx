import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../views/App';

describe('<App />', () => {
  test('renders header', () => {
    render(<App />);
    const linkElement = screen.getByText(/batian/i);
    expect(linkElement).toBeInTheDocument();
  });
});
