import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PollMap } from './PollMap';
import * as geolocationHook from '@/hooks/useGeolocation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the hooks
jest.mock('@/hooks/useGeolocation');
jest.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({ trackEvent: jest.fn() }),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('PollMap Component', () => {
  it('renders the initial locate button when idle', () => {
    (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
      phase: 'idle',
      userPosition: null,
      locate: jest.fn(),
    });

    render(<PollMap />, { wrapper });
    expect(screen.getByText(/Find My Polling Station/i)).toBeInTheDocument();
  });

  it('shows the loading spinner during the locating phase', () => {
    (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
      phase: 'locating',
      userPosition: null,
      locate: jest.fn(),
    });

    render(<PollMap />, { wrapper });
    expect(screen.getByText(/Detecting your location/i)).toBeInTheDocument();
  });

  it('handles empty station data gracefully', async () => {
    (geolocationHook.useGeolocation as jest.Mock).mockReturnValue({
      phase: 'ready',
      userPosition: { lat: 0, lng: 0 },
      locate: jest.fn(),
    });

    // Mock services to return empty data
    jest.mock('@/services/pollingStationsService', () => ({
      buildPollingStations: () => [],
    }));

    render(<PollMap />, { wrapper });
    
    await waitFor(() => {
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
      // Should still show the map or a placeholder
      expect(screen.getByLabelText(/Google Map/i)).toBeInTheDocument();
    });
  });
});
