import { expect, Page } from '@playwright/test';

export async function loginUserHetArchiefIdp(
	page: Page,
	username: string,
	password: string
): Promise<void> {
	// Check auth modal is open
	const authModalHeading = await page
		.locator('[class^="AuthModal_c-auth-modal__heading"]')
		.first();
	expect(authModalHeading).toBeDefined();

	// Click the login button
	await page.click('text=Inloggen met Het Archief-account');

	// Fill in credentials
	await page.fill('#emailId', username);
	await page.fill('#passwordId', password);

	// Click the login button
	await page.click('button[type="submit"]');

	// Wait for the new page to load
	await page.waitForLoadState('networkidle');
}
