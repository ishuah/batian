import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import App from '../pages/App';

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
    const continueButton = screen.getByText(/Continue/i);
    expect(continueButton).toBeDisabled();

    const backButton = screen.getByText(/Back/i);
    expect(backButton).toBeEnabled();
  });

  test('back button', () => {
    render(<App />);

    fireEvent.click(screen.getByText('Choropleth'));
    fireEvent.click(screen.getByText(/Continue/i));

    const backButton = screen.getByText(/Back/i);
    expect(backButton).toBeEnabled();
    fireEvent.click(backButton);

    expect(screen.getByText(/What type of map do you want to create?/i)).toBeInTheDocument();
  });

  test('cancel button', () => {
    render(<App />);

    fireEvent.click(screen.getByText('Choropleth'));
    fireEvent.click(screen.getByText(/Continue/i));

    const cancelButton = screen.getByText(/Cancel/i);
    expect(cancelButton).toBeEnabled();
    fireEvent.click(cancelButton);

    expect(screen.getByText(/What type of map do you want to create?/i)).toBeInTheDocument();
  });
});
