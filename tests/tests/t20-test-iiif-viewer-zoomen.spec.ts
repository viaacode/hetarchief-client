import { expect, test } from '@playwright/test';

import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { scrollWheelOverElement } from '../helpers/scroll-wheel-over-element';

test('T20: Test iiif viewer zoomen', async ({ page, context }) => {
	const SITE_TRANSLATIONS = await getSiteTranslations();
	const MAIN_SITE_TITLE =
		SITE_TRANSLATIONS.nl[
			'modules/shared/utils/seo/create-page-title/create-page-title___bezoekertool'
		];

	/**
	 * Go to a newspaper detail page ---------------------------------------------------------------
	 */
	await goToPageAndAcceptCookies(
		page,
		(process.env.TEST_CLIENT_ENDPOINT as string) + '/pid/h98z893q54',
		`Wet- en verordeningsblad voor de bezette streke... | ${MAIN_SITE_TITLE}`
	);

	// Go to page again to fix non-loading newspaper in incognito browser
	await page.goto((process.env.TEST_CLIENT_ENDPOINT as string) + '/pid/h98z893q54');

	// Check zoom in button is visible
	await expect(page.locator('.c-iiif-viewer__iiif__controls__zoom-in')).toBeVisible();

	// Click the zoom in button
	await page.locator('.c-iiif-viewer__iiif__controls__zoom-in').click();

	// Check zoom level changed in the url:
	expect(page.url()).toContain('zoomLevel=0.65');

	// Check zoom out button is visible
	await expect(page.locator('.c-iiif-viewer__iiif__controls__zoom-out')).toBeVisible();

	// Click the zoom out button
	await page.locator('.c-iiif-viewer__iiif__controls__zoom-out').click();

	// Check zoom level changed in the url:
	expect(page.url()).toContain('zoomLevel=0.455');

	// Zoom in with mouse wheel
	await scrollWheelOverElement(page, page.locator('.openseadragon-canvas').first(), -10);

	// Check zoom level changed in the url:
	expect(page.url()).toContain('zoomLevel=0.546');

	// Zoom in with mouse wheel
	await scrollWheelOverElement(page, page.locator('.openseadragon-canvas').first(), 10);

	// Check zoom level changed in the url:
	expect(page.url()).toContain('zoomLevel=0.455');

	// Wait for close to save the videos
	await context.close();
});
