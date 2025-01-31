import { expect, test } from '@playwright/test';

import { compareSearchTabCountsLessThen } from '../helpers/compareSearchTabCountsLessThen';
import { getSearchTabBarCounts } from '../helpers/get-search-tab-bar-counts';
import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';

test('T10.3: Test actieve toegang basisgebruiker: Raadpleegbaar op locatie filter', async ({
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

	// Wait for the search bar to be visible
	await expect(page.locator('.c-tag-search-bar')).toBeVisible();

	/**
	 * Filter using isConsultable on location
	 */

	// Get tab counts before search
	const countsBeforeSearch = await getSearchTabBarCounts(page);

	await page
		.locator('span.c-checkbox__label', {
			hasText:
				SITE_TRANSLATIONS.nl['modules/visitor-space/const/index___enkel-ter-plaatse-beschikbaar'],
		})
		.click();

	// Check green pill exists with filter inside
	const pill = page.locator('.c-tags-input__multi-value .c-tag__label');
	await expect(pill).toBeVisible();
	await expect(pill).toContainText(
		SITE_TRANSLATIONS.nl['modules/visitor-space/const/index___enkel-ter-plaatse-beschikbaar']
	);

	// Wait for filtered search results
	await expect.poll(async () => await getSearchTabBarCounts(page)).not.toEqual(countsBeforeSearch);

	// Check tab counts decreased
	const countsAfterSearchByText = await getSearchTabBarCounts(page);

	// Expect counts to have gone down, or stay the same
	compareSearchTabCountsLessThen(countsBeforeSearch, countsAfterSearchByText);

	// Wait for close to save the videos
	await context.close();
});
