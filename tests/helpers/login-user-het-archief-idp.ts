import { type Page, expect } from '@playwright/test';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';
import { Locale } from '@shared/utils/i18n';

import { HOMEPAGE_TITLE } from '../consts/tests.consts';

import { getSiteTranslations } from './get-site-translations';
import { waitForPageTitle } from './wait-for-page-title';

export async function loginUserHetArchiefIdp(
	page: Page,
	username: string,
	password: string,
	titleAfterLogin?: string,
	locale: Locale = Locale.nl
): Promise<void> {
	const SITE_TRANSLATIONS = await getSiteTranslations();

	const loginOrRegisterLabel =
		SITE_TRANSLATIONS[locale][
			'modules/shared/layouts/app-layout/app-layout___inloggen-of-registreren'
		];
	const loginOrRegisterButton = page.locator(`text=${loginOrRegisterLabel}`).first();
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
	await waitForPageTitle(page, titleAfterLogin || HOMEPAGE_TITLE, locale);
}
