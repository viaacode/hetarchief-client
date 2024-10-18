import { expect, type Page } from '@playwright/test';

import { moduleClassSelector } from './module-class-locator';

export async function checkNumberOfVisitorSpacesBadge(
	page: Page,
	expectedNumberOfVisitorSpaces: number
): Promise<void> {
	const navBar = page.locator(`nav${moduleClassSelector('c-navigation')}`);
	await expect(navBar).toBeVisible();
	const visitorSpacesAccessBadge = navBar.locator('a[href="/bezoek"] .c-badge');
	await expect(visitorSpacesAccessBadge).toBeVisible();
	await expect(visitorSpacesAccessBadge).toContainText(String(expectedNumberOfVisitorSpaces));
}
