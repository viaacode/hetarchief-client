import { Page } from '@playwright/test';

export async function clickToastMessageButton(page: Page): Promise<void> {
	await page.locator('.Toastify__toast-body').first().locator('.c-button').click();
}
