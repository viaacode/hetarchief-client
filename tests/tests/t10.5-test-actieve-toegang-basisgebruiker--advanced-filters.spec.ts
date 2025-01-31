import { expect, test } from '@playwright/test';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';

import { compareSearchTabCountsLessThen } from '../helpers/compareSearchTabCountsLessThen';
import { getSearchTabBarCounts } from '../helpers/get-search-tab-bar-counts';
import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';

test('T10.5: Test actieve toegang basisgebruiker: Geavanceerde filters', async ({
	page,
	context,
}) => {
	const SITE_TRANSLATIONS = await getSiteTranslations();
	const SEARCH_PAGE_TITLE = SITE_TRANSLATIONS.nl['pages/zoeken/index___zoeken-pagina-titel'];

	// GO to the hetarchief homepage
	await goToPageAndAcceptCookies(
		page,
		`${process.env.TEST_CLIENT_ENDPOINT as string}/zoeken`,
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

	// /**
	//  * Advanced filter
	//  */

	// Set title filter
	const advancedFilterButton = page.locator('#c-filter-menu__option__advanced');
	await expect(advancedFilterButton).toBeVisible();
	await advancedFilterButton.click();

	const advancedFilterMenu = page.locator('#c-filter-form--advanced');
	await expect(advancedFilterMenu).toBeVisible();

	// Scroll so the whole advanced menu is in view
	await page.mouse.wheel(0, 400);

	// Set title filter
	const TITLE_FILTER_VALUE = 'Planning';
	const firstAdvancedEntry = advancedFilterMenu
		.locator(moduleClassSelector('c-advanced-filter-fields__p', '_'))
		.nth(0);
	await expect(firstAdvancedEntry).toBeVisible();

	// Set title filter value: Eerste
	await firstAdvancedEntry.locator('#AdvancedFilterFields__value__0').fill(TITLE_FILTER_VALUE);

	// Set description filter
	const addAdvancedEntryButton = advancedFilterMenu.locator('.c-button', {
		hasText:
			SITE_TRANSLATIONS.nl[
				'modules/visitor-space/components/forms/advanced-filter-form/advanced-filter-form___nieuwe-stelling'
			],
	});
	await expect(addAdvancedEntryButton).toBeVisible();
	await addAdvancedEntryButton.click();

	// Set second advanced filter entry
	const DESCRIPTION_FILTER_VALUE = 'Beeldverslag';
	const secondAdvancedEntry = advancedFilterMenu
		.locator(moduleClassSelector('c-advanced-filter-fields__p', '_'))
		.nth(1);
	await expect(secondAdvancedEntry).toBeVisible();
	const filter2TypeSelect = secondAdvancedEntry
		.locator('.c-form-control .c-react-select')
		.first();
	await expect(filter2TypeSelect).toBeVisible();
	await filter2TypeSelect.click();

	// Click 'Beschrijving'
	const filterDescriptionLabel =
		SITE_TRANSLATIONS.nl[
			'modules/visitor-space/utils/advanced-filters/metadata___beschrijving'
		];
	await filter2TypeSelect.locator(`text=${filterDescriptionLabel}`).click();
	await secondAdvancedEntry
		.locator('#AdvancedFilterFields__value__1')
		.fill(DESCRIPTION_FILTER_VALUE);

	// TODO add filter on language once more items with languages are added

	// Click apply button
	const applyButton = advancedFilterMenu.locator(moduleClassSelector('c-filter-form__submit'));
	await expect(applyButton).toBeVisible();
	await applyButton.click();

	// Wait for the filters to be applied to the search field
	await new Promise((resolve) => setTimeout(resolve, 1000));

	// Check advanced filters are added
	const searchInput3 = page.locator('.c-tag-search-bar .c-tags-input__control');
	const containsLabel =
		SITE_TRANSLATIONS.nl[
			'modules/visitor-space/components/advanced-filter-fields/advanced-filter-fields___bevat'
		];
	const filterTitleLabel =
		SITE_TRANSLATIONS.nl['modules/visitor-space/utils/advanced-filters/metadata___titel'];
	expect(await searchInput3.innerHTML()).toContain(filterTitleLabel);
	expect(await searchInput3.innerHTML()).toContain(containsLabel.toLowerCase());
	expect(await searchInput3.innerHTML()).toContain(TITLE_FILTER_VALUE);
	expect(await searchInput3.innerHTML()).toContain(filterDescriptionLabel);
	expect(await searchInput3.innerHTML()).toContain(containsLabel.toLowerCase());
	expect(await searchInput3.innerHTML()).toContain(DESCRIPTION_FILTER_VALUE);

	// Expect counts to have gone down, or stay the same
	const countsAfterAdvancedSearch = await getSearchTabBarCounts(page);
	compareSearchTabCountsLessThen(countsBeforeSearch, countsAfterAdvancedSearch);

	// Wait for close to save the videos
	await context.close();
});
