import { type Page } from '@playwright/test';
import { Locale } from '@shared/utils/i18n';

import { getSiteTranslations } from './get-site-translations';

/**
 * Check if the page title is equal to the partial title + ' | ' + MAIN_SITE_TITLE
 * @param page
 * @param partialTitle
 * @param locale
 */
export async function waitForPageTitle(
	page: Page,
	partialTitle: string,
	locale: Locale = Locale.nl
): Promise<void> {
	const SITE_TRANSLATIONS = await getSiteTranslations();
	const MAIN_SITE_TITLE =
		SITE_TRANSLATIONS[locale][
			'modules/shared/utils/seo/create-page-title/create-page-title___bezoekertool'
		];

	try {
		await page.waitForFunction(
			(title: string) => document.title === title,
			`${partialTitle} | ${MAIN_SITE_TITLE}`,
			{
				timeout: 10000,
			}
		);
	} catch (err: any) {
		(
			err as Error
		).message = `The page title was not the expected value after 10 seconds. Expected: ${partialTitle} | ${MAIN_SITE_TITLE}, received: ${await page.title()}`;
		throw err;
	}
}
