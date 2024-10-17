import { expect, type Page } from '@playwright/test';

import { moduleClassSelector } from './module-class-locator';

export async function checkNumberOfVisitorSpacesBadge(
	page: Page,
	expectedNumberOfVisitorSpaces: number
): Promise<void> {
	await expect(page.locator(`nav${moduleClassSelector('c-navigation')}`)).toBeVisible();
	const visitorSpacesAccessBadge = page.locator('a[href="/bezoek"] .c-badge');
	await expect(visitorSpacesAccessBadge).toBeVisible();
	await expect(visitorSpacesAccessBadge).toContainText(String(expectedNumberOfVisitorSpaces));
}
