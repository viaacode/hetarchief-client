import { expect, test } from '@playwright/test';

import { getClipboardValue } from '../helpers/get-clipboard-value';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { moduleClassSelector } from '../helpers/module-class-locator';

test('T22: bronvermelding', async ({ page, context }) => {
	await context.grantPermissions(['clipboard-read', 'clipboard-write']);

	/**
	 * Go to a newspaper detail page ---------------------------------------------------------------
	 */
	await goToPageAndAcceptCookies(
		page,
		(process.env.TEST_CLIENT_ENDPOINT as string) + '/pid/h98z893q54',
		'Wet- en verordeningsblad voor de bezette streke... | hetarchief.be'
	);

	// Scroll into view attribution metadata
	const attributionMetadata = page
		.locator(moduleClassSelector('c-metadata__item'), {
			hasText: 'Bronvermelding',
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
