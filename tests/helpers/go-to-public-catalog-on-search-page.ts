import { expect, type Page } from '@playwright/test';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';

import { getSearchTabBarCounts } from './get-search-tab-bar-counts';
import { getSiteTranslations } from './get-site-translations';

export async function goToPublicCatalogOnSearchPage(page: Page) {
	const SITE_TRANSLATIONS = await getSiteTranslations();

	const countsBeforePublic = await getSearchTabBarCounts(page);

	await page.locator(`li${moduleClassSelector('c-visitor-spaces-dropdown__active')}`).click();

	const publicCatalogLabel =
		SITE_TRANSLATIONS.nl[
			'modules/visitor-space/components/visitor-space-search-page/visitor-space-search-page___pages-bezoekersruimte-publieke-catalogus'
		];
	const dropdownOptionsSelector = `${moduleClassSelector('c-visitor-spaces-dropdown--open')} ${moduleClassSelector('c-visitor-spaces-dropdown__list')} li`;
	const publicCatalogOption = page.locator(dropdownOptionsSelector).first();
	await expect(publicCatalogOption).toBeVisible();
	await expect(publicCatalogOption).toContainText(publicCatalogLabel);
	await publicCatalogOption.click();

	// Wait for user to be in the public catalog
	await expect.poll(async () => await getSearchTabBarCounts(page)).not.toEqual(countsBeforePublic);
}
