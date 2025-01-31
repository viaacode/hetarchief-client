import { expect, test } from '@playwright/test';

import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { isElementFullscreen } from '../helpers/is-element-fullscreen';

test('T17: Test iiif viewer fullscreen', async ({ page, context }) => {
	/**
	 * Go to a newspaper detail page ---------------------------------------------------------------
	 */
	await goToPageAndAcceptCookies(
		page,
		`${process.env.TEST_CLIENT_ENDPOINT as string}/pid/h98z893q54`,
		'Wet- en verordeningsblad voor de bezette streke...'
	);

	// Go to page again to fix non-loading newspaper in incognito browser
	await page.goto(`${process.env.TEST_CLIENT_ENDPOINT as string}/pid/h98z893q54`);

	// Check fullscreen button exists
	await expect(page.locator('.c-iiif-viewer__iiif__controls__fullscreen')).toBeVisible();

	// Click the fullscreen button
	await page.locator('.c-iiif-viewer__iiif__controls__fullscreen').click();

	// Check iif viewer is fullscreen
	const iiifViewerElementFullscreen = page.locator('.fullpage > .openseadragon-container');
	expect(await isElementFullscreen(page, iiifViewerElementFullscreen)).toEqual(true);

	// Close fullscreen by clicking the close button
	await page.locator('.c-iiif-viewer__iiif__close-fullscreen').click();

	// Check iiif viewer is not fullscreen
	await expect(iiifViewerElementFullscreen).not.toBeVisible();

	// Wait for close to save the videos
	await context.close();
});
