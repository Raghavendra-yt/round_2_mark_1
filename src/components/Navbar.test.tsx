import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navbar } from './Navbar';

describe('Navbar Component Integration', () => {
  it('toggles mobile menu on button click', async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    const toggleButton = screen.getByRole('button', { name: /Open menu|Close menu/i });
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggleButton);

    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    const menu = screen.getByRole('menubar');
    expect(menu.parentElement).toHaveClass('is-open');
  });
});
