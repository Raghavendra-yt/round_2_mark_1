import { render, screen } from '@testing-library/react';
import { Leaderboard } from './Leaderboard';

describe('Leaderboard Component', () => {
  it('renders top scores title', () => {
    render(<Leaderboard />);
    expect(screen.getByText(/top scores/i)).toBeInTheDocument();
  });

  it('renders loading state initially', () => {
    render(<Leaderboard />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
