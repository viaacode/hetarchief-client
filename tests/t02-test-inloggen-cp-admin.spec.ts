import { expect, test } from '@playwright/test';

import { acceptCookies } from './helpers/accept-cookies';
import { acceptTos } from './helpers/accept-tos';
import { loginUserMeemooIdp } from './helpers/login-user-meemoo-idp';

test('T02: Test inloggen CP-admin', async ({ page, context }) => {
	// Go to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

	// Check page title is the home page
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});

	// Login cp admin using the meemoo idp
	await loginUserMeemooIdp(
		page,
		process.env.TEST_CP_ADMIN_ACCOUNT_USERNAME as string,
		process.env.TEST_CP_ADMIN_ACCOUNT_PASSWORD as string
	);

	// Accept all cookies
	await acceptCookies(page, 'all');

	// Check logged in status
	await expect(await page.locator('.c-avatar__text')).toHaveText('Test');

	// Admin should not be visible and beheer should be visible
	const navigationItemTexts = await page
		.locator('.l-app a[class*="Navigation_c-navigation__link"]')
		.allInnerTexts();
	await expect(navigationItemTexts).not.toContain('Admin');
	await expect(navigationItemTexts).toContain('Beheer');

	// Check tos is displayed, scroll down and click accept button
	await acceptTos(page);

	// Wait for close to save the videos
	await context.close();
});
