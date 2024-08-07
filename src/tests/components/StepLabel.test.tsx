import React from 'react';
import { render, screen } from '@testing-library/react';
import StepLabel from '../../components/StepLabel';

describe('<StepLabel />', () => {
  test('renders normal step', () => {
    render(<StepLabel text="Get it started" step={23} completed={false} size="large" />);

    const labelText = screen.getByText(/Get it started/i);
    expect(labelText).toBeInTheDocument();

    const step = screen.getByText(/23/);
    expect(step).toBeInTheDocument();
  });
});
