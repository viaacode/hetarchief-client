import { expect, test } from '@playwright/test';

import { getSearchTabBarCounts } from './helpers/get-search-tab-bar-counts';
import { loginUserHetArchiefIdp } from './helpers/login-user-het-archief-idp';

test('T10: Test actieve toegang basisgebruiker', async ({ page, context }) => {
	// GO to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

	// Check homepage title
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});

	// Check the homepage show the correct title for searching maintainers
	await expect(await page.locator('text=Vind een aanbieder')).toBeVisible();

	// Click on login or register
	await page.locator('text=Inloggen of registreren').click();

	// Login with existing user
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_PASSWORD as string
	);

	// Check homepage title
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});

	/**
	 * Go to search page VRT --------------------------------------------------------------------
	 */

	// Click on "start you visit" navigation item
	await page.click('text=Start je zoekopdracht');

	// Wait for results to load
	await page.waitForFunction(
		() =>
			document.querySelectorAll('.p-visitor-space__results .p-media-card-list .c-card')
				.length > 1,
		null,
		{
			timeout: 10000,
		}
	);

	// Check VRT in sub navigation
	const subNavigationTitle = await page.locator(
		'.p-visitor-space [class*="Navigation_c-navigation"] h1'
	);
	await expect(subNavigationTitle).toBeVisible();
	await expect(subNavigationTitle).toContainText('VRT');

	/**
	 * Search on search page --------------------------------------------------------------------
	 */

	// Get tab counts before search
	const countsBeforeSearch = await getSearchTabBarCounts(page);

	// Enter search term
	const SEARCH_TERM = 'dublin';
	const searchField = await page.locator('.c-tags-input__input-container');
	await searchField.click();
	await searchField.type(SEARCH_TERM);
	await searchField.press('Enter');

	// Check green pill exists with search term inside
	const pill = await page.locator('.c-tags-input__multi-value .c-tag__label');
	await expect(pill).toBeVisible();
	await expect(pill).toContainText(SEARCH_TERM);

	// Check tab counts decreased
	const countsAfterSearchByText = await getSearchTabBarCounts(page);

	// Expect counts to have gone down, or stay the same
	if (countsBeforeSearch.all > 0) {
		// Only check counts if there are at least a few items
		expect(countsBeforeSearch.all > countsAfterSearchByText.all).toBeTruthy();
		expect(countsBeforeSearch.video >= countsAfterSearchByText.video).toBeTruthy();
		expect(countsBeforeSearch.audio >= countsAfterSearchByText.audio).toBeTruthy();
	}

	// Remove search term
	await page.click('.c-tags-input__multi-value .c-tag__close');

	// Check search term is removed
	const searchInput = await page.locator('.c-tags-input__input-container');
	await expect(await searchInput.innerHTML()).not.toContain(SEARCH_TERM);

	// Check counts are back to all
	const countsAfterClearSearchTerm = await getSearchTabBarCounts(page);
	await expect(countsAfterClearSearchTerm.all).not.toBeNaN();
	await expect(countsAfterClearSearchTerm.all).toEqual(countsBeforeSearch.all);
	await expect(countsAfterClearSearchTerm.video).toEqual(countsBeforeSearch.video);
	await expect(countsAfterClearSearchTerm.audio).toEqual(countsBeforeSearch.audio);

	// Filter by creation date
	await page.click('text=Creatiedatum');
	await page.fill('.c-menu--visible--default .c-input__field', '1 jan. 2020');
	await page.locator('.c-menu--visible--default').locator('text=Pas toe').click();

	const countsAfterSearchByDate = await getSearchTabBarCounts(page);

	// Expect counts to have gone down, or stay the same
	if (countsBeforeSearch.all > 0) {
		console.log({
			countsBeforeSearch,
			countsAfterSearchByDate,
		});
		// Only check counts if there are at least a few items
		expect(countsBeforeSearch.all > countsAfterSearchByDate.all).toBeTruthy();
		expect(countsBeforeSearch.video >= countsAfterSearchByDate.video).toBeTruthy();
		expect(countsBeforeSearch.audio >= countsAfterSearchByDate.audio).toBeTruthy();
	}

	// Search by language
	// TODO after more items with languages have been added to the seed

	// Clear search query
	await page.click('text=Wis je volledige zoekopdracht');

	// Check filter tags are removed
	const searchInput1 = await page.locator('.c-tags-input__input-container');
	await expect(await searchInput1.innerHTML()).not.toContain('c-tag__label');
	await expect(await searchInput1.innerHTML()).not.toContain('2020');

	// Check search result counts are equal to before the search
	const countsAfterClearAll = await getSearchTabBarCounts(page);
	await expect(countsAfterClearAll.all).not.toBeNaN();
	await expect(countsAfterClearAll.all).toEqual(countsBeforeSearch.all);
	await expect(countsAfterClearAll.video).toEqual(countsBeforeSearch.video);
	await expect(countsAfterClearAll.audio).toEqual(countsBeforeSearch.audio);

	/**
	 * Advanced filter
	 */

	// Set creation date filter
	await page.click('text=Geavanceerd');
	const filter1TypeSelect = await page.locator('.c-react-select', { hasText: 'Alles' });
	await filter1TypeSelect.click();
	await filter1TypeSelect.locator('text=Creatiedatum').click();
	await page.fill(
		'.c-menu--visible--default .react-datepicker__input-container .c-input__field',
		'1 jan. 2020'
	);

	// Set duration filter
	await page.click('text=Voeg filter toe');
	const filter2TypeSelect = await page.locator('.c-react-select', { hasText: 'Alles' });
	await filter2TypeSelect.click();
	await filter1TypeSelect.locator('text=Duurtijd').click();
	const filter2OperatorSelect = await page.locator('.c-menu--visible--default .c-react-select', {
		hasText: 'Korter dan',
	});
	await filter2OperatorSelect.click();
	await filter2OperatorSelect.locator('text=Langer dan').click();
	await page.locator('.c-menu--visible--default .c-input__field[step="1"]').fill('00:01:00');

	// TODO add filter on language once more items with languages are added

	// Click apply button
	await page.locator('.c-menu--visible--default').locator('text=Pas toe').click();

	// Check advanced filters are added
	const searchInput3 = await page.locator('.c-tags-input__control');
	await expect(await searchInput3.innerHTML()).toContain('Creatiedatum');
	await expect(await searchInput3.innerHTML()).toContain('01.01.2020');
	await expect(await searchInput3.innerHTML()).toContain('Duurtijd');
	await expect(await searchInput3.innerHTML()).toContain('langer dan');
	await expect(await searchInput3.innerHTML()).toContain('00:01:00');

	// Expect counts to have gone down, or stay the same
	const countsAfterAdvancedSearch = await getSearchTabBarCounts(page);
	if (countsBeforeSearch.all > 0) {
		// Only check counts if there are at least a few items
		expect(countsBeforeSearch.all > countsAfterAdvancedSearch.all).toBeTruthy();
		expect(countsBeforeSearch.video >= countsAfterAdvancedSearch.video).toBeTruthy();
		expect(countsBeforeSearch.audio >= countsAfterAdvancedSearch.audio).toBeTruthy();
	}

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
	await page.locator('[class^="Toggle_c-toggle__option__"]').locator('text=list-view').click();

	// Check view changed
	const searchResults = await page.locator('.p-visitor-space__results');
	await expect(await searchResults.innerHTML()).toContain(
		'MediaCardList_c-media-card-list--two-columns__'
	);
	await expect(await searchResults.innerHTML()).not.toContain(
		'MediaCardList_c-media-card-list--masonry__'
	);

	// Click first search result
	const firstResult = await page.locator('.c-card').first();
	const title = await (await firstResult.locator('.c-card__title-wrapper')).innerText();
	await firstResult.click();

	// Wait for detail page to load
	await expect.poll(() => page.url()).toContain('/vrt/');
	await expect.poll(() => page.title()).toContain(' | ');

	// Check if title is the same as the click item in the search results
	expect(await page.title()).toContain(title);

	// Wait for close to save the videos
	await context.close();
});
