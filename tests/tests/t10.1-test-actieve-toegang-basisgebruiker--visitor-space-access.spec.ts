import { expect, test } from '@playwright/test';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';

import { checkNumberOfVisitorSpacesBadge } from '../helpers/check-number-of-visitor-spaces-badge';
import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { goToPublicCatalogOnSearchPage } from '../helpers/go-to-public-catalog-on-search-page';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';

test('T10.1: Test actieve toegang basisgebruiker: Bezoekersruimte toegang', async ({
	page,
	context,
}) => {
	const SITE_TRANSLATIONS = await getSiteTranslations();

	// GO to the hetarchief homepage
	await goToPageAndAcceptCookies(page, process.env.TEST_CLIENT_ENDPOINT as string);

	// Login with existing user
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_2_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_2_PASSWORD as string
	);

	/**
	 * Go to search page VRT --------------------------------------------------------------------
	 */
	// Check navbar exists
	await checkNumberOfVisitorSpacesBadge(page, 1);

	// Click on "Bezoek een aanbieder" navigation item
	await page.click('text=Bezoek een aanbieder'); // This text comes from the navigation item from the database, so we can't use the SITE_TRANSLATIONS

	// Check dropdown menu is visible
	const visitorSpaceDropdown =
		moduleClassSelector('c-navigation__list-flyout') + ' div.c-menu--visible--default';
	await expect(page.locator(visitorSpaceDropdown).first()).toBeVisible();

	await new Promise((resolve) => setTimeout(resolve, 1000));

	// Check entries in dropdown match expected entries
	const openedDropdown = page.locator('.c-menu--visible--default');
	const subNavItems = await openedDropdown.locator('a').allInnerTexts();
	const searchForOrganisationsLabel =
		SITE_TRANSLATIONS.nl[
			'modules/navigation/components/navigation/navigation___alle-bezoekersruimtes'
		];
	expect(subNavItems[0]).toContain(searchForOrganisationsLabel); // This text comes from the navigation item from the database, so we can't use the SITE_TRANSLATIONS
	expect(subNavItems[1]).toContain('VRT');

	// Click the "search for organisations" link in the dropdown
	const searchForOrganisationsLink = openedDropdown.locator('a', {
		hasText: searchForOrganisationsLabel,
	});
	await expect(searchForOrganisationsLink).toBeVisible();
	await searchForOrganisationsLink.click();

	// Wait for search page to be ready
	// await waitForSearchResults(page);
	await new Promise((resolve) => setTimeout(resolve, 2 * 1000));

	// Expect approved visitor space card to be visible
	const visitorSpaceCards = page.locator(moduleClassSelector('c-hero__access-cards'));
	await expect(visitorSpaceCards).toBeVisible();

	// Check VRT in active organisations
	const activeTexts = await visitorSpaceCards.allInnerTexts();
	expect(activeTexts.join(' ')).toContain('VRT');

	const startSearchLabel =
		SITE_TRANSLATIONS.nl[
			'modules/shared/components/visitor-space-card/visitor-space-card-controls/visitor-space-card-controls___bezoek-dit-digitaal-archief'
		];
	const startSearchButton = page.locator(`text=${startSearchLabel}`);
	await expect(startSearchButton).toBeVisible();
	await startSearchButton.click();

	// Check VRT is the active space
	const activeVisitorSpaceName = page.locator(
		moduleClassSelector('c-visitor-spaces-dropdown__active-label')
	);
	await expect(activeVisitorSpaceName).toHaveText('VRT');

	// Check every object is from VRT
	const objectsSubtitles = await page
		.locator('article > section.c-card__bottom-wrapper > div:nth-child(3) > a')
		.allInnerTexts();
	const maintainers = objectsSubtitles.map((sub) => sub.slice(0, 3));

	await Promise.all(
		maintainers.map(async (maintainer) => {
			expect(maintainer).toEqual('VRT');
		})
	);

	// Go to the public catalog
	await goToPublicCatalogOnSearchPage(page);

	// Check the purple banner
	const tempAccessLabel =
		SITE_TRANSLATIONS.nl[
			'modules/visitor-space/components/visitor-space-search-page/visitor-space-search-page___tijdelijke-toegang'
		];
	expect(await page.locator('span.p-visitor-space__temp-access-label').allInnerTexts()).toEqual([
		`${tempAccessLabel} VRT.`,
	]);

	// Wait for close to save the videos
	await context.close();
});
