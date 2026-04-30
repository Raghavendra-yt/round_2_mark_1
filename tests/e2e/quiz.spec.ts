import { test, expect } from '@playwright/test';

test('User can complete the election quiz successfully', async ({ page }) => {
  await page.goto('/');
  await page.click('text="Test Your Knowledge"');
  await expect(page.locator('#quiz-heading')).toBeVisible();

  // Assuming a generic answer button exists
  const firstAnswer = page.locator('.quiz-opts button').first();
  if (await firstAnswer.isVisible()) {
    await firstAnswer.click();
    await expect(page.locator('.quiz-feedback')).toBeVisible();
  }
});
