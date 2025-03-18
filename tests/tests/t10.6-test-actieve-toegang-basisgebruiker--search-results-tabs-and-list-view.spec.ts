import { expect, test } from '@playwright/test';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';

import { IconName } from '../consts/icon-names';
import { getSearchTabBarCounts } from '../helpers/get-search-tab-bar-counts';
import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';

test('T10.6: Test actieve toegang basisgebruiker: zoek resultaten tabs en lijst weergave', async ({
	page,
	context,
}) => {
	const SITE_TRANSLATIONS = await getSiteTranslations();
	const SEARCH_PAGE_TITLE = SITE_TRANSLATIONS.nl['pages/zoeken/index___zoeken-pagina-titel'];

	// GO to the hetarchief homepage
	await goToPageAndAcceptCookies(
		page,
		context,
		`${process.env.TEST_CLIENT_ENDPOINT as string}/zoeken?format=all&zoekterm=bewegend%20beeld`,
		SEARCH_PAGE_TITLE
	);

	// Switch to video tab
	await page.click('.c-tab--video');

	// Check no audio cards are shown
	const audioCardsCount = await page.locator('.c-card img[src~="/images/waveform.svg"]').count();
	expect(audioCardsCount).toEqual(0);

	// Switch to video tab
	await page.click('.c-tab--all');

	// Check all results are shown
	const counts = await getSearchTabBarCounts(page);
	const cardsCount = await page.locator('.c-card').count();
	expect(cardsCount).toEqual(counts.all);

	// TODO go to next page => not enough search results

	// Switch to list view
	const listToggleButton = page.locator(moduleClassSelector('c-toggle__option'), {
		hasText: IconName.ListView,
	});
	await expect(listToggleButton).toBeVisible();
	await listToggleButton.click();

	// Check view changed
	const searchResults = page.locator('.p-visitor-space__results');
	expect(await searchResults.innerHTML()).toContain(
		'MediaCardList_c-media-card-list--two-columns__'
	);
	expect(await searchResults.innerHTML()).not.toContain(
		'MediaCardList_c-media-card-list--masonry__'
	);

	// Click first search result
	const firstResult = page.locator('.c-card a').first();
	await firstResult.click();

	// Wait for detail page to load
	await expect.poll(() => page.url(), { timeout: 10000 }).toContain('/stadsarchief-ieper/');

	// Wait for close to save the videos
	await context.close();
});
