import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Timeline } from './Timeline';

describe('Timeline Component Integration', () => {
  it('expands accordion panels on click', async () => {
    const user = userEvent.setup();
    render(<Timeline />);

    const buttons = await screen.findAllByRole('button');
    const firstButton = buttons[0];
    const secondButton = buttons[1];
    
    // Assert initial active state
    expect(firstButton).toHaveAttribute('aria-pressed', 'true');
    expect(secondButton).toHaveAttribute('aria-pressed', 'false');

    // User clicks the panel
    await user.click(secondButton);

    // Assert active state changed
    expect(secondButton).toHaveAttribute('aria-pressed', 'true');
  });
});
