import { Page } from '@playwright/test';

export async function logout(page: Page): Promise<void> {
	// Click the avatar
	await page.locator('[class*="Navigation_c-navigation__list__"] .c-avatar').click();

	// Click the logout option
	await page.locator('.c-dropdown-menu__item', { hasText: 'Log uit' }).click();

	// Wait for homepage to load
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});
}
