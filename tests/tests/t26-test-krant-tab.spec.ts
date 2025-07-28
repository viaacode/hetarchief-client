import { expect, test } from '@playwright/test';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';

import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { waitForSearchPage } from '../helpers/wait-for-search-page';

test('T26: kranten tab en zoekresultaten', async ({ page, context }) => {
	const SITE_TRANSLATIONS = await getSiteTranslations();

	/**
	 * Go to the search page ---------------------------------------------------------------
	 */
	const SEARCH_PAGE_TITLE = SITE_TRANSLATIONS.nl['pages/zoeken/index___zoeken-pagina-titel'];
	await goToPageAndAcceptCookies(
		page,
		context,
		`${process.env.TEST_CLIENT_ENDPOINT as string}/zoeken`,
		SEARCH_PAGE_TITLE
	);

	// Tab newspapers should be visible
	const newspaperTab = page.locator('.c-tab--newspaper');
	await expect(newspaperTab).toBeVisible();

	// Click on the newspapers tab and wait for search results
	await waitForSearchPage(page, () => newspaperTab.click(), 'newspaper');

	// Check all search results are newspapers
	const searchResultsSelector = `${moduleClassSelector('c-media-card-list--masonry')} article${moduleClassSelector('c-media-card')}`;
	const searchResults = page.locator(searchResultsSelector);

	// First newspaper
	const firstNewspaperSearchResult = searchResults.nth(4);
	await expect(firstNewspaperSearchResult).toBeVisible();
	await expect(firstNewspaperSearchResult).toContainText('newspaper'); // Icon
	await expect(firstNewspaperSearchResult.locator('img')).toBeVisible();
	const firstImageHtml = await firstNewspaperSearchResult.locator('img').getAttribute('src');
	expect(firstImageHtml).toContain(
		'https://media.viaa.be/play/v2/ERFGOEDCELKERF/49db85752f3a489eb700865c0377ffe27e8bf0f883ec40f19d0d57e7ac77c35e/browse-thumb.jpg'
	); // Browse image
	await expect(firstNewspaperSearchResult).toContainText(
		'Het Annoncenblad van Mol en omliggende dorpen'
	);
	await expect(firstNewspaperSearchResult).toContainText('Stuifzand');

	// Second newspaper
	const secondNewspaperSearchResult = searchResults.nth(5);
	await expect(secondNewspaperSearchResult).toBeVisible();
	await expect(secondNewspaperSearchResult).toContainText('newspaper'); // Icon
	const secondImageHtml = await secondNewspaperSearchResult.locator('img').getAttribute('src');
	expect(secondImageHtml).toContain(
		'https://media.viaa.be/play/v2/AMSAB/919c6e60056f44b58d7148316ba0c292ebab58d968584c2dab8e685f20a5cead/keyframes-thumb/keyframes_1_1/keyframe1.jpg'
	); // Browse image
	await expect(secondNewspaperSearchResult).toContainText(
		'De toekomst: weekblad voor de arrondissementen Gent-Eecloo 1911-03-19'
	);
	await expect(secondNewspaperSearchResult).toContainText('Amsab-ISG');

	// Third newspaper
	const thirdNewspaperSearchResult = searchResults.nth(0);
	await expect(thirdNewspaperSearchResult).toBeVisible();
	await expect(thirdNewspaperSearchResult).toContainText('no-newspaper'); // Icon
	await expect(thirdNewspaperSearchResult).toContainText(
		'Voor allen: speciale editie voor het arrondissement Gent-Eeklo 1953-04-26'
	);
	await expect(thirdNewspaperSearchResult).toContainText('Amsab-ISG');

	// Wait for close to save the videos
	await context.close();
});
