import { expect, test } from '@playwright/test';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';

import { IconName } from '../consts/icon-names';
import { compareSearchTabCountsLessThen } from '../helpers/compareSearchTabCountsLessThen';
import { getSearchTabBarCounts } from '../helpers/get-search-tab-bar-counts';
import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';

test('T10.4: Test actieve toegang basisgebruiker: Release date filter', async ({
	page,
	context,
}) => {
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

	// Get tab counts before search
	const countsBeforeSearch = await getSearchTabBarCounts(page);

	/**
	 *  Filter using release date filter
	 */

	// Enter a date
	await page.click(
		'text=' +
			SITE_TRANSLATIONS.nl['modules/visitor-space/const/visitor-space-filters___uitgavedatum']
	);
	await page.fill('#c-filter-form--releaseDate #releaseDate', '01/01/2020');

	// Click the submit button for the filter
	const submitFilterButton = page.locator(
		'#c-filter-form--releaseDate ' + moduleClassSelector('c-filter-form__submit')
	);
	await submitFilterButton.scrollIntoViewIfNeeded();
	await expect(submitFilterButton).toBeVisible();
	await expect(submitFilterButton).toContainText(
		SITE_TRANSLATIONS.nl[
			'modules/visitor-space/components/filter-menu/filter-form/filter-form___pas-toe'
		]
	);
	await submitFilterButton.click();

	const countsAfterSearchByDate = await getSearchTabBarCounts(page);

	// Expect counts to have gone down, or stay the same
	compareSearchTabCountsLessThen(countsBeforeSearch, countsAfterSearchByDate);

	// Search by language
	// TODO after more items with languages have been added to the seed

	// Clear search query
	const clearSearchButton = page.locator('.c-tag-search-bar .c-tags-input__indicator-icon', {
		hasText: IconName.Times,
	});
	await expect(clearSearchButton).toBeVisible();
	await clearSearchButton.click();

	// Check filter tags are removed
	const searchInput1 = page.locator('.c-tags-input__input-container').first();
	expect(await searchInput1.innerHTML()).not.toContain('.c-tag__label');
	expect(await searchInput1.innerHTML()).not.toContain('2020');

	// Check search result counts are equal to before the search
	const countsAfterClearAll = await getSearchTabBarCounts(page);
	expect(countsAfterClearAll.all).not.toBeNaN();
	expect(countsAfterClearAll.all).toEqual(countsBeforeSearch.all);
	expect(countsAfterClearAll.video).toEqual(countsBeforeSearch.video);
	expect(countsAfterClearAll.audio).toEqual(countsBeforeSearch.audio);
	expect(countsAfterClearAll.newspaper).toEqual(countsBeforeSearch.newspaper);

	// Wait for close to save the videos
	await context.close();
});
