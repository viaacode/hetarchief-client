import { expect, test } from '@playwright/test';

test('Should redirect to login page and redirect after login', async ({ page }) => {
	await page.goto('https://bezoek-tst.private.cloud.meemoo.be');
	await expect(page.title()).toEqual('Home | Het Archief');

	// Go to reading room
	const readingRoomDropdown = page.locator('[role="menuitem"]').first();
	await readingRoomDropdown.click();

	const firstReadingRoomMenuItem = page
		.locator('.c-dropdown__content-open .c-dropdown-menu__item')
		.nth(2);
	await firstReadingRoomMenuItem.click();

	// Check auth modal opens up
	const authModalHeading = page.locator('[class^="AuthModal_c-auth-modal__heading"]').first();
	expect(authModalHeading).toBeDefined();

	// Login using het archief account
	const loginButton = page.locator(
		'.ReactModal__Content ReactModal__Content--after-open .c-button--black'
	);
	await loginButton.click();

	// Enter credentials
	await page.fill('[name="username"]', 'bert.verhelst@studiohyperdrive.be');
	await page.fill('[name="password"]', 'CarolineDitIsVeiligHe123#');
	await page.click('#wp-submit');

	// Check redirect back to reading room page
	expect(page.url()).toContain('/leeszaal/');
	await expect(page.title()).toEqual('Home | Het Archief');
	expect(page.locator('[class^="Placeholder_c-placeholder__title"]')).toContain(
		'Start je zoektocht!'
	);
});
