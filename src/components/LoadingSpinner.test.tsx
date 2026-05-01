import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders accessible loading text', () => {
    render(<LoadingSpinner label="Loading content..." />);
    
    const spinnerRegion = screen.getByRole('status');
    expect(spinnerRegion).toBeInTheDocument();
    
    expect(screen.getByText('Loading content...')).toBeInTheDocument();
  });

  it('uses default message when no prop provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });
});
