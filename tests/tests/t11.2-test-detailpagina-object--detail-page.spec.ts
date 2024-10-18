import { expect, test } from '@playwright/test';

import { checkBladeTitle } from '../helpers/check-blade-title';
import { checkToastMessage } from '../helpers/check-toast-message';
import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';
import { moduleClassSelector } from '../helpers/module-class-locator';

test('T11.2: Test detailpagina object + materiaal aanvraag doen: detail pagina', async ({
	page,
	context,
}) => {
	const SITE_TRANSLATIONS = await getSiteTranslations();
	const DETAIL_PAGE_TITLE = '!11 - J19 QUOTE SABINE';

	// GO to the hetarchief homepage
	await goToPageAndAcceptCookies(
		page,
		(process.env.TEST_CLIENT_ENDPOINT as string) +
			'/pid/' +
			(process.env.TEST_OBJECT_DETAIL_PAGE_VRT as string),
		DETAIL_PAGE_TITLE
	);

	// Login with existing user
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_2_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_2_PASSWORD as string,
		DETAIL_PAGE_TITLE
	);

	// TODO: step 19-21 // no data now to test
	/**
	 * Sidebar width
	 */

	// Get advanced-filters sidebar width
	const pageDetailWrapper = page.locator(moduleClassSelector('p-object-detail__wrapper'));
	const sidebarSelector = ' > ' + moduleClassSelector('p-object-detail__sidebar');
	const sidebarWidthBeforeExpand =
		(await pageDetailWrapper.locator(sidebarSelector)?.boundingBox())?.width || 0;
	expect(sidebarWidthBeforeExpand).toBeGreaterThan(0);

	// Change advanced-filters sidebar size
	await pageDetailWrapper.locator('text=expand-left').click();

	// Wait for animation
	await page.waitForTimeout(2000);

	// Get sidebar width after expand
	const sidebarWidthAfterExpand =
		(await pageDetailWrapper.locator(sidebarSelector)?.boundingBox())?.width || 0;
	expect(sidebarWidthAfterExpand).toBeGreaterThan(0);

	// Check sidebar got wider
	expect(sidebarWidthAfterExpand).toBeGreaterThan(sidebarWidthBeforeExpand);

	// Collapse advanced-filters sidebar
	await page.locator('.p-object-detail__wrapper').locator('text=expand-right').click();

	// Wait for animation
	await page.waitForTimeout(2000);

	/**
	 * Download advanced-filters
	 */

	// Download advanced-filters
	const downloadAsCsvLabel =
		SITE_TRANSLATIONS.nl[
			'pages/bezoekersruimte/visitor-space-slug/object-id/index___exporteer-metadata-als-CSV'
		];
	const exportMetadataLabel =
		SITE_TRANSLATIONS.nl['modules/ie-objects/const/index___exporteer-metadata'];
	const [download] = await Promise.all([
		page.waitForEvent('download'),
		page.locator(`[aria-label="${exportMetadataLabel}"]`).click(),
		page
			.locator('.p-object-detail__wrapper')
			.locator(`button:has-text("${downloadAsCsvLabel}")`)
			.click(),
	]);
	const path = await download.path();
	expect(path).toBeDefined();

	// /**
	//  * Video player //TODO: video player does not work on int
	//  */
	// Playing video is disabled because we get error: unsupported media type
	// Check video is playing
	// const player = await page.locator('.flowplayer');
	// await expect(player).toBeVisible();

	// Click player
	// await player.click();

	// Check flowplayer starts playing
	// await expect(player).toHaveClass(/is-playing/);

	// Get player size before fullscreen
	// const playerSizeBeforeFullscreen =
	// 	(await (await page.$('.flowplayer'))?.boundingBox())?.width || 0;

	// Make video fullscreen
	// await page.hover('.flowplayer'); // Hover video so controls become visible
	// await page.evaluate(() => {
	// 	(document?.querySelector('.fp-fullscreen') as any)?.click();
	// });

	// Wait for fullscreen to open
	// await page.waitForTimeout(1000);

	// Get player size after fullscreen
	// const playerSizeAfterFullscreen =
	// 	(await (await page.$('.flowplayer'))?.boundingBox())?.width || 0;

	// Check video size is bigger
	// await expect(playerSizeAfterFullscreen).toBeGreaterThan(playerSizeBeforeFullscreen);

	// Check video object keeps playing
	// await expect(player).toBeVisible();
	// await expect(player).toHaveClass(/is-playing/);

	// Press escape key
	// await page.hover('.flowplayer'); // Hover video so controls become visible
	// await page.evaluate(() => {
	// 	(document?.querySelector('.fp-fullscreen-exit') as any)?.click();
	// });

	// Wait for fullscreen to close
	// await page.waitForTimeout(1000);

	// Get player size after fullscreen
	// const playerSizeAfterCloseFullscreen =
	// 	(await (await page.$('.flowplayer'))?.boundingBox())?.width || 0;

	// Check video size to be smaller than fullscreen
	// await expect(playerSizeAfterCloseFullscreen).toBeLessThan(playerSizeAfterFullscreen);

	// Check video object keeps playing
	// await expect(player).toBeVisible();
	// await expect(player).toHaveClass(/is-playing/);

	// TODO Click on related item when more items are added to the database

	// Click report
	const reportButtonLabel = SITE_TRANSLATIONS.nl['modules/ie-objects/const/index___rapporteer'];
	await page.locator(`[aria-label=${reportButtonLabel}]`).click();

	// Check blade title
	await checkBladeTitle(
		page,
		SITE_TRANSLATIONS.nl[
			'modules/visitor-space/components/report-blade/report-blade___rapporteren'
		]
	);

	const emailInputField = page.locator('input#field');
	expect(await emailInputField.inputValue()).toEqual(
		'hetarchief2.0+ateindgebruikerbzt@meemoo.be'
	);
	await expect(emailInputField).toBeDisabled();

	await page.fill('textarea#field', 'Dit is een automated test');

	await page
		.locator('button > div > span', {
			hasText:
				SITE_TRANSLATIONS.nl[
					'modules/visitor-space/components/report-blade/report-blade___rapporteer'
				],
		})
		.click();

	await checkToastMessage(
		page,
		SITE_TRANSLATIONS.nl[
			'modules/visitor-space/components/report-blade/report-blade___gerapporteerd'
		]
	);

	/**
	 * Keyword links
	 */

	// Click on keyword
	// await page.locator(`${moduleClassSelector('c-metadata__list')} .c-tag-list__item`).first().click();

	// Check page url changes:
	// await expect.poll(() => page.url(), { timeout: 10000 }).toContain('/vrt?search=');

	// Check the search by keyword tag is present in the search input field
	// const searchInput = await page.locator('.c-tags-input__control');
	// await expect(await searchInput.innerHTML()).toContain(SITE_TRANSLATIONS.nl['modules/visitor-space/utils/map-filters/map-filters___trefwoord']);

	// Wait for close to save the videos
	await context.close();
});
