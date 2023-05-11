import { expect, test } from '@playwright/test';

import { acceptCookies } from '../helpers/accept-cookies';
import { acceptTos } from '../helpers/accept-tos';
import { loginUserMeemooIdp } from '../helpers/login-user-meemoo-idp';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';

test('T02: Test inloggen CP-admin', async ({ page, context }) => {
	// Go to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

	// Check page title is the home page
	await page.waitForFunction(() => document.title === 'hetarchief.be', null, {
		timeout: 10000,
	});

	// // Accept all cookies
	// await acceptCookies(page, 'all');  // Enable this on INT, comment bcs localhost

	// Login cp admin using the meemoo idp
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_CP_ADMIN_VRT_ACCOUNT_USERNAME as string,
		process.env.TEST_CP_ADMIN_VRT_ACCOUNT_PASSWORD as string
	);
	// Check navbar is visible
	await expect(page.locator('nav[class^=Navigation_c-navigation]')).toBeVisible();

	// Check logged in status
	await expect(page.locator('.c-avatar__text')).toContainText('VRT CP ADMIN');

	// Admin should not be visible and beheer should be visible
	await expect(page.locator('a.c-dropdown-menu__item', { hasText: 'Admin' })).toHaveCount(0);
	await expect(page.locator('a.c-dropdown-menu__item', { hasText: 'Beheer' })).toHaveCount(1);

	// Check tos is displayed, scroll down and click accept button
	// await acceptTos(page); //ENABLE THIS LINE WHEN RUNNING TESTS ON INT

	// Wait for close to save the videos
	await context.close();
});
