import { expect, test } from '@playwright/test';

test('Should redirect to login page and redirect after login', async ({ page }) => {
	await page.goto(process.env.TEST_ENDPOINT as string);
	expect(await page.title()).toEqual('Home | Het Archief');

	// Go to reading room
	const readingRoomDropdown = page.locator('[role="menuitem"]').first();
	await readingRoomDropdown.click();

	const firstReadingRoomMenuItem = page
		.locator('.c-dropdown__content-open .c-dropdown-menu__item')
		.nth(1);
	await firstReadingRoomMenuItem.click();

	// Check auth modal opens up
	const authModalHeading = page.locator('[class^="AuthModal_c-auth-modal__heading"]').first();
	expect(authModalHeading).toBeDefined();

	// Login using het archief account
	const loginButton = page.locator('.ReactModal__Content .c-button--black');
	await loginButton.click();

	// Enter credentials
	await page.fill('[name="username"]', process.env.TEST_ACCOUNT_USERNAME as string);
	await page.fill('[name="password"]', process.env.TEST_ACCOUNT_PASSWORD as string);
	await page.click('#wp-submit');

	await page.waitForLoadState('networkidle');

	// Check redirect back to reading room page
	expect(page.url()).toContain('/leeszaal/');
	expect(await page.title()).toEqual('Leeszaal | Het Archief');
	expect(await page.locator('[class^="FilterMenu_c-filter-menu__toggle"]').innerHTML()).toContain(
		'Filters'
	);
	expect(await page.locator('[class^="Placeholder_c-placeholder__title"]').innerHTML()).toContain(
		'Start je zoektocht!'
	);
});
