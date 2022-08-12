import { expect, Page } from '@playwright/test';

export async function checkSpaceVisibilityHomepage(
	page: Page,
	searchTerm: string,
	shouldBeVisible: boolean
): Promise<void> {
	// Go to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

	// Check page title is the home page
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});

	// Search for "searchTerm"
	const searchFieldHomePage = await page.locator('[placeholder="zoek"]');
	await searchFieldHomePage.fill(searchTerm);
	await page.locator('.c-input .c-button', { hasText: 'search' }).click();

	if (shouldBeVisible) {
		// Check searchTerm is shown
		const card = await page.locator('.p-home__results .c-card', { hasText: searchTerm });
		await expect(card).toBeVisible();
		await expect(card.locator('.c-button', { hasText: 'Vraag toegang aan' })).toBeVisible();
	} else {
		// Check searchTerm is not shown
		await expect(
			await page.locator('text=Geen resultaten voor de geselecteerde filters.')
		).toBeVisible();
		const card = await page.locator('.p-home__results .c-card', { hasText: searchTerm });
		await expect(card).not.toBeVisible();
		await expect(card.locator('.c-button', { hasText: 'Vraag toegang aan' })).not.toBeVisible();
	}

	// Go back to previous page
	await page.goBack(); // Revert the search url change
	await page.goBack(); // Revert the "go to homepage" url change
}
