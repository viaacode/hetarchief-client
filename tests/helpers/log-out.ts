import { type Page } from '@playwright/test';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';

import { HOMEPAGE_TITLE } from '../consts/tests.consts';

import { getSiteTranslations } from './get-site-translations';
import { waitForPageTitle } from './wait-for-page-title';

export async function logout(page: Page): Promise<void> {
	const SITE_TRANSLATIONS = await getSiteTranslations();

	// Click the avatar
	await page.locator(moduleClassSelector('c-navigation__list') + ' .c-avatar').click();

	// Click the logout option
	await page
		.locator('.c-dropdown-menu__item', {
			hasText: SITE_TRANSLATIONS.nl['modules/navigation/const/index___log-uit'],
		})
		.click();

	// Wait for homepage to load
	await waitForPageTitle(page, HOMEPAGE_TITLE);
}
