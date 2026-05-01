import { render, screen } from '@testing-library/react';
import { CTA } from './CTA';

describe('CTA Component', () => {
  it('renders call to action heading', () => {
    render(<CTA />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Your Vote is Your Voice/i);
  });

  it('renders navigation links', () => {
    render(<CTA />);
    expect(screen.getByRole('link', { name: /Retake the Quiz/i })).toHaveAttribute('href', '#quiz');
    expect(screen.getByRole('link', { name: /Review the Timeline/i })).toHaveAttribute('href', '#timeline');
  });
});
