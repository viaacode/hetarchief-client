import { expect, test } from '@playwright/test';

test('Should redirect to login page and redirect after login', async ({ page }) => {
	await page.goto(process.env.TEST_ENDPOINT as string);
	expect(await page.title()).toEqual('Home | bezoekertool');

	await page.locator('text=Inloggen of registreren').click();

	// Check auth modal opens up
	const authModalHeading = page.locator('[class^="AuthModal_c-auth-modal__heading"]').first();
	expect(authModalHeading).toBeDefined();

	// Login using het archief account
	const loginButton = page.locator('.ReactModal__Content .c-button--black');
	await loginButton.click();

	// Enter credentials
	await page.fill('[name="username"]', process.env.TEST_ACCOUNT_USERNAME as string);
	await page.fill('[name="password"]', process.env.TEST_ACCOUNT_PASSWORD as string);
	await page.click('#wp-submit');

	await page.waitForLoadState('networkidle');

	// Check redirect back to the home page
	expect(await page.title()).toEqual('Home | bezoekertool');
	expect(page.url()).toContain(process.env.TEST_ENDPOINT as string);
	await expect(await page.locator('text=Vind een bezoekersruimte')).toBeVisible();
});
