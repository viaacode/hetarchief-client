import { expect, test } from '@playwright/test';
import { v4 as uuid } from 'uuid';

import { USER_PASSWORD } from '../consts/tests.consts';
import { acceptTos } from '../helpers/accept-tos';
import { acmConfirmEmail } from '../helpers/acm-confirm-email';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';

/**
 * New: https://docs.google.com/spreadsheets/d/1EI8MZjFlE-gkzE1YGXFabtTGURRz6fWk-0fQa8OCv4k/edit#gid=95954947
 */

test('T01: Test registratie + eerste keer inloggen basisgebruiker', async ({ page, context }) => {
	const userId = uuid().replace(/-/g, '');
	const userEmail = `hetarchief2.0+atbasisgebruiker${userId}@meemoo.be`;

	await goToPageAndAcceptCookies(
		page,
		process.env.TEST_CLIENT_ENDPOINT as string,
		'Homepagina hetarchief | hetarchief.be',
		'selection'
	);

	// Check navbar exists
	await expect(page.locator('nav[class^=Navigation_c-navigation]')).toBeVisible();

	// Click on login or register
	await page.locator('text=Inloggen of registreren').first().click();

	// Check auth modal opens up
	const authModalHeading = await page
		.locator('[class*="AuthModal_c-auth-modal__heading"]')
		.first();
	expect(authModalHeading).toBeDefined();

	// Click the register button and wait for captcha to load
	await Promise.all([
		page.locator('text=Registreer je hier').click(),
		page.waitForLoadState('networkidle'),
	]);

	// Check the SSUM page is loaded
	expect(page.url()).toContain('https://ssum-int-iam.private.cloud.meemoo.be/account/nieuw');

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
	const greenCheckmark = await recapchaFrame.locator('.recaptcha-checkbox-checked');
	await greenCheckmark.waitFor({
		timeout: 10000,
		state: 'visible',
	});

	// Accept the gdpr checkbox
	await page.locator('#person_confirm_gdpr').click();

	// Click the submit button wait for the new page to load
	await Promise.all([page.click('#register_button'), page.waitForLoadState('networkidle')]);

	// Check the confirmation page has loaded
	await expect(page.locator('text=Je account werd aangemaakt')).toBeVisible();

	// Confirm email in ACM
	await acmConfirmEmail(page, userEmail);

	// Go to the hetarchief homepage
	await goToPageAndAcceptCookies(page);

	// Cookie bot should not open again
	await expect(page.locator('#CybotCookiebotDialogBody')).not.toBeVisible(); //TODO: ENABLE THIS WHEN RUNNING TESTS ON INT

	// Login user
	await loginUserHetArchiefIdp(page, userEmail, USER_PASSWORD);

	// Check tos is displayed, scroll down and click accept button
	await acceptTos(page);

	// Cookie bot should not open again
	await expect(page.locator('#CybotCookiebotDialogBody')).not.toBeVisible(); //TODO: ENABLE THIS WHEN RUNNING TESTS ON INT

	// Check logged in status
	await expect(page.locator('.c-avatar__text')).toHaveText('Test-at');

	// Admin and beheer should not be visible
	await expect(page.locator('a.c-dropdown-menu__item', { hasText: 'Admin' })).toHaveCount(0);
	await expect(page.locator('a.c-dropdown-menu__item', { hasText: 'Beheer' })).toHaveCount(0);

	// Check navbar exists
	await expect(page.locator('nav[class^=Navigation_c-navigation]')).toBeVisible();

	// Wait for close to save the videos
	await context.close();
});
