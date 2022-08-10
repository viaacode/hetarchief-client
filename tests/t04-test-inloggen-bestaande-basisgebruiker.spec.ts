import { expect, test } from '@playwright/test';

import { loginUserHetArchiefIdp } from './helpers/login-user-het-archief-idp';

test('T04: Test inloggen bestaande basisgebruiker', async ({ page, context }) => {
	// GO to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

	// Check homepage title
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});

	// Check the homepage show the correct title for searching maintainers
	await expect(await page.locator('text=Vind een aanbieder')).toBeVisible();

	// Login with existing user
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_PASSWORD as string
	);

	// Check homepage title
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});

	// Admin and beheer should not be visible
	const navigationItemTexts = await page
		.locator('.l-app a[class*="Navigation_c-navigation__link"]')
		.allInnerTexts();
	await expect(navigationItemTexts).not.toContain('Admin');
	await expect(navigationItemTexts).not.toContain('Beheer');

	// Wait for close to save the videos
	await context.close();
});
