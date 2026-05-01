import { render, screen } from '@testing-library/react';
import { StatsSection } from './Stats';

// Mock intersection observer since it's used in reveal classes (handled globally in setupTests.ts)

describe('Stats Component', () => {
  it('renders the stats grid', () => {
    render(<StatsSection />);
    const list = screen.getByRole('list', { name: /key statistics about elected/i });
    expect(list).toBeInTheDocument();
  });

  it('renders individual stat items', () => {
    render(<StatsSection />);
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(4);

    expect(screen.getByText('Election Phases')).toBeInTheDocument();
    expect(screen.getByText('Key Terms Defined')).toBeInTheDocument();
    expect(screen.getByText('Quiz Questions')).toBeInTheDocument();
    expect(screen.getByText('Free to Access')).toBeInTheDocument();
  });
});
