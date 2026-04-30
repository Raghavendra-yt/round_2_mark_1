import { render, screen } from '@testing-library/react';
import { HowItWorks } from './HowItWorks';

describe('HowItWorks Component', () => {
  it('renders section heading', () => {
    render(<HowItWorks />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Steps Every Voter Should Know/i);
  });

  it('renders all step cards', () => {
    render(<HowItWorks />);
    const cards = screen.getAllByRole('listitem');
    expect(cards.length).toBeGreaterThan(0);
  });
});
