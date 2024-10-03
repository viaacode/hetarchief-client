import { expect, test } from '@playwright/test';

import { fillRequestVisitBlade } from '../helpers/fill-request-visit-blade';
import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';
import { moduleClassSelector } from '../helpers/module-class-locator';

declare const document: any;

test('T03: Test inloggen meemoo-admin + toegang aanvragen tot bezoekersruimte', async ({
	page,
	context,
}) => {
	const SITE_TRANSLATIONS = await getSiteTranslations();

	// Go to the hetarchief homepage
	await goToPageAndAcceptCookies(page);

	// Login cp admin using the meemoo idp
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_MEEMOO_ADMIN_ACCOUNT_USERNAME as string,
		process.env.TEST_MEEMOO_ADMIN_ACCOUNT_PASSWORD as string
	);

	// Check logged in status
	await expect(page.locator('.c-avatar__text')).toHaveText('Admin Meemoo');

	// Admin should be visible and beheer should not be visible
	await expect(page.locator('a.c-dropdown-menu__item', { hasText: 'Admin' })).toHaveCount(1);
	await expect(page.locator('a.c-dropdown-menu__item', { hasText: 'Beheer' })).toHaveCount(0);

	// Wait for dropdown to load
	await new Promise((resolve) => setTimeout(resolve, 2000));

	// Click Bezoek een aanbieder
	await page
		.locator(`a${moduleClassSelector('c-navigation__link--dropdown')}`, {
			hasText: 'Bezoek een aanbieder',
		})
		.first()
		.click();
	await expect(page.locator('a.c-dropdown-menu__item[href="/bezoek"]').first()).toBeVisible();
	await page.locator('a.c-dropdown-menu__item[href="/bezoek"]').first().click();

	// Check page title is the home page
	const expectedSitePageTitle =
		SITE_TRANSLATIONS.nl[
			'modules/visitor-space/views/visitor-spaces-home-page___bezoek-pagina-titel'
		];
	const excpectedSiteTitle =
		SITE_TRANSLATIONS.nl[
			'modules/shared/utils/seo/create-page-title/create-page-title___bezoekertool'
		];
	const expectedTitle = expectedSitePageTitle + ' | ' + excpectedSiteTitle;
	await page.waitForFunction(
		(expectedTitle: string) => document.title === expectedTitle,
		expectedTitle,
		{
			timeout: 10000,
		}
	);

	// Click on request access button for VRT
	const vrtCard = page.locator('.p-home__results .c-visitor-space-card--name--vrt');
	await vrtCard.scrollIntoViewIfNeeded();
	await expect(vrtCard).toBeVisible();
	await vrtCard.locator('.c-button--black').click();

	// Fill in request blade and send
	await fillRequestVisitBlade(page, 'vrt', 'Een geldige reden', undefined, true);

	// Check that we were redirected to the request pending page
	await expect(
		page.locator(
			'text=' +
				SITE_TRANSLATIONS.nl[
					'pages/slug/toegang-aangevraagd/index___we-hebben-je-aanvraag-ontvangen'
				]
		)
	).toBeVisible();
	const accessRequestedBody = await page.locator('.p-visit-requested__content').innerHTML();
	expect(accessRequestedBody).toContain('VRT');

	// Click on 'Bezoek een aanbieder'
	await page
		.locator(`a${moduleClassSelector('c-navigation__link')}`, {
			hasText: 'Bezoek een aanbieder',
		})
		.first()
		.click();
	await new Promise((resolve) => setTimeout(resolve, 2 * 1000));

	// Wait for close to save the videos
	await context.close();
});
