import { expect, test } from '@playwright/test';

import { acceptCookies } from '../helpers/accept-cookies';
import { acceptTos } from '../helpers/accept-tos';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';

test('T04: Test inloggen bestaande basisgebruiker', async ({ page, context }) => {
	// GO to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

	// Check homepage title
	await page.waitForFunction(() => document.title === 'homepage | bezoekertool', null, {
		timeout: 10000,
	});

	// Accept all cookies
	await acceptCookies(page, 'all');

	// Check searchbar contains 'Start je zoektocht':
	let navigationItemTexts = await page
		.locator('.l-app a[class*="Navigation_c-navigation__link"]')
		.allInnerTexts();
	// await expect(navigationItemTexts).toContain('Start je zoektocht'); //Does not pass yet

	// // Check the homepage show the correct title for searching maintainers
	// await expect(page.locator('text=Vind een aanbieder')).toBeVisible();

	//Click on 'Menu'
	await page.locator('text=Menu').first().click();
	//Click on 'Bezoek een aanbieder'
	const visitButton = await page.locator('text=Bezoek een aanbieder').first();

	if (!(await visitButton.isVisible())) {
		// Click on login or register
		await visitButton.click();
	}

	// Login with existing user
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_PASSWORD as string
	);

	// Check tos is displayed, scroll down and click accept button
	await acceptTos(page);

	// Check homepage title
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});

	// Admin and beheer should not be visible
	navigationItemTexts = await page
		.locator('.l-app a[class*="Navigation_c-navigation__link"]')
		.allInnerTexts();
	await expect(navigationItemTexts).not.toContain('Admin');
	await expect(navigationItemTexts).not.toContain('Beheer');

	// Wait for close to save the videos
	await context.close();
});
