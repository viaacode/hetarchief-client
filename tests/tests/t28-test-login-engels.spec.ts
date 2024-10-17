import { expect, test } from '@playwright/test';

import { HOMEPAGE_TITLE } from '../consts/tests.consts';
import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { moduleClassSelector } from '../helpers/module-class-locator';

test('T28: Test login flow engels', async ({ page, context }) => {
	const SITE_TRANSLATIONS = await getSiteTranslations();

	/**
	 * Go to the search page ---------------------------------------------------------------
	 */
	await goToPageAndAcceptCookies(
		page,
		process.env.TEST_CLIENT_ENDPOINT as string,
		HOMEPAGE_TITLE
	);

	// Language switcher should be visible
	const languageSwitcher = page.locator(moduleClassSelector('c-language-switcher__select'));
	await expect(languageSwitcher).toBeVisible();

	// Change language to English
	await languageSwitcher.click();
	await page
		.locator('.c-dropdown__content-open .c-button', {
			hasText: SITE_TRANSLATIONS.nl['modules/shared/const/language-names___engels'],
		})
		.click();

	// Check the login and register button changes language
	let loginButton = page.locator(moduleClassSelector('c-navigation__auth'));
	await expect(loginButton).toHaveText(
		SITE_TRANSLATIONS.en[
			'modules/auth/components/auth-modal/auth-modal___inloggen-of-registreren'
		]
	);

	// Check that the url changes to /en
	expect(page.url()).toContain('/en');

	// Click the main archives logo at the top left of the screen
	const logo = page.locator(moduleClassSelector('c-navigation__item')).first().locator('a');
	await logo.click();

	// Check the login and register button is still in english
	loginButton = page.locator(moduleClassSelector('c-navigation__auth'));
	await expect(loginButton).toHaveText(
		SITE_TRANSLATIONS.en[
			'modules/auth/components/auth-modal/auth-modal___inloggen-of-registreren'
		]
	);

	// Check that the url is still /en
	expect(page.url()).toContain('/en');

	// Click the login button
	await loginButton.click();

	// Check that a modal opens with a login and register button in english
	const loginModal = page.locator('.ReactModal__Content--after-open');
	await expect(loginModal).toBeVisible();
	const loginButtonLabelEnglish =
		SITE_TRANSLATIONS.en[
			'modules/auth/components/auth-modal/auth-modal___inloggen-met-het-archief-account'
		];
	await expect(loginModal).toContainText(loginButtonLabelEnglish, { timeout: 5000 });
	const registerButtonLabelEnglish =
		SITE_TRANSLATIONS.en['modules/auth/components/auth-modal/auth-modal___registreer-je-hier'];
	await expect(loginModal).toContainText(registerButtonLabelEnglish);

	// Click the login button
	const loginButtonInModal = loginModal.locator('.c-button', {
		hasText:
			SITE_TRANSLATIONS.en[
				'modules/auth/components/auth-modal/auth-modal___inloggen-met-het-archief-account'
			],
	});
	await loginButtonInModal.click();

	// Check that we end up on the english idp page
	// Check for email address field
	const emailFieldLabel = page.locator('[for="username"]');
	await expect(emailFieldLabel).toBeVisible();
	await expect(emailFieldLabel).toHaveText('Email address');

	// Check for password field
	const passwordFieldLabel = page.locator('[for="password"]');
	await expect(passwordFieldLabel).toBeVisible();
	await expect(passwordFieldLabel).toHaveText('Password');

	// Check for password forget link
	const passwordForgetLink = page.locator('.password-forgot-link');
	await expect(passwordForgetLink).toBeVisible();
	await expect(passwordForgetLink).toHaveText('Forgot your password?');

	// Wait for close to save the videos
	await context.close();
});
