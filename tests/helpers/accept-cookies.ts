import { expect, Page } from '@playwright/test';

export async function acceptCookies(page: Page, whichCookies: 'all' | 'selection'): Promise<void> {
	// TODO enable once cookiebot is configured for https://bezoek-int.private.cloud.meemoo.be/
	// // Cookie bot opens
	// await expect(await page.locator('#CybotCookiebotDialogBody')).toBeVisible();
	//
	// if (whichCookies === 'selection') {
	// 	// Accept selected cookies
	// 	await page
	// 		.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowallSelection')
	// 		.click();
	// } else {
	// 	// Accept selected cookies
	// 	await page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll').click();
	// }
}
