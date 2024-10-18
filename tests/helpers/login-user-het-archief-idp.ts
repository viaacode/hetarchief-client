import { expect, type Page } from '@playwright/test';

import { HOMEPAGE_TITLE } from '../consts/tests.consts';

import { getSiteTranslations, Locale } from './get-site-translations';
import { moduleClassSelector } from './module-class-locator';
import { waitForPageTitle } from './wait-for-page-title';

export async function loginUserHetArchiefIdp(
	page: Page,
	username: string,
	password: string,
	titleAfterLogin?: string,
	locale: Locale = Locale.Nl
): Promise<void> {
	const SITE_TRANSLATIONS = await getSiteTranslations();

	const loginOrRegisterLabel =
		SITE_TRANSLATIONS[locale][
			'modules/shared/layouts/app-layout/app-layout___inloggen-of-registreren'
		];
	const loginOrRegisterButton = page.locator('text=' + loginOrRegisterLabel).first();
	await expect(loginOrRegisterButton).toBeVisible();

	// Check auth modal is open
	const authModalHeading = page.locator(moduleClassSelector('c-auth-modal__heading')).first();
	if (!(await authModalHeading.isVisible())) {
		// Click on login or register
		await loginOrRegisterButton.click();
	}
	await expect(authModalHeading).toBeVisible();

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
	await waitForPageTitle(page, titleAfterLogin || HOMEPAGE_TITLE);
}
