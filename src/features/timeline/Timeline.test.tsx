import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Timeline } from './Timeline';

describe('Timeline Component Integration', () => {
  it('expands accordion panels on click', async () => {
    const user = userEvent.setup();
    render(<Timeline />);

    const buttons = await screen.findAllByRole('button');
    const firstButton = buttons[0];
    
    // Assert initial collapsed state
    expect(firstButton).toHaveAttribute('aria-expanded', 'false');

    // User clicks the panel
    await user.click(firstButton);

    // Assert expanded state
    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
  });
});
