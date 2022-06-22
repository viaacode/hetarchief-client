import { expect, test } from '@playwright/test';

import { fillRequestVisitBlade } from './helpers/fill-request-visit-blade';
import { loginUserHetArchiefIdp } from './helpers/login-user-het-archief-idp';

test('T03: Test inloggen meemoo-admin + toegang aanvragen tot bezoekersruimte', async ({
	page,
	context,
}) => {
	// Go to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

	// Check page title is the home page
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});

	// Click on login or register
	await page.locator('text=Inloggen of registreren').click();

	// Login cp admin using the meemoo idp
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_MEEMOO_ADMIN_ACCOUNT_USERNAME as string,
		process.env.TEST_MEEMOO_ADMIN_ACCOUNT_PASSWORD as string
	);

	// Accept all cookies
	// await acceptCookies(page, 'all'); // TODO re-enable once maaike enabled cookiebot for BEZOEK-INT.PRIVATE.CLOUD.MEEMOO.BE

	// Check site is still visible:
	await expect(await page.locator('text=Vind een aanbieder')).toBeVisible();

	// Check logged in status
	await expect(await page.locator('.c-avatar__text')).toHaveText('meemoo');

	// Admin should not be visible and beheer should be visible
	const navigationItemTexts = await page
		.locator('.l-app a[class^="Navigation_c-navigation__link"]')
		.allInnerTexts();
	await expect(navigationItemTexts).toContain('Admin');
	await expect(navigationItemTexts).not.toContain('Beheer');

	// Click on request access button for VRT
	const vrtCard = await page.locator('.p-home__results .c-visitor-space-card--name--vrt');
	await expect(vrtCard).toContainText('VRT');
	await vrtCard.locator('.c-button--black').click();

	// Fill in request blade and send
	await fillRequestVisitBlade(page, 'vrt', 'Een geldige reden', undefined, true);

	// Check that we were redirected to the request pending page
	await expect(await page.locator('text=We hebben je aanvraag goed ontvangen')).toBeVisible();
	await expect(await page.locator('.p-visit-requested__content').innerHTML()).toContain('VRT');

	// Go to the homepage
	await page.click('text=Start je bezoek');

	// Check request section is present
	await expect(
		await page.locator('.p-home [class^=LoggedInHome_c-hero__section-title]')
	).toContainText('Aanvragen');

	// Check pending request is visible
	await expect(
		await page.locator(
			'[class^="LoggedInHome_c-hero__requests"] [class^="VisitorSpaceCard_c-visitor-space-card__title"]'
		)
	).toContainText('VRT');

	// Wait for close to save the videos
	await context.close();
});
