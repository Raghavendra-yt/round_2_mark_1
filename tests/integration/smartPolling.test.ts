import { useGeminiQuery } from '@/hooks/useGemini';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Smart Polling Integration (Gemini API)', () => {
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('handles successful Gemini response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ prediction: 'High density expected', confidence: 0.95 }),
    });

    const { result } = renderHook(() => useGeminiQuery('Check crowd density'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data.prediction).toBe('High density expected');
  });

  it('gracefully handles Gemini API timeouts (error 504)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 504,
      statusText: 'Gateway Timeout',
    });

    const { result } = renderHook(() => useGeminiQuery('Check crowd density'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toContain('API Error');
  });

  it('handles empty data responses from Gemini', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}), // Empty data
    });

    const { result } = renderHook(() => useGeminiQuery('Check crowd density'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({});
  });
});
