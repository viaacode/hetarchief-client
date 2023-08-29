export {};
// import { expect, test } from '@playwright/test';
//
// import { acceptTos } from '../helpers/accept-tos';
// import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
// import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';
//
// test('T02: Test inloggen CP-admin', async ({ page, context }) => {
// 	// Go to the hetarchief homepage
// 	await goToPageAndAcceptCookies(page);
//
// 	// Login cp admin using the meemoo idp
// 	await loginUserHetArchiefIdp(
// 		page,
// 		process.env.TEST_CP_ADMIN_VRT_ACCOUNT_USERNAME as string,
// 		process.env.TEST_CP_ADMIN_VRT_ACCOUNT_PASSWORD as string
// 	);
// 	// Check navbar is visible
// 	await expect(page.locator('nav[class^=Navigation_c-navigation]')).toBeVisible();
//
// 	// Check logged in status
// 	await expect(page.locator('.c-avatar__text')).toContainText('VRT');
//
// 	// Admin should not be visible and beheer should be visible
// 	await expect(page.locator('a.c-dropdown-menu__item', { hasText: 'Admin' })).toHaveCount(0);
// 	await expect(page.locator('a.c-dropdown-menu__item', { hasText: 'Beheer' })).toHaveCount(1);
//
// 	await page.waitForFunction(
// 		() => document.title === 'Homepagina hetarchief | hetarchief.be',
// 		null,
// 		{
// 			timeout: 10000,
// 		}
// 	);
//
// 	// Wait for close to save the videos
// 	await context.close();
// });
