import { expect, test } from '@playwright/test';

import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { moduleClassSelector } from '../helpers/module-class-locator';

test('T26: kranten tab en zoekresultaten', async ({ page, context }) => {
	const SITE_TRANSLATIONS = await getSiteTranslations();

	/**
	 * Go to the search page ---------------------------------------------------------------
	 */
	const SEARCH_PAGE_TITLE = `${SITE_TRANSLATIONS.nl['pages/zoeken/index___zoeken-pagina-titel']} | ${SITE_TRANSLATIONS.nl['modules/shared/utils/seo/create-page-title/create-page-title___bezoekertool']}`;
	await goToPageAndAcceptCookies(
		page,
		`${process.env.TEST_CLIENT_ENDPOINT as string}/zoeken`,
		SEARCH_PAGE_TITLE
	);

	// Tab newspapers should be visible
	const newspaperTab = page.locator('.c-tab--newspaper');
	await expect(newspaperTab).toBeVisible();

	// Click on the newspapers tab and wait for search results
	await Promise.all([
		page.waitForResponse((resp) => resp.url().includes('/ie-objects') && resp.status() === 201),
		newspaperTab.click(),
	]);

	// Check all search results are newspapers
	const searchResults = page.locator(
		`${moduleClassSelector('c-media-card-list--masonry')} article${moduleClassSelector(
			'c-media-card'
		)}`
	);

	// First newspaper
	const firstNewspaperSearchResult = searchResults.nth(0);
	await expect(firstNewspaperSearchResult).toBeVisible();
	await expect(firstNewspaperSearchResult).toContainText('no-newspaper'); // Icon
	await expect(firstNewspaperSearchResult).toContainText(
		'De volksmacht: weekblad van de christelijke arbeidersbeweging [ed. Leuven] 1972-07-08'
	);
	await expect(firstNewspaperSearchResult).toContainText('KU Leuven KADOC');

	// Second newspaper
	const secondNewspaperSearchResult = searchResults.nth(1);
	await expect(secondNewspaperSearchResult).toBeVisible();
	await expect(secondNewspaperSearchResult).toContainText('newspaper'); // Icon
	const imageHtml = await secondNewspaperSearchResult.locator('img').getAttribute('src');
	expect(imageHtml).toContain(
		'KULEUVENUNIVERSITEITSBIBLIOTHEEK/47db5019e10d430c821469edcb0773af549acd538a214bfea94986486cabf546/browse.jpg'
	); // Browse image
	await expect(secondNewspaperSearchResult).toContainText(
		'Wet- en verordeningsblad voor de bezette streken van België'
	);
	await expect(secondNewspaperSearchResult).toContainText('KU Leuven Universiteitsbibliotheek');

	// Third newspaper
	const thirdNewspaperSearchResult = searchResults.nth(2);
	await expect(thirdNewspaperSearchResult).toBeVisible();
	await expect(thirdNewspaperSearchResult).toContainText('no-newspaper'); // Icon
	await expect(thirdNewspaperSearchResult).toContainText(
		'Het Annoncenblad van Mol en omliggende dorpen'
	);
	await expect(thirdNewspaperSearchResult).toContainText('Stuifzand');

	// Wait for close to save the videos
	await context.close();
});
