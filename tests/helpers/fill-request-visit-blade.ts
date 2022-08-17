import { expect, Page } from '@playwright/test';

import { checkBladeTitle } from './check-blade-title';

/**
 * Creates a new visit request for the current logged-in user and returns the visit request id
 * @param page
 * @param visitorSpaceSlug
 * @param reasonText
 * @param whenText
 * @param checkbox
 * @return Visit id
 */
export async function fillRequestVisitBlade(
	page: Page,
	visitorSpaceSlug: string,
	reasonText: string,
	whenText?: string,
	checkbox = true
): Promise<string | null> {
	// Check the request visit blade title is visible

	await checkBladeTitle(page, 'Vraag toegang aan');

	// Check the blade is for VRT
	await expect(page.url()).toContain(`?bezoekersruimte=${visitorSpaceSlug}`);

	// Fill the form
	const checkboxElem = await page.locator('.c-blade--active .c-checkbox__check-icon');
	await checkboxElem.waitFor({
		timeout: 10000,
		state: 'visible',
	});
	await page.fill('[name="requestReason"]', reasonText);
	if (whenText) {
		await page.fill('[name="visitTime"]', whenText);
	}
	if (checkbox) {
		await checkboxElem.click();

		// Click the send button and capture the api call response
		const [response] = await Promise.all([
			page.waitForResponse(
				(resp) =>
					resp.request().method() === 'POST' &&
					resp.url().includes('/visits') &&
					resp.status() >= 200 &&
					resp.status() < 400
			),
			page.click('text=Verstuur'),
		]);
		const responseBody = (await response.json()) as { id: string };
		expect(responseBody.id).toBeDefined();
		return responseBody.id;
	} else {
		await page.click('text=Verstuur');
		return null;
	}
}
