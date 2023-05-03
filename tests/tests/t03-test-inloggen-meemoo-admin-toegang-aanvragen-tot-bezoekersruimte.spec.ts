import { expect, test } from '@playwright/test';

import { acceptCookies } from '../helpers/accept-cookies';
import { acceptTos } from '../helpers/accept-tos';
import { fillRequestVisitBlade } from '../helpers/fill-request-visit-blade';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';

test.use({
	viewport: { width: 1400, height: 850 },
});
test('T03: Test inloggen meemoo-admin + toegang aanvragen tot bezoekersruimte', async ({
	page,
	context,
}) => {
	// Go to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

	// Check page title is the home page
	await page.waitForFunction(() => document.title === 'bezoekertool', null, {
		timeout: 10000,
	});

	// Accept all cookies
	await acceptCookies(page, 'all');

	// Login cp admin using the meemoo idp
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_MEEMOO_ADMIN_ACCOUNT_USERNAME as string,
		process.env.TEST_MEEMOO_ADMIN_ACCOUNT_PASSWORD as string
	);

	// Check tos is displayed, scroll down and click accept button
	// await acceptTos(page); //It is not displayed

	// Check site is still visible:
	// await expect(page.locator('text=Vind een aanbieder')).toBeVisible();

	// Check logged in status
	await expect(page.locator('.c-avatar__text')).toHaveText('meemoo');

	// Admin should be visible and beheer should not be visible
	// const navigationItemTexts = await page
	// 	.locator('.l-app a[class*="Navigation_c-navigation__link"]')
	// 	.allInnerTexts();
	// await expect(navigationItemTexts).toContain('Admin');
	// await expect(navigationItemTexts).not.toContain('Beheer');

	//Click Bezoek een aanbieder
	await page.locator('text=Bezoek een aanbieder').first().click();
	//Click Bezoek een aanbieder
	await page.locator('text=Zoeken naar bezoekersruimtes').first().click();

	// Click on request access button for VRT
	const vrtCard = await page.locator('.p-home__results .c-visitor-space-card--name--vrt');
	await expect(vrtCard).toContainText('VRT');
	await vrtCard.locator('.c-button--black').click();

	// Fill in request blade and send
	await fillRequestVisitBlade(page, 'vrt', 'Een geldige reden', undefined, true);

	// Check that we were redirected to the request pending page
	await expect(page.locator('text=We hebben je aanvraag goed ontvangen')).toBeVisible();
	await expect(await page.locator('.p-visit-requested__content').innerHTML()).toContain('VRT');

	// Go to the homepage
	await page.click('text=Start je bezoek');

	// Check request section is present
	await expect(
		await page.locator('.p-home [class*="LoggedInHome_c-hero__section-title"]')
	).toContainText('Aanvragen');

	// Check pending request is visible
	await expect(
		await page.locator(
			'[class*="LoggedInHome_c-hero__requests"] [class*="VisitorSpaceCard_c-visitor-space-card__title"]'
		)
	).toContainText('VRT');

	// Wait for close to save the videos
	await context.close();
});
