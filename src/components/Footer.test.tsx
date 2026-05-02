import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';
import { APP_NAME } from '@/constants';

describe('Footer Component', () => {
  it('renders application name', () => {
    render(<Footer />);
    expect(screen.getByText(APP_NAME)).toBeInTheDocument();
  });

  it('renders non-partisan disclaimer', () => {
    render(<Footer />);
    expect(screen.getByText(/Non-partisan educational resource/i)).toBeInTheDocument();
  });
});
