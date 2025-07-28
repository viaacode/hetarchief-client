import type { Page } from '@playwright/test';

/**
 * Waits for the search results network call to complete
 * @param page
 * @param actionTriggerFunc A function that triggers the search operation
 * @param bodyContainsText Body of the request should contain this text
 */
export async function waitForSearchPage(
	page: Page,
	actionTriggerFunc: () => Promise<void>,
	bodyContainsText?: string
): Promise<void> {
	await page.route('**/ie-objects', (route) => route.continue());
	await Promise.all([
		page.waitForRequest(
			(request) => {
				const isPost = request.method() === 'POST';
				if (!isPost) {
					return false;
				}
				const isIeObjectsRequest = request.url().includes('/ie-objects');
				if (!isIeObjectsRequest) {
					return false;
				}
				const containsBodyText =
					!bodyContainsText || request.postData()?.includes(bodyContainsText) || false;
				return containsBodyText;
			},
			{ timeout: 20000 }
		),
		actionTriggerFunc(),
	]);
}
