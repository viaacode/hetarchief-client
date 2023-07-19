import { expect, test } from '@playwright/test';

import { acceptCookies } from '../helpers/accept-cookies';
import { acceptTos } from '../helpers/accept-tos';
import { fillRequestVisitBlade } from '../helpers/fill-request-visit-blade';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';

test('T03: Test inloggen meemoo-admin + toegang aanvragen tot bezoekersruimte', async ({
	page,
	context,
}) => {
	// Go to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

	// Check page title is the home page
	await page.waitForFunction(
		() => document.title === 'Homepagina hetarchief | hetarchief.be',
		null,
		{
			timeout: 10000,
		}
	);

	// Accept all cookies
	await acceptCookies(page, 'all'); // TODO: Enable this on INT, comment bcs localhost

	// Login cp admin using the meemoo idp
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_MEEMOO_ADMIN_ACCOUNT_USERNAME as string,
		process.env.TEST_MEEMOO_ADMIN_ACCOUNT_PASSWORD as string
	);

	// Check tos is displayed, scroll down and click accept button
	//await acceptTos(page); // TODO: Enable when on int

	// Check logged in status
	await expect(page.locator('.c-avatar__text')).toHaveText('meemoo');

	// Admin should be visible and beheer should not be visible
	await expect(page.locator('a.c-dropdown-menu__item', { hasText: 'Admin' })).toHaveCount(1);
	await expect(page.locator('a.c-dropdown-menu__item', { hasText: 'Beheer' })).toHaveCount(0);

	// Wait for dropdown to load
	await new Promise((resolve) => setTimeout(resolve, 2000));

	// Click Bezoek een aanbieder
	await page
		.locator('a[class*="Navigation_c-navigation__link--dropdown"]', {
			hasText: 'Bezoek een aanbieder',
		})
		.first()
		.click();
	await expect(
		await page.locator('a.c-dropdown-menu__item[href="/bezoek"]').first()
	).toBeVisible();
	await page.locator('a.c-dropdown-menu__item[href="/bezoek"]').first().click();

	// Check page title is the home page
	// TODO this title probably has to change to Bezoek | hetarchief.be
	await page.waitForFunction(() => document.title === 'Home | hetarchief.be', null, {
		timeout: 10000,
	});

	// Click on request access button for VRT
	const vrtCard = await page.locator('.p-home__results .c-visitor-space-card--name--vrt');
	await vrtCard.scrollIntoViewIfNeeded();
	await expect(vrtCard).toBeVisible();
	await vrtCard.locator('.c-button--black').click();

	// Fill in request blade and send
	await fillRequestVisitBlade(page, 'vrt', 'Een geldige reden', undefined, true);

	// Check that we were redirected to the request pending page
	await expect(page.locator('text=We hebben je aanvraag goed ontvangen')).toBeVisible();
	await expect(await page.locator('.p-visit-requested__content').innerHTML()).toContain('VRT');

	// Click on 'Bezoek een aanbieder'
	await page
		.locator('a[class^=Navigation_c-navigation__link]', { hasText: 'Bezoek een aanbieder' })
		.first()
		.click();
	await new Promise((resolve) => setTimeout(resolve, 2 * 1000));

	// Wait for close to save the videos
	await context.close();
});
