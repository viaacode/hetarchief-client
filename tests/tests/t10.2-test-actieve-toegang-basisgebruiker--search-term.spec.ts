import { expect, test } from '@playwright/test';

import { compareSearchTabCountsLessThen } from '../helpers/compareSearchTabCountsLessThen';
import { getSearchTabBarCounts } from '../helpers/get-search-tab-bar-counts';
import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';

test('T10.2: Test actieve toegang basisgebruiker: Zoek term', async ({ page, context }) => {
	const SITE_TRANSLATIONS = await getSiteTranslations();
	const SEARCH_PAGE_TITLE = SITE_TRANSLATIONS.nl['pages/zoeken/index___zoeken-pagina-titel'];

	// GO to the hetarchief homepage
	await goToPageAndAcceptCookies(
		page,
		(process.env.TEST_CLIENT_ENDPOINT as string) + '/zoeken',
		SEARCH_PAGE_TITLE
	);

	// Login with existing user
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_2_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_2_PASSWORD as string,
		SEARCH_PAGE_TITLE
	);

	/**
	 * Search on search page --------------------------------------------------------------------
	 */

	// Get tab counts before search
	const countsBeforeSearch = await getSearchTabBarCounts(page);

	// Enter search term
	const SEARCH_TERM = 'brugge';
	const searchField = page.locator('.c-tags-input__input-container').first();
	await searchField.click();
	await searchField.pressSequentially(SEARCH_TERM);
	await searchField.press('Enter');

	// Check green pill exists with search term inside
	const pill = page.locator('.c-tags-input__multi-value .c-tag__label');
	await expect(pill).toBeVisible();
	await expect(pill).toContainText(SEARCH_TERM);

	// Wait for filtered search results
	await expect
		.poll(async () => await getSearchTabBarCounts(page))
		.not.toEqual(countsBeforeSearch);

	// Check tab counts decreased
	const countsAfterSearchByText = await getSearchTabBarCounts(page);

	// Expect counts to have gone down, or stay the same
	compareSearchTabCountsLessThen(countsBeforeSearch, countsAfterSearchByText);

	// Check item contains search term
	const markedWord = await page
		.locator("[class^='MediaCardList_c-media-card-list__content__'] article mark")
		.first()
		.innerText();
	expect(markedWord.toLowerCase()).toEqual(SEARCH_TERM);

	// Remove search term
	await page.click('.c-tags-input__multi-value .c-tag__close');

	// Wait for filtered search results
	await expect
		.poll(async () => await getSearchTabBarCounts(page))
		.not.toEqual(countsAfterSearchByText);

	// Check search term is removed
	const searchInput = page.locator('.c-tags-input__input-container').first();
	expect(await searchInput.innerHTML()).not.toContain(SEARCH_TERM);

	// Check counts are back to all
	const countsAfterClearSearchTerm = await getSearchTabBarCounts(page);
	expect(countsAfterClearSearchTerm.all).not.toBeNaN();
	expect(countsAfterClearSearchTerm.all).toEqual(countsBeforeSearch.all);
	expect(countsAfterClearSearchTerm.video).toEqual(countsBeforeSearch.video);
	expect(countsAfterClearSearchTerm.audio).toEqual(countsBeforeSearch.audio);
	expect(countsAfterClearSearchTerm.newspaper).toEqual(countsBeforeSearch.newspaper);

	// Wait for close to save the videos
	await context.close();
});
