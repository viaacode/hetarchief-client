import { Page } from '@playwright/test';

export async function waitForLoading(page: Page): Promise<void> {
	await page.waitForFunction(() => document.querySelectorAll('.c-loading').length === 0, null, {
		timeout: 10000,
	});
}
