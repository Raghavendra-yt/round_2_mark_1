import { test, expect } from '@playwright/test';

test.describe('Full User Journey: Learning & Quiz', () => {
  test('User navigates landing, explores timeline, and completes quiz', async ({ page }) => {
    // 1. Landing
    await page.goto('/');
    await expect(page).toHaveTitle(/ElectED/);
    await expect(page.getByRole('heading', { name: /The Election Process/i })).toBeVisible();

    // 2. Interaction: Scroll to Timeline
    await page.getByRole('link', { name: /Start Learning/i }).click();
    await expect(page.locator('#timeline')).toBeInViewport();
    
    // Open a timeline panel
    const firstTimelineButton = page.locator('#timeline button').first();
    await firstTimelineButton.click();
    await expect(firstTimelineButton).toHaveAttribute('aria-expanded', 'true');

    // 3. Interaction: Take Quiz
    await page.getByRole('link', { name: /Test Your Knowledge/i }).click();
    await expect(page.locator('#quiz')).toBeInViewport();
    
    // Answer Questions
    // Wait for questions to load
    await expect(page.locator('.quiz-opts')).toBeVisible();
    
    // Click first answer
    await page.locator('.quiz-opts button').first().click();
    
    // Validate feedback exists
    await expect(page.locator('.quiz-feedback')).toBeVisible();

    // End of Journey Validation
    // This assumes the app shows a completion screen or score at the end
    // const scoreText = page.locator('.quiz-score');
    // await expect(scoreText).toBeVisible();
  });
});
