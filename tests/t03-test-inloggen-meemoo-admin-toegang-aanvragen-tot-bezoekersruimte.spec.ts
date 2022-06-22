import { expect, test } from '@playwright/test';

import { acceptCookies } from './helpers/accept-cookies';
import { loginUserHetArchiefIdp } from './helpers/login-user-het-archief-idp';
import { loginUserMeemooIdp } from './helpers/login-user-meemoo-idp';

test('T03: Test inloggen meemoo-admin + toegang aanvragen tot bezoekersruimte', async ({
	page,
	context,
}) => {
	// Go to the hetarchief homepage
	await page.goto(process.env.TEST_ENDPOINT as string);

	// Check page title is the home page
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});

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
	const vrtCard = await page.locator('.c-visitor-space-card--name--vrt');
	await expect(vrtCard).toContainText('VRT');
	await vrtCard.locator('.c-button--black').click();

	// Check the request visit blade title is visible
	const bladeTitle = await page.locator(
		'[class^="c-request-access-blade"] [class^="RequestAccessBlade_c-request-access-blade__title"]'
	);
	await expect(bladeTitle).toBeVisible();
	await expect(bladeTitle).toContainText('Vraag toegang aan');

	// Check the space info shows VRT
	await expect(
		await page.locator('[class^="SpacePreview_c-space-preview__summary"]').innerHTML()
	).toContain('VRT');

	// Fill the form
	await page.fill('[name="requestReason"]', 'Een geldige reden');
	await page.check('[name="acceptTerms"]');

	// Click the send button
	await page.click('text=Verstuur');

	// Check that we were redirected to the request pending page
	await expect(await page.locator('text=We hebben je aanvraag goed ontvangen')).toBeVisible();

	// Go to the homepage
	await page.click('text=Start je bezoek');

	// Check request section is present
	await expect(
		await page.locator('.p-home [class^=VisitorSpaceCard_c-visitor-space-card__title--flat]')
	).toContainText('Aanvragen');

	// Check pending request is visible
	await expect(
		await page.locator('[class^="VisitorSpaceCard_c-visitor-space-card__title--flat"]')
	).toContainText('VRT');

	// Wait for close to save the videos
	await context.close();
});
