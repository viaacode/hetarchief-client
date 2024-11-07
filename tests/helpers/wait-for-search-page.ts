import { type Page } from '@playwright/test';

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
	await Promise.all([
		actionTriggerFunc(),
		page.waitForRequest(
			(request) => {
				const isPost = request.method() === 'POST';
				const isIeObjectsRequest = request.url().includes('/ie-objects');
				const containsBodyText =
					!bodyContainsText || request.postData()?.includes(bodyContainsText) || false;
				return isPost && isIeObjectsRequest && containsBodyText;
			},
			{ timeout: 10000 }
		),
		page.waitForRequest(
			(request) => request.method() === 'GET' && request.url().includes('/visits/personal'),
			{ timeout: 10000 }
		),
	]);
}
