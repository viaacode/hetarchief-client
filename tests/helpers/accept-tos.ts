import { expect, Page } from '@playwright/test';

export async function acceptTos(page: Page): Promise<void> {
	// Check title, content page content and disabled button
	await expect(page.locator('.p-terms-of-service__title')).toContainText('Gebruiksvoorwaarden');
	await expect(page.locator('.c-content-page-preview')).toContainText('Deze gebruiksvoorwaarden');
	const acceptTosButton = await page.locator('.p-terms-of-service__buttons .c-button--black');
	await expect(acceptTosButton).toHaveClass(/c-button--disabled/);

	// Scroll down
	await page.evaluate(() => {
		document.querySelector('.p-terms-of-service__content')?.scrollTo(0, 50000);
	});

	// Check button becomes active
	await expect(acceptTosButton).not.toHaveClass(/c-button--disabled/);

	// Click the accept tos button
	await acceptTosButton.click();

	// Check page title is the home page
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});
}
