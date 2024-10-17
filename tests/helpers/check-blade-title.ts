import { expect, type Page } from '@playwright/test';

import { moduleClassSelector } from './module-class-locator';

export async function checkBladeTitle(page: Page, title: string): Promise<void> {
	await expect(page.locator('.c-blade--active')).toBeVisible({ timeout: 10000 });
	const bladeTitle = page.locator(`.c-blade--active ${moduleClassSelector('c-blade__title')}`);
	await expect(bladeTitle).toContainText(title);
	await expect(bladeTitle).toBeVisible();
}
