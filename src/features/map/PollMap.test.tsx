import { render, screen } from '@testing-library/react';
import { PollMap } from './PollMap';
import { vi } from 'vitest';

// Mock the Geolocation Service
vi.mock('@/hooks/useGeolocation', () => ({
  useGeolocation: () => ({
    phase: 'ready',
    userPosition: { lat: 34.0522, lng: -118.2437 },
    locate: vi.fn(),
  })
}));

describe('PollMap Component Integration', () => {
  it('loads map and shows polling station section', async () => {
    render(<PollMap />);

    // Wait for heading to load
    const heading = await screen.findByRole('heading', { name: /Find Your Polling Station/i });
    expect(heading).toBeInTheDocument();
  });
});
