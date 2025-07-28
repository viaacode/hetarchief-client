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
	const NEWSPAPER_PAGE_TITLE = 'De toekomst: weekblad voor de arrondissementen ...';
	await goToPageAndAcceptCookies(
		page,
		context,
		`${process.env.TEST_CLIENT_ENDPOINT as string}/pid/${process.env.TEST_OBJECT_KRANT_1}`,
		NEWSPAPER_PAGE_TITLE
	);

	// Scroll into view attribution metadata
	const attributionLabel = SITE_TRANSLATIONS.nl['modules/ie-objects/ie-objects___bronvermelding'];
	const attributionMetadata = page
		.locator(moduleClassSelector('c-metadata__item'), {
			hasText: attributionLabel,
		})
		.first();
	await attributionMetadata.scrollIntoViewIfNeeded();

	// Check that it is visible
	await expect(attributionMetadata).toBeVisible();

	// Check that the text contains all required parts
	const attributionText = `onbekend, De toekomst: weekblad voor de arrondissementen Gent-Eecloo 1911-03-19, Amsab-ISG, Copyright undetermined, ${
		process.env.TEST_CLIENT_ENDPOINT as string
	}/pid/${process.env.TEST_OBJECT_KRANT_1}`;
	await expect(attributionMetadata).toContainText(attributionText);

	// Click the copy button
	await attributionMetadata.locator('.c-button').click();

	// Check the clipboard contains the attribution text
	const clipboardText = getClipboardValue(page, context);
	await expect(clipboardText).resolves.toEqual(attributionText);

	// Wait for close to save the videos
	await context.close();
});
