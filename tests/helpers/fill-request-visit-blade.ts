import { expect, Page } from '@playwright/test';

import { checkBladeTitle } from './check-blade-title';

export async function fillRequestVisitBlade(
	page: Page,
	visitorSpaceSlug: string,
	reasonText: string,
	whenText?: string,
	checkBox = true
): Promise<void> {
	// Check the request visit blade title is visible

	await checkBladeTitle(page, 'Vraag toegang aan');

	// Check the blade is for VRT
	await expect(page.url()).toContain(`?bezoekersruimte=${visitorSpaceSlug}`);

	// Fill the form
	const checkboxLabel = await page.locator('.c-blade--active .c-checkbox__label');
	await checkboxLabel.waitFor({
		timeout: 10000,
		state: 'visible',
	});
	await page.fill('[name="requestReason"]', reasonText);
	if (whenText) {
		await page.fill('[name="visitTime"]', whenText);
	}
	if (checkBox) {
		await checkboxLabel.click();
	}

	// Click the send button
	await page.click('text=Verstuur');
}
