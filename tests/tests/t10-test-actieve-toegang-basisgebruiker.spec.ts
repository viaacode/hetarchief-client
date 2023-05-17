import { expect, test } from '@playwright/test';

import { acceptCookies } from '../helpers/accept-cookies';
import { getSearchTabBarCounts } from '../helpers/get-search-tab-bar-counts';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';
import { waitForSearchResults } from '../helpers/wait-for-search-results';

test('T10: Test actieve toegang basisgebruiker', async ({ page, context }) => {
	// GO to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

	// Check homepage title
	await page.waitForFunction(() => document.title === 'hetarchief.be', null, {
		timeout: 10000,
	});

	// // Accept all cookies
	// await acceptCookies(page, 'all'); //Enable when on int

	// Login with existing user
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_PASSWORD as string
	);

	// Check homepage title
	await page.waitForFunction(() => document.title === 'hetarchief.be', null, {
		timeout: 10000,
	});

	/**
	 * Go to search page VRT --------------------------------------------------------------------
	 */
	// Check navbar exists
	await expect(page.locator('nav[class^=Navigation_c-navigation]')).toBeVisible();
	await expect(page.locator('a[href="/bezoek"] div[class^="c-badge"]').first()).toContainText(
		'1'
	);
	// Click on "Bezoek een aanbieder" navigation item
	await page.click('text=Bezoek een aanbieder');

	const subNavItems = await page
		.locator('div[class^="c-menu c-menu--default"]')
		.first()
		.locator('a')
		.allInnerTexts();
	await expect(subNavItems).toContain('Zoeken naar bezoekersruimtes');
	await expect(subNavItems[1]).toMatch(/VRT.*/);
	await page.click('text=Zoeken naar bezoekersruimtes');
	// Wait for search page to be ready
	// await waitForSearchResults(page);
	await new Promise((resolve) => setTimeout(resolve, 1 * 1000));

	// Check VRT in actieve bezoekersruimtes
	await expect(
		await page
			.locator('div[class^="LoggedInHome_c-hero__access-cards"]  h2')
			.first()
			.allInnerTexts()
	).toContain('VRT');

	await page.locator('text=Start je zoekopdracht').click();

	// Check VRT is the active space
	await expect(
		await page
			.locator('p[class^=VisitorSpaceDropdown_c-visitor-spaces-dropdown__active-label]')
			.innerText()
	).toEqual('VRT');

	// Check every object is from VRT
	const objectsSubtitles = await page
		.locator('article > section.c-card__bottom-wrapper > div:nth-child(3) > a')
		.allInnerTexts();
	const maintainers = objectsSubtitles.map((sub) => sub.slice(0, 3));

	await Promise.all(
		maintainers.map(async (maintainer) => {
			await expect(maintainer).toEqual('VRT');
		})
	);
	// Go to the public catalogue
	await page.locator('li[class^=VisitorSpaceDropdown_c-visitor-spaces-dropdown__active]').click();

	await page
		.locator(
			'ul[class^="u-list-reset VisitorSpaceDropdown_c-visitor-spaces-dropdown__list"] li',
			{ hasText: 'Publieke catalogus' } // TODO: we might have to change the text
		)
		.click();

	// Check the purple banner
	await expect(
		await page.locator('span.p-visitor-space__temp-access-label').allInnerTexts()
	).toEqual(['Je hebt tijdelijke toegang tot het materiaal van VRT.']);
	/**
	 * Search on search page --------------------------------------------------------------------
	 */

	// Get tab counts before search
	let countsBeforeSearch = await getSearchTabBarCounts(page);

	// Enter search term
	const SEARCH_TERM = 'brugge';
	const searchField = await page.locator('.c-tags-input__input-container').first();
	await searchField.click();
	await searchField.type(SEARCH_TERM);
	await searchField.press('Enter');

	// Check green pill exists with search term inside
	let pill = await page.locator('.c-tags-input__multi-value .c-tag__label');
	await expect(pill).toBeVisible();
	await expect(pill).toContainText(SEARCH_TERM);

	// Check tab counts decreased
	let countsAfterSearchByText = await getSearchTabBarCounts(page);

	// Expect counts to have gone down, or stay the same
	if (countsBeforeSearch.all > 0) {
		// Only check counts if there are at least a few items
		expect(countsBeforeSearch.all > countsAfterSearchByText.all).toBeTruthy();
		expect(countsBeforeSearch.video >= countsAfterSearchByText.video).toBeTruthy();
		expect(countsBeforeSearch.audio >= countsAfterSearchByText.audio).toBeTruthy();
	}

	// Check item contains search term
	const markedWord = await page
		.locator("[class^='MediaCardList_c-media-card-list__content__'] article mark")
		.first()
		.innerText();
	await expect(markedWord.toLowerCase()).toEqual(SEARCH_TERM);

	// Remove search term
	await page.click('.c-tags-input__multi-value .c-tag__close');

	// Check search term is removed
	const searchInput = await page.locator('.c-tags-input__input-container').first();
	await expect(await searchInput.innerHTML()).not.toContain(SEARCH_TERM);

	// Check counts are back to all
	const countsAfterClearSearchTerm = await getSearchTabBarCounts(page);
	await expect(countsAfterClearSearchTerm.all).not.toBeNaN();
	await expect(countsAfterClearSearchTerm.all).toEqual(countsBeforeSearch.all);
	await expect(countsAfterClearSearchTerm.video).toEqual(countsBeforeSearch.video);
	await expect(countsAfterClearSearchTerm.audio).toEqual(countsBeforeSearch.audio);

	/**
	 * Filter using isConsultable on location
	 */

	// Get tab counts before search
	countsBeforeSearch = await getSearchTabBarCounts(page);

	await page
		.locator('span.c-checkbox__label', { hasText: 'Raadpleegbaar via bezoekertool' })
		.click(); //TODO: we might have to change this text

	// Check green pill exists with filter inside
	pill = await page.locator('.c-tags-input__multi-value .c-tag__label');
	await expect(pill).toBeVisible();
	await expect(pill).toContainText('Raadpleegbaar via bezoekertool'); //TODO: we might have to change this text

	// Check tab counts decreased
	countsAfterSearchByText = await getSearchTabBarCounts(page);

	// Expect counts to have gone down, or stay the same
	if (countsBeforeSearch.all > 0) {
		// Only check counts if there are at least a few items
		expect(countsBeforeSearch.all > countsAfterSearchByText.all).toBeTruthy();
		expect(countsBeforeSearch.video >= countsAfterSearchByText.video).toBeTruthy();
		expect(countsBeforeSearch.audio >= countsAfterSearchByText.audio).toBeTruthy();
	}

	/**
	 *  Filter using date
	 */

	// Filter by creation date
	await page.click('text=Creatiedatum');
	await page.fill('.c-menu--visible--default .c-input__field', '1 jan. 2020');
	await page.locator('.c-menu--visible--default').locator('text=Pas toe').click();

	const countsAfterSearchByDate = await getSearchTabBarCounts(page);

	// Expect counts to have gone down, or stay the same
	if (countsBeforeSearch.all > 0) {
		// Only check counts if there are at least a few items
		expect(countsBeforeSearch.all > countsAfterSearchByDate.all).toBeTruthy();
		expect(countsBeforeSearch.video >= countsAfterSearchByDate.video).toBeTruthy();
		expect(countsBeforeSearch.audio >= countsAfterSearchByDate.audio).toBeTruthy();
	}

	// // Search by language
	// // TODO after more items with languages have been added to the seed

	// Clear search query
	await page.click('text=Wis je volledige zoekopdracht');

	// Check filter tags are removed
	const searchInput1 = await page.locator('.c-tags-input__input-container').first();
	await expect(await searchInput1.innerHTML()).not.toContain('.c-tag__label');
	await expect(await searchInput1.innerHTML()).not.toContain('2020');

	// Check search result counts are equal to before the search
	const countsAfterClearAll = await getSearchTabBarCounts(page);
	await expect(countsAfterClearAll.all).not.toBeNaN();
	await expect(countsAfterClearAll.all).toEqual(countsBeforeSearch.all);
	await expect(countsAfterClearAll.video).toEqual(countsBeforeSearch.video);
	await expect(countsAfterClearAll.audio).toEqual(countsBeforeSearch.audio);

	// /**
	//  * Advanced filter
	//  */

	// Set title filter
	await page
		.locator('div.MediaCardList_c-media-card-list__sidebar__aYd_6 button span', {
			hasText: 'Geavanceerd',
		})
		.click();
	const filter1TypeSelect = await page
		.locator('[class^=AdvancedFilterFields_c-advanced-filter-fields] [class^=c-react-select]')
		.first();
	await filter1TypeSelect.locator('[class^=c-react-select__control]').click();
	await filter1TypeSelect.locator('text=Titel').click();
	await page.fill(
		'[class^=AdvancedFilterFields_c-advanced-filter-fields__dynamic-field] #AdvancedFilterFields__value__0',
		'Eerste'
	);

	// Set description filter
	await page.click('text=Voeg filter toe');
	const filter2TypeSelect = await page.locator(
		'div[class*=AdvancedFilterForm_advancedFilterForm] > div:nth-child(3) > div:nth-child(1) > div > div'
	);
	await filter2TypeSelect.locator('[class^=c-react-select__control]').click();
	// Click 'Beschrijving'
	await filter2TypeSelect.locator('#react-select-31-option-0').click();
	await page.fill(
		'[class^=AdvancedFilterFields_c-advanced-filter-fields__dynamic-field] #AdvancedFilterFields__value__1',
		'Schoen'
	);
	// const filter2OperatorSelect = await page.locator('.c-menu--visible--default .c-react-select', {
	// 	hasText: 'Korter dan',
	// });
	// await filter2OperatorSelect.click();
	// await filter2OperatorSelect.locator('text=Langer dan').click();
	// await page.locator('.c-menu--visible--default .c-input__field[step="1"]').fill('00:01:00');

	// // TODO add filter on language once more items with languages are added

	// Click apply button
	await page.locator('.c-menu--visible--default').locator('text=Pas toe').click();

	// Check advanced filters are added
	const searchInput3 = await page.locator('.c-tag-search-bar .c-tags-input__control');
	await expect(await searchInput3.innerHTML()).toContain('Titel');
	await expect(await searchInput3.innerHTML()).toContain('bevat');
	await expect(await searchInput3.innerHTML()).toContain('Eerste');
	await expect(await searchInput3.innerHTML()).toContain('Beschrijving');
	await expect(await searchInput3.innerHTML()).toContain('bevat');
	await expect(await searchInput3.innerHTML()).toContain('Schoen');

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

	// Wait for close to save the videos
	await context.close();
});
