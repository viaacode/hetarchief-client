import type { Page } from '@playwright/test';

/**
 * Waits for the /visit page to be loaded with spaces and existing visit requests
 * @param page
 * @param actionTriggerFunc A function that triggers the "navigate to /visit page"
 */
export async function waitForVisitPageLoaded(
	page: Page,
	actionTriggerFunc: () => Promise<void>
): Promise<void> {
	await Promise.all([
		actionTriggerFunc(),
		page.waitForRequest(
			(request) => request.method() === 'GET' && request.url().includes('/visits/personal'),
			{ timeout: 10000 }
		),
		page.waitForRequest(
			(request) => request.method() === 'GET' && request.url().includes('/spaces'),
			{ timeout: 10000 }
		),
	]);
}
