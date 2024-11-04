import { type Page } from '@playwright/test';

/**
 * Waits for the search network call to complete
 * @param page
 * @param actionTriggerFunc A function that triggers the search operation
 */
export async function waitForSearchResults(
	page: Page,
	actionTriggerFunc: () => Promise<void>
): Promise<void> {
	await Promise.all([
		actionTriggerFunc(),
		page.waitForRequest(
			(request) => request.method() === 'POST' && request.url().includes('/ie-objects'),
			{ timeout: 10000 }
		),
	]);
}
