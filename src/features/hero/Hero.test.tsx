import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

describe('Hero Component', () => {
  it('renders main heading and description', () => {
    render(<Hero />);
    
    // Check heading
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/Understand the Power of Your Vote/i);

    // Check description
    const desc = screen.getByText(/A comprehensive, accessible guide to how elections work/i);
    expect(desc).toBeInTheDocument();
  });

  it('renders call to action buttons', () => {
    render(<Hero />);
    
    const startLearningBtn = screen.getByRole('link', { name: /Explore the Process/i });
    expect(startLearningBtn).toBeInTheDocument();
    expect(startLearningBtn).toHaveAttribute('href', '#timeline');

    const testKnowledgeBtn = screen.getByRole('link', { name: /Take the Quiz/i });
    expect(testKnowledgeBtn).toBeInTheDocument();
    expect(testKnowledgeBtn).toHaveAttribute('href', '#quiz');
  });

  it('renders decorative particles', () => {
    const { container } = render(<Hero />);
    const particles = container.querySelectorAll('.particle');
    expect(particles.length).toBeGreaterThan(0);
  });
});
