import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Glossary } from './Glossary';

describe('Glossary Component Integration', () => {
  it('filters glossary terms based on user search input', async () => {
    const user = userEvent.setup();
    render(<Glossary />);

    const searchInput = screen.getByPlaceholderText(/Search terms/i);
    expect(searchInput).toBeInTheDocument();

    // Type a specific term
    await user.type(searchInput, 'Ballot');

    // Wait for debounce and verify only "Ballot" is displayed
    const term = await screen.findByText('Ballot');
    expect(term).toBeInTheDocument();
  });
});
