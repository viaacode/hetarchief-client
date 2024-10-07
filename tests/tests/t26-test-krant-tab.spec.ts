import { expect, test } from '@playwright/test';

import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { moduleClassSelector } from '../helpers/module-class-locator';

test('T25: Krant metadata', async ({ page, context }) => {
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
		`${moduleClassSelector('c-media-card-list--masonry')} ${moduleClassSelector(
			'c-media-card__header--grid'
		)}`
	);
	for (const searchResult of await searchResults.all()) {
		await expect(searchResult).toBeVisible();
		await expect(searchResult).toContainText('newspaper');
	}

	// Wait for close to save the videos
	await context.close();
});
