import { expect, type Page } from '@playwright/test';

import { getSiteTranslations } from './get-site-translations';
import { moduleClassSelector } from './module-class-locator';

export async function loginUserMeemooIdp(
	page: Page,
	username: string,
	password: string
): Promise<void> {
	const SITE_TRANSLATIONS = await getSiteTranslations();

	// Click on login or register
	await page
		.locator(
			'text=' +
				SITE_TRANSLATIONS.nl[
					'modules/shared/layouts/app-layout/app-layout___inloggen-of-registreren'
				]
		)
		.first()
		.click();

	// Check auth modal opens up
	const authModalHeading = page.locator(moduleClassSelector('c-auth-modal__heading')).first();
	expect(authModalHeading).toBeDefined();

	// Click the login button
	await page
		.locator('.c-button.c-button--black', {
			hasText:
				SITE_TRANSLATIONS.nl[
					'modules/auth/components/auth-modal/auth-modal___inloggen-met-het-archief-account'
				],
		})
		.click(); //Should be 'Inloggen met het Archief-account'

	// Fill in credentials
	await page.fill('#inputUsername', username);
	await page.fill('#inputPassword', password);

	// Click the login button and wait for the new page to load
	await Promise.all([page.click('#wp-submit'), page.waitForLoadState('networkidle')]);
}
