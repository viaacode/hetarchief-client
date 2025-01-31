import { expect, type Page } from '@playwright/test';

import { IconName } from '../consts/icon-names';

export async function clickOverflowButtonDetailPage(page: Page, icon: IconName): Promise<void> {
	const buttonOverflowMenu = page.locator('.p-object-detail__primary-actions .c-button', {
		hasText: IconName.DotsHorizontal,
	});
	await expect(buttonOverflowMenu).toBeVisible();

	// Click the button overflow menu
	await buttonOverflowMenu.click();

	// Bookmark button should be visible
	const bookmarkButton = page.locator('.p-object-detail__primary-actions .c-dropdown-menu__item', {
		hasText: icon,
	});
	await expect(bookmarkButton).toBeVisible();

	// Click the bookmark button
	await bookmarkButton.click();
}
