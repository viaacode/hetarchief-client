import { expect, type Page } from '@playwright/test';

export async function loginUserHetArchiefIdp(
	page: Page,
	username: string,
	password: string,
	titleAfterLogin = 'Homepagina hetarchief | hetarchief.be'
): Promise<void> {
	await expect(page.locator('text=Inloggen of registreren').first()).toBeVisible();

	// Check auth modal is open
	const authModalHeading = page.locator('[class*="AuthModal_c-auth-modal__heading"]').first();
	if (!(await authModalHeading.isVisible())) {
		// Click on login or register
		await page.locator('text=Inloggen of registreren').first().click();
	}
	await expect(page.locator('[class*="AuthModal_c-auth-modal__heading"]').first()).toBeVisible();

	// Click the login button
	await page.locator('.c-button.c-button--black', { hasText: 'Inloggen' }).click(); //Should be 'Inloggen met het Archief-account'

	// Fill in credentials
	await page.fill('#username', username);
	await page.fill('#password', password);

	// Click the login button
	await page.click('button[type="submit"]');

	// Wait for site to load after login
	await page.waitForFunction(
		(titleAfterLogin: string) => document.title === titleAfterLogin,
		titleAfterLogin,
		{
			timeout: 10000,
		}
	);
}
