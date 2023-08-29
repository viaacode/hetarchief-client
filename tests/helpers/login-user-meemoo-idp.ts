import { expect, Page } from '@playwright/test';

export async function loginUserMeemooIdp(
	page: Page,
	username: string,
	password: string
): Promise<void> {
	// Click on login or register
	await page.locator('text=Inloggen of registreren').first().click();

	// Check auth modal opens up
	const authModalHeading = await page
		.locator('[class*="AuthModal_c-auth-modal__heading"]')
		.first();
	expect(authModalHeading).toBeDefined();

	// Click the login button
	await page.locator('.c-button.c-button--black', { hasText: 'Inloggen' }).click(); //Should be 'Inloggen met het Archief-account'

	// Fill in credentials
	await page.fill('#inputUsername', username);
	await page.fill('#inputPassword', password);

	// Click the login button and wait for the new page to load
	await Promise.all([page.click('#wp-submit'), page.waitForLoadState('networkidle')]);
}
