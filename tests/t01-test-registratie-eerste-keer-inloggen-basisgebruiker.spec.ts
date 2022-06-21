import { expect, test } from '@playwright/test';
import { uuid } from 'uuidv4';

import { USER_PASSWORD } from './consts/tests.consts';
import { acmConfirmEmail } from './helpers/acm-confirm-email';
import { loginUser } from './helpers/login-user';

test('T01: Test registratie + eerste keer inloggen basisgebruiker', async ({ page, context }) => {
	const userId = uuid().replace(/-/g, '');
	const userEmail = `hetarchief2.0+ateindgebruikerbzt${userId}@meemoo.be`;
	console.log('user: ' + userEmail);

	// Go to the hetarchief homepage
	await page.goto(process.env.TEST_ENDPOINT as string);

	// Check page title is the home page
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});

	// Cookie bot opens
	await expect(await page.locator('#CybotCookiebotDialogBody')).toBeVisible();

	// Accept selected cookies
	await page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowallSelection').click();

	// Check site is still visible:
	await expect(await page.locator('text=Vind een aanbieder')).toBeVisible();

	// Click on login or register
	await page.locator('text=Inloggen of registreren').click();

	// Check auth modal opens up
	const authModalHeading = await page
		.locator('[class^="AuthModal_c-auth-modal__heading"]')
		.first();
	expect(authModalHeading).toBeDefined();

	// Click the register button
	await page.locator('text=Registreer je hier').click();

	// Check the SSUM page is loaded
	expect(page.url()).toContain('https://ssum-int-iam.private.cloud.meemoo.be/account/nieuw');

	// Wait for recaptcha to load
	await page.waitForLoadState('networkidle');

	// Enter account info
	await page.fill('#person_email', userEmail);
	await page.fill('#person_first_name', 'Test-at');
	await page.fill('#person_last_name', 'Testers-at');
	await page.fill('#password_field', USER_PASSWORD);
	await page.fill('#password_confirmation_field', USER_PASSWORD);

	// Captcha
	const recapchaFrame = await page.frameLocator('iframe[title="reCAPTCHA"]');
	const recaptcha = recapchaFrame.locator('#recaptcha-anchor');
	await recaptcha.click();

	// Wait for recaptcha to show green checkmark
	const greenCheckmark = await recapchaFrame.locator('.recaptcha-checkbox-checkmark');
	await greenCheckmark.waitFor({
		timeout: 10000,
		state: 'visible',
	});

	// Accept the gdpr checkbox
	await page.locator('#person_confirm_gdpr').click();

	// Click the submit button
	await page.click('#register_button');

	// Wait for the new page to load
	await page.waitForLoadState('networkidle');

	// Check the confirmation page has loaded
	await expect(await page.locator('text=Je account werd aangemaakt')).toBeVisible();

	// Confirm email in ACM
	// await acmConfirmEmail(
	// 	page,
	// 	'hetarchief2.0+ateindgebruikerbztcd39a80cd6144e99a5c6d751005536c2@meemoo.be'
	// );
	await acmConfirmEmail(page, userEmail);

	// Go to the hetarchief homepage
	await page.goto('https://bezoek-int.private.cloud.meemoo.be/');
	// await page.goto(process.env.TEST_ENDPOINT as string); // TODO switch back to tst when https://meemoo.atlassian.net/browse/ARC-1050 is fixed

	// Check page title is the home page
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});

	// Cookie bot should not open again
	await expect(await page.locator('#CybotCookiebotDialogBody')).not.toBeVisible();

	// Login user
	// await loginUser(
	// 	page,
	// 	'hetarchief2.0+ateindgebruikerbztcd39a80cd6144e99a5c6d751005536c2@meemoo.be',
	// 	USER_PASSWORD
	// );
	await loginUser(page, userEmail, USER_PASSWORD);

	// Check title, content page content and disabled button
	await expect(await page.locator('.p-terms-of-service__title')).toContainText(
		'Gebruiksvoorwaarden'
	);
	await expect(await page.locator('.c-content-page-preview')).toContainText(
		'Deze gebruiksvoorwaarden'
	);
	const acceptTosButton = await page.locator('.p-terms-of-service__buttons .c-button--black');
	await expect(acceptTosButton).toHaveClass('c-button c-button--black c-button--disabled');

	// Scroll down
	await page.evaluate(() => {
		document.querySelector('.p-terms-of-service__content')?.scrollTo(0, 50000);
	});

	// Check button becomes active
	await expect(acceptTosButton).toHaveClass('c-button c-button--black');

	// Click the accept tos button
	await acceptTosButton.click();

	// Check page title is the home page
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});

	// Cookie bot should not open again
	await expect(await page.locator('#CybotCookiebotDialogBody')).not.toBeVisible();

	// Check logged in status
	await expect(await page.locator('.c-avatar__text')).toHaveText('Test-at');

	// Admin and beheer should not be visible
	const navigationBar = await page.locator(
		'.l-app > nav > [class^="Navigation_c-navigation__list"]:first-child'
	);
	await expect(navigationBar.innerHTML).not.toContain('Admin');
	await expect(navigationBar.innerHTML).not.toContain('Beheer');

	// Wait for close to save the videos
	await context.close();
});
