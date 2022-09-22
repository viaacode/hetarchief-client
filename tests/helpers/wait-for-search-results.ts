import { Page } from '@playwright/test';

export async function waitForSearchResults(page: Page): Promise<void> {
	await page.waitForFunction(
		() => document.querySelectorAll('.p-visitor-space__results .c-card').length > 0,
		null,
		{
			timeout: 10000,
		}
	);
}
