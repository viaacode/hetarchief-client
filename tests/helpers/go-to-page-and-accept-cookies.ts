import type { BrowserContext, Page } from '@playwright/test';
import { Locale } from '@shared/utils/i18n';

import { HOMEPAGE_TITLE } from '../consts/tests.consts';

import { waitForPageTitle } from './wait-for-page-title';

export async function goToPageAndAcceptCookies(
	page: Page,
	context: BrowserContext,
	url: string,
	title: string = HOMEPAGE_TITLE,
	whichCookies: 'all' | 'selection' = 'all',
	locale: Locale = Locale.nl
): Promise<void> {
	// Go to the hetarchief homepage and wait for results to load
	await page.goto(url);

	// Check page title is the home page
	await waitForPageTitle(page, title, locale);

	const cookies = await context.cookies();
	if (cookies.find((cookie) => cookie.name === 'CookieConsent')) {
		// If cookies have been accepted already, return
		return;
	}

	if (whichCookies === 'selection') {
		// Accept selected cookies
		await page.locator('#CybotCookiebotDialogBodyButtonDecline').click({ timeout: 20000 });
	} else {
		// Accept selected cookies
		await page
			.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll')
			.click({ timeout: 20000 });
	}
}
