import { expect, Page } from '@playwright/test';

async function checkTotal(page: Page, total: number): Promise<void> {
	if (total) {
		await expect(
			await page.locator('[class*="PaginationProgress_c-pagination-progress"]')
		).toContainText(`1-${total} van ${total}`);
	} else {
		// If there are no entries, no table is shown and no footer with the total is present
		await expect(
			await page.locator('[class*="PaginationProgress_c-pagination-progress"]')
		).not.toBeVisible();
	}
}

export async function checkVisitRequestStatuses(page: Page): Promise<{
	numberOfPending: number;
	numberOfApproved: number;
	numberOfDenied: number;
	totalNumberOfRequests: number;
}> {
	// Check number of pending on the "all" tab
	const numberOfPending = await page
		.locator('[class*="RequestStatusBadge_c-request-status-badge"]:has-text("Open aanvraag")')
		.count();

	// Check number of approved on the "all" tab
	const numberOfApproved = await page.locator('.c-badge--success').count();

	// Check number of denied on the "all" tab
	const numberOfDenied = await page.locator('.c-badge--error').count();

	// Check the total number of visit requests on the "all" tab
	const totalNumberOfRequests = await page
		.locator('[class*="SidebarLayout_l-sidebar__main"] .c-table__wrapper--body .c-table__row')
		.count();

	// Check total number of requests
	await checkTotal(page, totalNumberOfRequests);

	// Check pending count
	await page.click('.c-tab__label:has-text("Open")');
	await checkTotal(page, numberOfPending);

	// Check approved count
	await page.click('.c-tab__label:has-text("Goedgekeurd")');
	await checkTotal(page, numberOfApproved);

	// Check denied count
	await page.click('.c-tab__label:has-text("Geweigerd")');
	await checkTotal(page, numberOfDenied);

	// Go back to the "All" tab
	await page.click('.c-tab__label:has-text("Alle")');

	return {
		numberOfPending,
		numberOfApproved,
		numberOfDenied,
		totalNumberOfRequests,
	};
}
