import { expect, type Page } from '@playwright/test';

import { getSiteTranslations } from './get-site-translations';
import { moduleClassSelector } from './module-class-locator';

export async function acceptTos(page: Page): Promise<void> {
	const SITE_TRANSLATIONS = await getSiteTranslations();

	// Check title, content page content and disabled button
	await expect(page.locator(moduleClassSelector('p-terms-of-service__title'))).toContainText(
		SITE_TRANSLATIONS.nl['pages/gebruiksvoorwaarden/index___gebruiksvoorwaarden']
	);
	await expect(page.locator('.c-content-page-preview')).toContainText('Deze gebruiksvoorwaarden'); // This text is from the content page, so we can't use SITE_TRANSLATIONS
	const acceptTosButton = page.locator(
		moduleClassSelector('p-terms-of-service__buttons') + ' .c-button--black'
	);
	await expect(acceptTosButton).toHaveClass(/c-button--disabled/);

	// Scroll down
	const tosScrollableSelector = moduleClassSelector('p-terms-of-service__content');
	await page.evaluate((tosScrollableSelector) => {
		document.querySelector(tosScrollableSelector)?.scrollTo(0, 50000);
	}, tosScrollableSelector);

	// Wait for button to be available, otherwise this sometimes doesn't trigger the redirect to the homepage
	await new Promise((resolve) => setTimeout(resolve, 1000));

	// Check button becomes active
	await expect(acceptTosButton).not.toHaveClass(/c-button--disabled/);

	// Click the accept tos button
	await acceptTosButton.click();
}
