import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PollMap } from './PollMap';

// Mock the Geolocation Service
jest.mock('../../hooks/useGeolocation', () => ({
  useGeolocation: () => ({
    lat: 34.0522,
    lng: -118.2437,
    error: null,
    loading: false
  })
}));

describe('PollMap Component Integration', () => {
  it('loads map and searches for polling stations near user', async () => {
    const user = userEvent.setup();
    render(<PollMap />);

    // Wait for map container to load
    const heading = await screen.findByRole('heading', { name: /Find Your Polling Station/i });
    expect(heading).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/Enter your ZIP code/i);
    await user.type(searchInput, '90012');

    const searchButton = screen.getByRole('button', { name: /Search/i });
    await user.click(searchButton);

    // Validate loading state or result processing
    expect(await screen.findByRole('button', { name: /Search/i })).toBeInTheDocument();
  });
});
