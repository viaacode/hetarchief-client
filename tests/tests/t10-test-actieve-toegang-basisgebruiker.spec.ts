import { expect, test } from '@playwright/test';

import { getSearchTabBarCounts } from '../helpers/get-search-tab-bar-counts';
import { getSiteTranslations, Locale } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';
import { moduleClassSelector } from '../helpers/module-class-locator';

declare const document: any;

test('T10: Test actieve toegang basisgebruiker', async ({ page, context }) => {
	const SITE_TRANSLATIONS = await getSiteTranslations();

	// GO to the hetarchief homepage
	await goToPageAndAcceptCookies(page);

	// Login with existing user
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_PASSWORD as string,
		undefined,
		Locale.Nl,
		SITE_TRANSLATIONS
	);

	// Check homepage title
	await page.waitForFunction(
		() => document.title === 'Homepagina hetarchief | hetarchief.be',
		null,
		{
			timeout: 10000,
		}
	);

	/**
	 * Go to search page VRT --------------------------------------------------------------------
	 */
	// Check navbar exists
	await expect(page.locator(`nav${moduleClassSelector('c-navigation')}`)).toBeVisible();
	await expect(
		page.locator(`a[href="/bezoek"] div${moduleClassSelector('c-badge')}`).first()
	).toContainText('1');
	// Click on "Bezoek een aanbieder" navigation item
	await page.click('text=Bezoek een aanbieder');

	// Check dropdown menu is visible
	await expect(
		page
			.locator(
				`${moduleClassSelector(
					'Navigation_c-navigation__list-flyout'
				)} div[class*="c-menu--default"]`
			)
			.first()
	).toBeVisible();

	await new Promise((resolve) => setTimeout(resolve, 1000));

	// Check entries in dropdown match expected entries
	const subNavItems = await page
		.locator(`div${moduleClassSelector('c-menu c-menu--default')}`)
		.first()
		.locator('a')
		.allInnerTexts();
	expect(subNavItems[0]).toContain('Zoeken naar aanbieders');
	expect(subNavItems[1]).toContain('VRT');
	await page.click('text=Zoeken naar aanbieders');
	// Wait for search page to be ready
	// await waitForSearchResults(page);
	await new Promise((resolve) => setTimeout(resolve, 2 * 1000));

	// Expect approved visitor space card to be visible
	await expect(page.locator(`div${moduleClassSelector('c-hero__access-cards')} `)).toBeVisible();

	// Check VRT in actieve aanbieders
	expect(
		page
			.locator(`div${moduleClassSelector('c-hero__access-cards')}  h2`)
			.first()
			.allInnerTexts()
	).toContain('VRT');

	await page.locator('text=Start je zoekopdracht').click();

	// Check VRT is the active space
	expect(
		page
			.locator(
				`p${moduleClassSelector(
					'VisitorSpaceDropdown_c-visitor-spaces-dropdown__active-label'
				)}`
			)
			.innerText()
	).toEqual('VRT');

	// Check every object is from VRT
	const objectsSubtitles = await page
		.locator('article > section.c-card__bottom-wrapper > div:nth-child(3) > a')
		.allInnerTexts();
	const maintainers = objectsSubtitles.map((sub) => sub.slice(0, 3));

	await Promise.all(
		maintainers.map(async (maintainer) => {
			expect(maintainer).toEqual('VRT');
		})
	);
	const countsBeforePublic = await getSearchTabBarCounts(page);
	// Go to the public catalog
	await page.locator(`li${moduleClassSelector('c-visitor-spaces-dropdown__active')}`).click();

	await page
		.locator(
			`ul${moduleClassSelector(
				'u-list-reset VisitorSpaceDropdown_c-visitor-spaces-dropdown__list'
			)} li`,
			{ hasText: 'Publieke catalogus' } // TODO: we might have to change the text
		)
		.click();

	// Wait for user to be in the public catalog
	await expect
		.poll(async () => await getSearchTabBarCounts(page))
		.not.toEqual(countsBeforePublic);

	// Check the purple banner
	expect(page.locator('span.p-visitor-space__temp-access-label').allInnerTexts()).toEqual([
		'Je hebt tijdelijke toegang tot het materiaal van VRT.',
	]);
	/**
	 * Search on search page --------------------------------------------------------------------
	 */

	// Get tab counts before search
	let countsBeforeSearch = await getSearchTabBarCounts(page);

	// Enter search term
	const SEARCH_TERM = 'brugge';
	const searchField = page.locator('.c-tags-input__input-container').first();
	await searchField.click();
	await searchField.type(SEARCH_TERM);
	await searchField.press('Enter');

	// Check green pill exists with search term inside
	let pill = page.locator('.c-tags-input__multi-value .c-tag__label');
	await expect(pill).toBeVisible();
	await expect(pill).toContainText(SEARCH_TERM);

	// Wait for filtered search results
	await expect
		.poll(async () => await getSearchTabBarCounts(page))
		.not.toEqual(countsBeforeSearch);

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

	/**
	 * Filter using isConsultable on location
	 */

	// Get tab counts before search
	countsBeforeSearch = await getSearchTabBarCounts(page);

	await page
		.locator('span.c-checkbox__label', { hasText: 'Ter plaatste kijken & luisteren' })
		.click(); //TODO: we might have to change this text

	// Check green pill exists with filter inside
	pill = page.locator('.c-tags-input__multi-value .c-tag__label');
	await expect(pill).toBeVisible();
	await expect(pill).toContainText('Ter plaatste kijken & luisteren'); //TODO: we might have to change this text

	// Wait for filtered search results
	await expect
		.poll(async () => await getSearchTabBarCounts(page))
		.not.toEqual(countsBeforeSearch);

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
	await page
		.locator(`.c-menu--visible--default ${moduleClassSelector('c-filter-form__submit')}`, {
			hasText: 'Pas toe',
		})
		.click();

	const countsAfterSearchByDate = await getSearchTabBarCounts(page);

	// Expect counts to have gone down, or stay the same
	if (countsBeforeSearch.all > 0) {
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
	const searchInput1 = await page.locator('.c-tags-input__input-container').first();
	expect(await searchInput1.innerHTML()).not.toContain('.c-tag__label');
	expect(await searchInput1.innerHTML()).not.toContain('2020');

	// Check search result counts are equal to before the search
	const countsAfterClearAll = await getSearchTabBarCounts(page);
	expect(countsAfterClearAll.all).not.toBeNaN();
	expect(countsAfterClearAll.all).toEqual(countsBeforeSearch.all);
	expect(countsAfterClearAll.video).toEqual(countsBeforeSearch.video);
	expect(countsAfterClearAll.audio).toEqual(countsBeforeSearch.audio);

	// /**
	//  * Advanced filter
	//  */

	// Set title filter
	await page
		.locator('div.MediaCardList_c-media-card-list__sidebar__aYd_6 button span', {
			hasText: 'Geavanceerd',
		})
		.click();
	const filter1TypeSelect = page
		.locator(
			`${moduleClassSelector(
				'AdvancedFilterFields_c-advanced-filter-fields'
			)} [class^=c-react-select]`
		)
		.first();
	await filter1TypeSelect.locator(moduleClassSelector('c-react-select__control')).click();
	await filter1TypeSelect.locator('text=Titel').click();
	await page.fill(
		`${moduleClassSelector(
			'AdvancedFilterFields_c-advanced-filter-fields__dynamic-field'
		)} #AdvancedFilterFields__value__0`,
		'Eerste'
	);

	// Set description filter
	await page.click('text=Voeg filter toe');
	const filter2TypeSelect = page.locator(
		'div[class*=AdvancedFilterForm_advancedFilterForm] > div:nth-child(3) > div:nth-child(1) > div > div'
	);
	await filter2TypeSelect.locator(moduleClassSelector('c-react-select__control')).click();
	// Click 'Beschrijving'
	await filter2TypeSelect.locator('#react-select-14-option-0').click();
	await page.fill(
		`${moduleClassSelector(
			'AdvancedFilterFields_c-advanced-filter-fields__dynamic-field'
		)} #AdvancedFilterFields__value__1`,
		'Schoen'
	);

	// TODO add filter on language once more items with languages are added

	// Click apply button
	await page.locator('.c-menu--visible--default').locator('text=Pas toe').click();

	// Check advanced filters are added
	const searchInput3 = page.locator('.c-tag-search-bar .c-tags-input__control');
	expect(await searchInput3.innerHTML()).toContain('Titel');
	expect(await searchInput3.innerHTML()).toContain('bevat');
	expect(await searchInput3.innerHTML()).toContain('Eerste');
	expect(await searchInput3.innerHTML()).toContain('Beschrijving');
	expect(await searchInput3.innerHTML()).toContain('bevat');
	expect(await searchInput3.innerHTML()).toContain('Schoen');

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
	await page.locator(moduleClassSelector('c-toggle__option__')).locator('text=list-view').click();

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
	await expect.poll(() => page.url()).toContain('/vrt/');

	// Wait for close to save the videos
	await context.close();
});
