import { expect, test } from '@playwright/test';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';

import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';

test('T19: Test OCR raadplegen', async ({ page, context }) => {
	/**
	 * Go to a newspaper detail page ---------------------------------------------------------------
	 */
	await goToPageAndAcceptCookies(
		page,
		(process.env.TEST_CLIENT_ENDPOINT as string) + '/pid/h98z893q54',
		'Wet- en verordeningsblad voor de bezette streke...'
	);

	// Go to page again to fix non-loading newspaper in incognito browser
	await page.goto((process.env.TEST_CLIENT_ENDPOINT as string) + '/pid/h98z893q54');

	// Check ocr tab exists
	await expect(page.locator('.c-tab--ocr')).toBeVisible();

	// Click the ocr tab
	await page.locator('.c-tab--ocr').click();

	// Wait for ocr to load
	await page.waitForSelector(
		`${moduleClassSelector('p-object-detail__ocr__words-container')} > ${moduleClassSelector(
			'p-object-detail__ocr__word'
		)}`
	);

	// Check if ocr text is visible in the tab
	const ocrWords = page.locator(
		`${moduleClassSelector('p-object-detail__ocr__words-container')} > ${moduleClassSelector(
			'p-object-detail__ocr__word'
		)}`
	);
	expect(await ocrWords.count()).toBeGreaterThan(100);

	// Search some words in the ocr text
	const ocrSidebar = page.locator(moduleClassSelector('p-object-detail__ocr__'));
	const ocrSearchField = ocrSidebar.locator(
		moduleClassSelector('c-search-with-results-pagination') + ' .c-input__field'
	);
	await expect(ocrSearchField).toBeVisible();
	await ocrSearchField.fill('Brussel');
	await page.keyboard.press('Enter');

	// Check keyword is active
	const brusselOcrWords = page.locator(
		`${moduleClassSelector('p-object-detail__ocr__words-container')} > ${moduleClassSelector(
			'p-object-detail__ocr__word'
		)}`,
		{ hasText: 'Brussel' }
	);
	await expect(brusselOcrWords.first()).toBeVisible();
	await expect(brusselOcrWords.first()).toHaveClass(/p-object-detail__ocr__word--marked--active/);

	// Check other words are marked but not active
	await expect(brusselOcrWords.nth(1)).toBeVisible();
	await expect(brusselOcrWords.nth(1)).toHaveClass(/p-object-detail__ocr__word--marked/);
	await expect(brusselOcrWords.nth(1)).not.toHaveClass(
		/p-object-detail__ocr__word--marked--active/
	);

	await expect(brusselOcrWords.nth(2)).toBeVisible();
	await expect(brusselOcrWords.nth(2)).toHaveClass(/p-object-detail__ocr__word--marked/);
	await expect(brusselOcrWords.nth(2)).not.toHaveClass(
		/p-object-detail__ocr__word--marked--active/
	);

	// Check highlight toggle button is not active
	const ocrHighlightToggleButton = page.locator('.c-iiif-viewer__iiif__controls__toggle-ocr');
	await expect(ocrHighlightToggleButton).toBeVisible();
	await expect(ocrHighlightToggleButton).not.toHaveClass(/c-button--green/);

	// Enable highlighting in viewer
	await ocrHighlightToggleButton.click();

	// Check highlight toggle button is active
	await expect(ocrHighlightToggleButton).toHaveClass(/c-button--green/);

	// Check all words are highlighted
	const ocrHighlightedWords = page.locator(
		'.openseadragon-canvas .c-iiif-viewer__iiif__alto__text'
	);
	await expect(ocrHighlightedWords.first()).toBeVisible();
	await expect(ocrHighlightedWords.nth(1)).toBeVisible();
	await expect(ocrHighlightedWords.nth(2)).toBeVisible();

	// Wait for close to save the videos
	await context.close();
});
