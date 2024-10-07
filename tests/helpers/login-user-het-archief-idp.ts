import { expect, type Page } from '@playwright/test';

import { type Locale } from './get-site-translations';

export async function loginUserHetArchiefIdp(
	page: Page,
	username: string,
	password: string,
	titleAfterLogin = 'Homepagina hetarchief | hetarchief.be',
	locale: Locale,
	SITE_TRANSLATIONS: Record<Locale, Record<string, string>>
): Promise<void> {
	const loginOrRegisterLabel =
		SITE_TRANSLATIONS[locale][
			'modules/shared/layouts/app-layout/app-layout___inloggen-of-registreren'
		];
	const loginOrRegisterButton = page.locator('text=' + loginOrRegisterLabel).first();
	await expect(loginOrRegisterButton).toBeVisible();

	// Check auth modal is open
	const authModalHeading = page.locator('[class*="AuthModal_c-auth-modal__heading"]').first();
	if (!(await authModalHeading.isVisible())) {
		// Click on login or register
		await loginOrRegisterButton.click();
	}
	await expect(page.locator('[class*="AuthModal_c-auth-modal__heading"]').first()).toBeVisible();

	// Click the login button
	await page
		.locator('.c-button.c-button--black', {
			hasText:
				SITE_TRANSLATIONS[locale][
					'modules/auth/components/auth-modal/auth-modal___inloggen-met-het-archief-account'
				],
		})
		.click(); //Should be 'Inloggen met het Archief-account'

	// Fill in credentials
	await page.fill('#username', username);
	await page.fill('#password', password);

	// Click the login button
	await page.click('button[type="submit"]');

	// Wait for site to load after login
	await page.waitForFunction(
		(titleAfterLogin: string) => document.title === titleAfterLogin,
		titleAfterLogin,
		{
			timeout: 10000,
		}
	);
}
