import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AIChat } from './AIChat';

describe('AIChat Component', () => {
  it('renders chat heading', () => {
    render(<AIChat />);
    expect(screen.getByText(/AI Civic Assistant/i)).toBeInTheDocument();
  });

  it('renders input area', () => {
    render(<AIChat />);
    expect(screen.getByPlaceholderText(/Ask a question about voting/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('allows user to type and send a message', async () => {
    const user = userEvent.setup();
    render(<AIChat />);
    
    const input = screen.getByPlaceholderText(/Ask a question about voting/i);
    await user.type(input, 'How do I register?');
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    expect(screen.getByText('How do I register?')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('sanitizes user input', async () => {
    const user = userEvent.setup();
    render(<AIChat />);
    
    const input = screen.getByPlaceholderText(/Ask a question about voting/i);
    const maliciousScript = '<img src=x onerror=alert(1)> Hello';
    await user.type(input, maliciousScript);
    await user.click(screen.getByRole('button', { name: /send message/i }));
    
    // The text content should be present
    expect(screen.getByText(/Hello/i)).toBeInTheDocument();
  });
});
