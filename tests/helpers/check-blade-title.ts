import { expect, Page } from '@playwright/test';

export async function checkBladeTitle(page: Page, title: string): Promise<void> {
	await expect(page.locator('.c-blade--active')).toBeVisible({ timeout: 10000 });
	const bladeTitle = await page.locator(
		'.c-blade--active [class*="Blade_c-blade__title__"], .c-blade--active [class*="RequestAccessBlade_c-request-access-blade__title__"]'
	);
	await expect(bladeTitle).toContainText(title);
	await expect(bladeTitle).toBeVisible();
}
