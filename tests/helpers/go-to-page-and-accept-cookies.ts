import { type Page } from '@playwright/test';

import { HOMEPAGE_TITLE } from '../consts/tests.consts';

import { waitForPageTitle } from './wait-for-page-title';

export async function goToPageAndAcceptCookies(
	page: Page,
	url: string,
	title: string = HOMEPAGE_TITLE,
	whichCookies: 'all' | 'selection' = 'all'
): Promise<void> {
	// Go to the hetarchief homepage and wait for results to load
	await page.goto(url);

	// Check page title is the home page
	await waitForPageTitle(page, title);

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
}
