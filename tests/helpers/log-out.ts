import { Page } from '@playwright/test';

export async function logout(page: Page): Promise<void> {
	await page.locator('[class*="Navigation_c-navigation__list__"] .c-avatar').click();
	await page.locator('.c-dropdown-menu__item', { hasText: 'Log uit' }).click();
}
