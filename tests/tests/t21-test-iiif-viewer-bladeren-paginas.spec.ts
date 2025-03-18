import { expect, test } from '@playwright/test';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';

import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';

test('T21: iiif viewer bladeren paginas', async ({ page, context }) => {
	/**
	 * Go to a newspaper detail page ---------------------------------------------------------------
	 */
	await goToPageAndAcceptCookies(
		page,
		context,
		`${process.env.TEST_CLIENT_ENDPOINT as string}/pid/h98z893q54`,
		'Wet- en verordeningsblad voor de bezette streke...'
	);

	// Go to page again to fix non-loading newspaper in incognito browser
	await page.goto(`${process.env.TEST_CLIENT_ENDPOINT as string}/pid/h98z893q54`);

	// Navigation with thumbnail buttons ---------------------------------------------------------------

	// Check second page thumbnail button is visible
	const secondPageThumbnail = page.locator(
		`${moduleClassSelector('c-iiif-viewer__iiif__reference-strip')} [alt="page 2"]`
	);
	await expect(secondPageThumbnail).toBeVisible();

	// Click second page thumbnail button
	await secondPageThumbnail.click();

	// Check page url changed
	expect(page.url()).toContain('activePage=1');

	// Check first page thumbnail button is visible
	const firstPageThumbnail = page.locator(
		`${moduleClassSelector('c-iiif-viewer__iiif__reference-strip')} [alt="page 1"]`
	);
	await expect(firstPageThumbnail).toBeVisible();

	// Click first page thumbnail button
	await firstPageThumbnail.click();

	// Check page url changed
	expect(page.url()).toContain('activePage=0');

	// Navigation with previous/next page buttons ---------------------------------------------------------------

	// Check next page button is visible
	const nextPageButton = page.locator('.c-iiif-viewer__iiif__controls__grid-view__next-image');
	await expect(nextPageButton).toBeVisible();

	// Click second page thumbnail button
	await nextPageButton.click();

	// Check page url changed
	expect(page.url()).toContain('activePage=1');

	// Check previous page button is visible
	const previousPageButton = page.locator(
		'.c-iiif-viewer__iiif__controls__grid-view__previous-image'
	);
	await expect(previousPageButton).toBeVisible();

	// Click first page thumbnail button
	await previousPageButton.click();

	// Check page url changed
	expect(page.url()).toContain('activePage=0');

	// Wait for close to save the videos
	await context.close();
});
