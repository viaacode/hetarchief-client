import { Page } from '@playwright/test';

export async function goToPageAndAcceptCookies(
	page: Page,
	url: string = process.env.TEST_CLIENT_ENDPOINT as string,
	title = 'Homepagina hetarchief | hetarchief.be',
	whichCookies: 'all' | 'selection' = 'all'
): Promise<void> {
	// Go to the hetarchief homepage
	await page.goto(url);

	// Wait for results to load
	await page.waitForLoadState('networkidle');

	// Check if cookiebot opens
	const cookiebotDialog = page.locator('#CybotCookiebotDialogBody');

	if ((await cookiebotDialog.count()) > 0) {
		if (whichCookies === 'selection') {
			// Accept selected cookies
			await page
				.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowallSelection')
				.click();
		} else {
			// Accept selected cookies
			await page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll').click();
		}
	}

	// Check page title is the home page
	await page.waitForFunction((title: string) => document.title === title, title, {
		timeout: 10000,
	});
}
