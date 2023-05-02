import { expect, test } from '@playwright/test';

import { acceptCookies } from '../helpers/accept-cookies';
import { acceptTos } from '../helpers/accept-tos';
import { loginUserMeemooIdp } from '../helpers/login-user-meemoo-idp';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';

test('T02: Test inloggen CP-admin', async ({ page, context }) => {
	// Go to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

	// Check page title is the home page
	await page.waitForFunction(() => document.title === 'homepage | bezoekertool', null, {
		timeout: 10000,
	});

	// Accept all cookies
	await acceptCookies(page, 'all');

	// Login cp admin using the meemoo idp
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_CP_ADMIN_ACCOUNT_USERNAME as string,
		process.env.TEST_CP_ADMIN_ACCOUNT_PASSWORD as string
	);

	// Check logged in status
	await expect(page.locator('.c-avatar__text')).toContainText('VRT CP ADMIN');

	// Admin should not be visible and beheer should be visible
	const navigationItemTexts = await page
		.locator('.l-app a[class*="Navigation_c-navigation__link"]')
		.allInnerTexts();
	await expect(navigationItemTexts).not.toContain('Admin');
	await expect(navigationItemTexts).toContain('Beheer');

	// Check tos is displayed, scroll down and click accept button
	// await acceptTos(page); //ENABLE THIS LINE WHEN RUNNING TESTS ON INT

	// Wait for close to save the videos
	await context.close();
});
