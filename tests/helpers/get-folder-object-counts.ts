import { expect, type Page } from '@playwright/test';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';

import { getSiteTranslations } from './get-site-translations';

export async function getFolderObjectCounts(page: Page): Promise<Record<string, number>> {
	const SITE_TRANSLATIONS = await getSiteTranslations();
	const FAVORITES_FOLDER_NAME =
		SITE_TRANSLATIONS.nl['modules/folders/controllers___default-collection-name'];

	// Wait until the favorites folder link is loaded
	const favoritesListItem = page.locator(
		`li${moduleClassSelector('c-add-to-folder-blade__list-item')}`,
		{
			hasText: FAVORITES_FOLDER_NAME,
		}
	);
	await expect(favoritesListItem).toBeVisible();

	// Fetch all folder links
	const folderListItems = page.locator(
		`.c-blade--active li${moduleClassSelector('c-add-to-folder-blade__list-item')}`
	);
	const counts: Record<string, number> = {};
	const numberOfFolder = await folderListItems.count();
	for (let i = 0; i < numberOfFolder; i++) {
		const name = await page
			.locator(
				`.c-blade--active li${moduleClassSelector(
					'c-add-to-folder-blade__list-item'
				)} >> nth=${i} >> ${moduleClassSelector('c-add-to-folder-blade__list-item__label')}`
			)
			.textContent();
		const count = await page
			.locator(
				`.c-blade--active li${moduleClassSelector(
					'c-add-to-folder-blade__list-item'
				)} >> nth=${i} >> ${moduleClassSelector('c-add-to-folder-blade__list-item__count')}`
			)
			.textContent();
		if (!name || !count) {
			continue;
		}
		if (
			count ===
			SITE_TRANSLATIONS.nl[
				'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___1-item'
			]
		) {
			counts[name] = 1;
		} else {
			counts[name] = Number.parseInt(count.replace(/[^0-9]/g, ''), 10);
		}
	}
	return counts;
}
