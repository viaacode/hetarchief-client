import { expect, type Page } from '@playwright/test';

import { getSiteTranslations } from './get-site-translations';
import { waitForPageTitle } from './wait-for-page-title';

export async function checkSpaceVisibilityHomepage(
	page: Page,
	searchTerm: string,
	shouldBeVisible: boolean
): Promise<void> {
	const SITE_TRANSLATIONS = await getSiteTranslations();

	// Go to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

	// Check page title is the home page
	await waitForPageTitle(page, 'Homepagina hetarchief');

	// Search for "searchTerm"
	const searchFieldHomePage = page.locator('[placeholder="zoek"]');
	await searchFieldHomePage.fill(searchTerm);
	await page.locator('.c-input .c-button', { hasText: 'search' }).click();

	if (shouldBeVisible) {
		// Check searchTerm is shown
		const card = page.locator('.p-home__results .c-card', { hasText: searchTerm });
		await expect(card).toBeVisible();
		await expect(
			card.locator('.c-button', {
				hasText:
					SITE_TRANSLATIONS.nl[
						'modules/home/components/request-access-blade/request-access-blade___vraag-toegang-aan'
					],
			})
		).toBeVisible();
	} else {
		// Check searchTerm is not shown
		const noResultsForSelectedFiltersLabel =
			SITE_TRANSLATIONS.nl['pages/index___geen-resultaten-voor-de-geselecteerde-filters'];
		await expect(page.locator(`text=${noResultsForSelectedFiltersLabel}`)).toBeVisible();
		const card = page.locator('.p-home__results .c-card', { hasText: searchTerm });
		await expect(card).not.toBeVisible();
		await expect(
			card.locator('.c-button', {
				hasText:
					SITE_TRANSLATIONS.nl[
						'modules/shared/components/visitor-space-card/visitor-space-card-controls/visitor-space-card-controls___vraag-toegang-aan'
					],
			})
		).not.toBeVisible();
	}

	// Go back to previous page
	await page.goBack(); // Revert the search url change
	await page.goBack(); // Revert the "go to homepage" url change
}
