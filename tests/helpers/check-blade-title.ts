import { expect, Page } from '@playwright/test';

export async function checkBladeTitle(page: Page, title: string): Promise<void> {
	await expect(page.locator('.c-blade--active')).toBeVisible({ timeout: 10000 });
	const bladeTitle = await page.locator(
		'.c-blade--active [class^="ApproveRequestBlade_c-approve-request-blade__title"], .c-blade--active [class*="ProcessRequestBlade_c-process-request-blade__title"], .c-blade--active [class*="RequestAccessBlade_c-request-access-blade__title"], .c-blade--active [class*="DeclineRequestBlade_c-decline-request-blade__title"]'
	);
	await expect(bladeTitle).toContainText(title);
	await expect(bladeTitle).toBeVisible();
}
