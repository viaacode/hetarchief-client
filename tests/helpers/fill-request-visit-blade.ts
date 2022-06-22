import { expect, Page } from '@playwright/test';

export async function fillRequestVisitBlade(
	page: Page,
	visitorSpaceSlug: string,
	reasonText: string,
	whenText?: string,
	checkBox = true
): Promise<void> {
	// Check the request visit blade title is visible
	const bladeTitle = await page.locator(
		'[role="dialog"] [class^="RequestAccessBlade_c-request-access-blade__title"]'
	);
	await expect(bladeTitle).toBeVisible();
	await expect(bladeTitle).toContainText('Vraag toegang aan');

	// Check the blade is for VRT
	await expect(page.url()).toContain(`?bezoekersruimte=${visitorSpaceSlug}`);

	// Fill the form
	const checkboxLabel = await page.locator('[role="dialog"] .c-checkbox__label');
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
