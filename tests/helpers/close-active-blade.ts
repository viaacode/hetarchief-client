import { expect, type Page } from '@playwright/test';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';

export async function closeActiveBlade(page: Page): Promise<void> {
	const activeBlade = page.locator('.c-blade--active');
	await expect(activeBlade).toBeVisible({ timeout: 10000 });
	const bladeCloseButton = activeBlade.locator(moduleClassSelector('c-blade__close-button'));
	await expect(bladeCloseButton).toBeVisible();
	await bladeCloseButton.click();
	await expect(activeBlade).not.toBeVisible({ timeout: 10000 });
}
