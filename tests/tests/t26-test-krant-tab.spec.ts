import { expect, test } from '@playwright/test';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';

import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';

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
	await Promise.all([
		page.waitForResponse(async (resp) => {
			if (resp.url().includes('/ie-objects')) {
				const postData = resp.request().postData();
				console.log('postData: ', postData);
			}
			return resp.url().includes('/ie-objects') && resp.status() === 201;
		}),
		newspaperTab.click(),
	]);

	// Check all search results are newspapers
	const searchResults = page.locator(
		`${moduleClassSelector('c-media-card-list--masonry')} article${moduleClassSelector('c-media-card')}`
	);

	// First newspaper
	const firstNewspaperSearchResult = searchResults.nth(0);
	await expect(firstNewspaperSearchResult).toBeVisible();
	await expect(firstNewspaperSearchResult).toContainText('newspaper'); // Icon
	console.log('first element: ', await firstNewspaperSearchResult.innerHTML());
	const firstImageHtml = await firstNewspaperSearchResult.locator('img').getAttribute('src');
	expect(firstImageHtml).toContain(
		'https://media.viaa.be/play/v2/AMSAB/919c6e60056f44b58d7148316ba0c292ebab58d968584c2dab8e685f20a5cead/keyframes-thumb/keyframes_1_1/keyframe1.jpg'
	); // Browse image
	await expect(firstNewspaperSearchResult).toContainText(
		'De toekomst: weekblad voor de arrondissementen Gent-Eecloo 1911-03-19'
	);
	await expect(firstNewspaperSearchResult).toContainText('Amsab-ISG');

	// Second newspaper
	const secondNewspaperSearchResult = searchResults.nth(1);
	await expect(secondNewspaperSearchResult).toBeVisible();
	await expect(secondNewspaperSearchResult).toContainText('newspaper'); // Icon
	const secondImageHtml = await secondNewspaperSearchResult.locator('img').getAttribute('src');
	expect(secondImageHtml).toContain(
		'https://media.viaa.be/play/v2/AMSAB/c12bc592b2c44facb24ca7d75deeae9630563c35b2884b75b4b12aced9ac2fb8/keyframes-thumb/keyframes_1_1/keyframe1.jpg'
	); // Browse image
	await expect(secondNewspaperSearchResult).toContainText(
		'Voor allen: weekblad voor het arrondissement Ieper 1953-09-20'
	);
	await expect(secondNewspaperSearchResult).toContainText('Amsab-ISG');

	// Third newspaper
	const thirdNewspaperSearchResult = searchResults.nth(2);
	await expect(thirdNewspaperSearchResult).toBeVisible();
	await expect(thirdNewspaperSearchResult).toContainText('no-newspaper'); // Icon
	await expect(thirdNewspaperSearchResult).toContainText(
		'Voor allen: speciale editie voor het arrondissement Gent-Eeklo 1953-04-26'
	);
	await expect(thirdNewspaperSearchResult).toContainText('Amsab-ISG');

	// Wait for close to save the videos
	await context.close();
});
