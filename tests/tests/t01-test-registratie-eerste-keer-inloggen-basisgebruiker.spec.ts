import { expect, test } from '@playwright/test';
import { v4 as uuid } from 'uuid';

import { USER_PASSWORD } from '../consts/tests.consts';
import { acceptCookies } from '../helpers/accept-cookies';
import { acceptTos } from '../helpers/accept-tos';
import { acmConfirmEmail } from '../helpers/acm-confirm-email';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';

/**
 * These scenarios are described in https://docs.google.com/spreadsheets/d/1yGNKFkeE-2Kv2mADOvKzDK3BYTvoiSbVO6pAsuoG5P8/edit#gid=286710078
 * New: https://docs.google.com/spreadsheets/d/1EI8MZjFlE-gkzE1YGXFabtTGURRz6fWk-0fQa8OCv4k/edit#gid=95954947
 */

test('T01: Test registratie + eerste keer inloggen basisgebruiker', async ({ page, context }) => {
	const userId = uuid().replace(/-/g, '');
	const userEmail = `hetarchief2.0+ateindgebruikerbzt${userId}@meemoo.be`;

	// Go to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

	// Check page title is the home page
	await page.waitForFunction(() => document.title === 'homepage | bezoekertool', null, {
		timeout: 10000,
	});
	// Check searchbar contains 'Start je zoektocht':
	// await expect(page.locator('text=Start je zoektocht')).toBeVisible(); //This does not work

	// Accept selected cookies
	await acceptCookies(page, 'selection');

	// Check site is still visible:
	await expect(page.locator('text=Zoeken')).toBeVisible();

	// Click on login or register
	await page.locator('text=Inloggen of registreren').first().click();

	// Check auth modal opens up
	const authModalHeading = await page
		.locator('[class*="AuthModal_c-auth-modal__heading"]')
		.first();
	expect(authModalHeading).toBeDefined();

	// Click the register button
	await page.locator('text=Registreer je hier').click();

	// Check the SSUM page is loaded // TODO
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
	const greenCheckmark = await recapchaFrame.locator('.recaptcha-checkbox-checked');
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
	await expect(page.locator('text=Je account werd aangemaakt')).toBeVisible();

	// Confirm email in ACM
	// await acmConfirmEmail(
	// 	page,
	// 	'hetarchief2.0+ateindgebruikerbztcd39a80cd6144e99a5c6d751005536c2@meemoo.be'
	// );
	await acmConfirmEmail(page, userEmail);

	// Go to the hetarchief homepage
	// await page.goto('https://bezoek-.private.cloud.meemoo.be/');
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string); // TODO switch back to tst when https://meemoo.atlassian.net/browse/ARC-1050 is fixed

	// Check page title is the home page
	await page.waitForFunction(() => document.title === 'homepage | bezoekertool', null, {
		timeout: 10000,
	});

	// Cookie bot should not open again
	await expect(page.locator('#CybotCookiebotDialogBody')).not.toBeVisible();

	// Login user
	await loginUserHetArchiefIdp(page, userEmail, USER_PASSWORD);

	// Check tos is displayed, scroll down and click accept button
	await acceptTos(page);

	// Cookie bot should not open again
	await expect(page.locator('#CybotCookiebotDialogBody')).not.toBeVisible();

	// Check logged in status
	await expect(page.locator('.c-avatar__text')).toHaveText('Test-at');

	// Admin and beheer should not be visible
	const navigationItemTexts = await page
		.locator('.l-app a[class*="Navigation_c-navigation__link"]')
		.allInnerTexts();
	await expect(navigationItemTexts).not.toContain('Admin');
	await expect(navigationItemTexts).not.toContain('Beheer');

	// Wait for close to save the videos
	await context.close();
});
