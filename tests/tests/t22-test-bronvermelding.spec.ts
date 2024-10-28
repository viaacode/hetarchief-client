import { expect, test } from '@playwright/test';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';

import { getClipboardValue } from '../helpers/get-clipboard-value';
import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';

test('T22: bronvermelding', async ({ page, context }) => {
	const SITE_TRANSLATIONS = await getSiteTranslations();
	await context.grantPermissions(['clipboard-read', 'clipboard-write']);

	/**
	 * Go to a newspaper detail page ---------------------------------------------------------------
	 */
	await goToPageAndAcceptCookies(
		page,
		(process.env.TEST_CLIENT_ENDPOINT as string) + '/pid/h98z893q54',
		'Wet- en verordeningsblad voor de bezette streke...'
	);

	// Scroll into view attribution metadata
	const attributionMetadata = page
		.locator(moduleClassSelector('c-metadata__item'), {
			hasText: SITE_TRANSLATIONS.nl['modules/ie-objects/ie-objects___bronvermelding'],
		})
		.first();
	await attributionMetadata.scrollIntoViewIfNeeded();

	// Check that it is visible
	await expect(attributionMetadata).toBeVisible();

	// Check that the text contains all required parts
	const attributionText = `onbekend, Wet- en verordeningsblad voor de bezette streken van België, KU Leuven Universiteitsbibliotheek, Public domein, ${
		process.env.TEST_CLIENT_ENDPOINT as string
	}/pid/h98z893q54`;
	await expect(attributionMetadata).toContainText(attributionText);

	// Click the copy button
	await attributionMetadata.locator('.c-button').click();

	// Check the clipboard contains the attribution text
	const clipboardText = getClipboardValue(page, context);
	await expect(clipboardText).resolves.toEqual(attributionText);

	// Wait for close to save the videos
	await context.close();
});
