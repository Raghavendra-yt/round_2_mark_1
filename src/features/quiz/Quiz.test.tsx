import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Quiz } from './Quiz';

describe('Quiz Component Integration', () => {
  it('allows a user to select an answer and displays feedback', async () => {
    const user = userEvent.setup();
    render(<Quiz />);

    // Wait for questions to load
    const heading = await screen.findByRole('heading', { name: /Test What You've Learned/i });
    expect(heading).toBeInTheDocument();

    // Select first answer
    const answerButton = screen.getAllByRole('radio')[0]; 
    await user.click(answerButton);

    // Verify feedback is visible
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
