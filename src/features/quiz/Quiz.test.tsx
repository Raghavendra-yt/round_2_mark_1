import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Quiz } from './Quiz';

describe('Quiz Component Integration', () => {
  it('allows a user to select an answer and displays feedback', async () => {
    const user = userEvent.setup();
    render(<Quiz />);

    // Wait for questions to load
    const heading = await screen.findByRole('heading', { name: /Test Your Knowledge/i });
    expect(heading).toBeInTheDocument();

    // Select first answer
    const answerButton = screen.getAllByRole('button')[1]; // Assume the first button after start/nav is an answer
    await user.click(answerButton);

    // Verify feedback is visible
    expect(screen.getByText(/Explanation/i)).toBeInTheDocument();
  });
});
