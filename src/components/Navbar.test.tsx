import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navbar } from './Navbar';

describe('Navbar Component Integration', () => {
  it('toggles mobile menu on button click', async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    const toggleButton = screen.getByRole('button', { name: /Toggle navigation/i });
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggleButton);

    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    // Using a more general query since id isn't a valid option for getByRole
    const menu = screen.getByRole('list');
    expect(menu).toBeInTheDocument();
  });
});
