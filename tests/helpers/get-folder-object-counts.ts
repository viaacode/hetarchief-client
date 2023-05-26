import { expect, Page } from '@playwright/test';

export async function getFolderObjectCounts(page: Page): Promise<Record<string, number>> {
	// Wait until the favorites folder link is loaded
	const favoritesListItem = await page.locator(
		'li[class*="AddToFolderBlade_c-add-to-folder-blade__list-item__"]',
		{
			hasText: 'Favorieten',
		}
	);
	await expect(await favoritesListItem).toBeVisible();

	// Fetch all folder links
	const folderListItems = await page.locator(
		'.c-blade--active li[class*="AddToFolderBlade_c-add-to-folder-blade__list-item__"]'
	);
	const counts: Record<string, number> = {};
	const numberOfFolder = await folderListItems.count();
	for (let i = 0; i < numberOfFolder; i++) {
		const name = await page
			.locator(
				`.c-blade--active li[class*="AddToFolderBlade_c-add-to-folder-blade__list-item__"] >> nth=${i} >> [class*="AddToFolderBlade_c-add-to-folder-blade__list-item__label__"]`
			)
			.innerHTML();
		const count = await page
			.locator(
				`.c-blade--active li[class*="AddToFolderBlade_c-add-to-folder-blade__list-item__"] >> nth=${i} >> [class*="AddToFolderBlade_c-add-to-folder-blade__list-item__count__"]`
			)
			.innerHTML();
		if (count === 'Eén item') {
			counts[name] = 1;
		} else {
			counts[name] = parseInt(count.replace(/[^0-9]/g, ''));
		}
	}
	return counts;
}
