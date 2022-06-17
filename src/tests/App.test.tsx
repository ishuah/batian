import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../views/App';

describe('<App />', () => {
  test('renders first step', () => {
    render(<App />);
    const title = screen.getByText(/What type of map do you want to create?/i);
    expect(title).toBeInTheDocument();

    const continueButton = screen.getByText(/Continue/i);
    expect(continueButton).toBeDisabled();

    fireEvent.click(screen.getByText('Choropleth'));
    const subtitle = screen.getByText(/Select map/i);
    expect(subtitle).toBeInTheDocument();
    expect(continueButton).toBeEnabled();

    const backButton = screen.getByText(/Back/i);
    expect(backButton).toBeDisabled();
  });

  test('renders second step', async () => {
    render(<App />);

    fireEvent.click(screen.getByText('Choropleth'));
    fireEvent.click(screen.getByText(/Continue/i));

    const title = screen.getByText(/Time to add some data/i);
    expect(title).toBeInTheDocument();
    expect(screen.getByText(/Continue/i)).toBeDisabled();
  });
});
