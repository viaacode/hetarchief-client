import { expect, Page } from '@playwright/test';

export async function checkToastMessage(page: Page, title: string, timeout = 10000): Promise<void> {
	await expect
		.poll(
			async () => {
				return page.locator('[data-testid="toast-title"]', { hasText: title }).first();
			},
			{
				timeout,
				intervals: [500],
			}
		)
		.toBeDefined();
}
