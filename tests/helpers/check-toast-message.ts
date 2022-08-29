import { Page } from '@playwright/test';

export async function checkToastMessage(page: Page, title: string, timeout = 10000): Promise<void> {
	await page.waitForFunction(
		(titleInsideBrowser: string) => {
			return Array.from(document.querySelectorAll('[data-testid="toast-title"]')).some(
				(toastMessage) => {
					return toastMessage.innerHTML.includes(titleInsideBrowser);
				}
			);
		},
		title,
		{
			timeout: timeout,
			polling: 500,
		}
	);
}
