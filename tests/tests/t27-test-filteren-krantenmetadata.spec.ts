import { expect, test } from '@playwright/test';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';

import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';

test('T27: Filteren op krant metadata', async ({ page, context }) => {
	const SITE_TRANSLATIONS = await getSiteTranslations();

	/**
	 * Go to the search page ---------------------------------------------------------------
	 */
	const SEARCH_PAGE_TITLE = SITE_TRANSLATIONS.nl['pages/zoeken/index___zoeken-pagina-titel'];
	await goToPageAndAcceptCookies(
		page,
		context,
		`${
			process.env.TEST_CLIENT_ENDPOINT as string
		}/zoeken?format=newspaper&newspaperSeriesName=Wet-%20en%20verordeningsblad%20voor%20de%20bezette%20streken%20van%20België`,
		SEARCH_PAGE_TITLE
	);

	// Tab newspapers should be visible
	const newspaperTab = page.locator('.c-tab--newspaper');
	await expect(newspaperTab).toBeVisible();

	// Should only be one search result
	const tabText = await newspaperTab.innerText();
	expect(tabText).toContain('newspaper\nKrant(1)');

	// Check all search results are newspapers
	const searchResults = page.locator(
		`${moduleClassSelector('c-media-card-list--masonry')} article${moduleClassSelector('c-media-card')}`
	);

	// First newspaper
	const firstNewspaperSearchResult = searchResults.nth(0);
	await expect(firstNewspaperSearchResult).toBeVisible();
	await expect(firstNewspaperSearchResult).toContainText('newspaper'); // Icon
	await expect(firstNewspaperSearchResult).toContainText('h98z893q54');

	// Wait for close to save the videos
	await context.close();
});
