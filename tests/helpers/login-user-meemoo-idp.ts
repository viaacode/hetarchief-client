import { expect, Page } from '@playwright/test';

export async function loginUserMeemooIdp(
	page: Page,
	username: string,
	password: string
): Promise<void> {
	// Click on login or register
	await page.locator('text=Inloggen of registreren').click();

	// Check auth modal opens up
	const authModalHeading = await page
		.locator('[class^="AuthModal_c-auth-modal__heading"]')
		.first();
	expect(authModalHeading).toBeDefined();

	// Click the login button
	await page.click('text=Meld je aan als beheerder.');

	// Fill in credentials
	await page.fill('#inputUsername', username);
	await page.fill('#inputPassword', password);

	// Click the login button
	await page.click('#wp-submit');

	// Wait for the new page to load
	await page.waitForLoadState('networkidle');
}
