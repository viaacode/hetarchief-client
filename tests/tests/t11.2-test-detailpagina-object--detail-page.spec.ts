import { expect, test } from '@playwright/test';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';

import { IconName } from '../consts/icon-names';
import { checkBladeTitle } from '../helpers/check-blade-title';
import { checkToastMessage } from '../helpers/check-toast-message';
import { clickOverflowButtonDetailPage } from '../helpers/click-overflow-button-detail-page';
import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';

test('T11.2: Test detailpagina object + materiaal aanvraag doen: detail pagina', async ({
	page,
	context,
}) => {
	const SITE_TRANSLATIONS = await getSiteTranslations();
	const DETAIL_PAGE_TITLE = '!11 - J19 QUOTE SABINE';

	// GO to the hetarchief homepage
	await goToPageAndAcceptCookies(
		page,
		context,
		`${process.env.TEST_CLIENT_ENDPOINT as string}/pid/${process.env.TEST_OBJECT_DETAIL_PAGE_VRT as string}`,
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

	// Get metadata sidebar width
	const pageDetailWrapper = page.locator(moduleClassSelector('p-object-detail__wrapper'));
	const sidebarSelector = ` > ${moduleClassSelector('p-object-detail__sidebar')}`;
	const sidebarWidthBeforeExpand =
		(await pageDetailWrapper.locator(sidebarSelector)?.boundingBox())?.width || 0;
	expect(sidebarWidthBeforeExpand).toBeGreaterThan(0);

	// Change metadata sidebar size
	let expanderButton = page.locator(moduleClassSelector('p-object-detail__expand-button'));
	await expect(expanderButton).toBeVisible();
	await expanderButton.click();

	// Wait for animation
	await page.waitForTimeout(2000);

	// Get sidebar width after expand
	const sidebarWidthAfterExpand =
		(await pageDetailWrapper.locator(sidebarSelector)?.boundingBox())?.width || 0;
	expect(sidebarWidthAfterExpand).toBeGreaterThan(0);

	// Check sidebar got wider
	expect(sidebarWidthAfterExpand).toBeGreaterThan(sidebarWidthBeforeExpand);

	// Collapse metadata sidebar
	expanderButton = page.locator(moduleClassSelector('p-object-detail__expand-button'));
	await expect(expanderButton).toBeVisible();
	await expanderButton.click();

	// Wait for animation
	await page.waitForTimeout(2000);

	/**
	 * Download metadata
	 */

	// Download metadata
	const exportMetadataLabel =
		SITE_TRANSLATIONS.nl['modules/ie-objects/object-detail-page___export-metadata-desktop'];
	const exportMetadataDropdown = page.locator(`[aria-label="${exportMetadataLabel}"]`);
	await expect(exportMetadataDropdown).toBeVisible();
	await exportMetadataDropdown.click();

	// Click on the download option
	const downloadAsCsvLabel =
		SITE_TRANSLATIONS.nl[
			'pages/bezoekersruimte/visitor-space-slug/object-id/index___exporteer-metadata-als-CSV'
		];
	const downloadCsvOption = page.locator('.c-dropdown__content-open .c-menu-content-item', {
		hasText: downloadAsCsvLabel,
	});
	await expect(downloadCsvOption).toBeVisible();

	// Wait for download events while clicking on the download csv button
	const [download] = await Promise.all([page.waitForEvent('download'), downloadCsvOption.click()]);
	const path = await download.path();
	expect(path).toBeDefined();

	// /**
	//  * Video player
	//  */
	// Playing video is disabled because we get error: unsupported media type
	// Check video is playing
	const player = page.locator('.flowplayer');
	await expect(player).toBeVisible();

	// Click player
	await player.click();

	// Check flowplayer starts playing
	await expect(player).toHaveClass(/is-playing/);

	// Get player size before fullscreen
	const playerSizeBeforeFullscreen =
		(await (await page.$('.flowplayer'))?.boundingBox())?.width || 0;

	// Make video fullscreen
	await page.hover('.flowplayer'); // Hover video so controls become visible
	await page.evaluate(() => {
		// biome-ignore lint/suspicious/noExplicitAny: test file
		(document?.querySelector('.fp-fullscreen') as any)?.click();
	});

	// Wait for fullscreen to open
	await page.waitForTimeout(1000);

	// Get player size after fullscreen
	const playerSizeAfterFullscreen =
		(await (await page.$('.flowplayer'))?.boundingBox())?.width || 0;

	// Check video size is bigger
	expect(playerSizeAfterFullscreen).toBeGreaterThan(playerSizeBeforeFullscreen);

	// Check video object keeps playing
	await expect(player).toBeVisible();
	await expect(player).toHaveClass(/is-playing/);

	// Press escape key
	await page.hover('.flowplayer'); // Hover video so controls become visible
	await page.evaluate(() => {
		// biome-ignore lint/suspicious/noExplicitAny: test file
		(document?.querySelector('.fp-fullscreen-exit') as any)?.click();
	});

	// Wait for fullscreen to close
	await page.waitForTimeout(1000);

	// Get player size after fullscreen
	const playerSizeAfterCloseFullscreen =
		(await (await page.$('.flowplayer'))?.boundingBox())?.width || 0;

	// Check video size to be smaller than fullscreen
	expect(playerSizeAfterCloseFullscreen).toBeLessThan(playerSizeAfterFullscreen);

	// Check video object keeps playing
	await expect(player).toBeVisible();
	await expect(player).toHaveClass(/is-playing/);

	// TODO Click on related item when more items are added to the database

	// Click the report button in the overflow menu
	await clickOverflowButtonDetailPage(page, IconName.Flag);

	// Check blade title
	await checkBladeTitle(
		page,
		SITE_TRANSLATIONS.nl['modules/visitor-space/components/report-blade/report-blade___rapporteren']
	);

	const emailInputField = page.locator('input#email');
	expect(await emailInputField.inputValue()).toEqual('hetarchief2.0+basisgebruiker2@meemoo.be');
	await expect(emailInputField).toBeDisabled();

	await page.fill('textarea#reportMessage', 'Dit is een automated test');

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
	const keywordLabel =
		SITE_TRANSLATIONS.nl['pages/bezoekersruimte/visitor-space-slug/object-id/index___trefwoorden'];
	const keywordSection = page.locator('.p-object-detail__metadata-component', {
		hasText: keywordLabel,
	});
	const firstKeyword = keywordSection.locator('.c-tag-list__item').first();
	await expect(firstKeyword).toBeVisible();
	await firstKeyword.click();

	// Check page url changes:
	await expect
		.poll(() => page.url(), { timeout: 10000 })
		.toContain('/zoeken?aanbieder=vrt&zoekterm=');

	// Check the search by keyword tag is present in the search input field
	const searchInput = page.locator('.c-tags-input__control');
	expect(await searchInput.innerHTML()).toContain(
		SITE_TRANSLATIONS.nl['modules/visitor-space/utils/map-filters/map-filters___trefwoord']
	);

	// Wait for close to save the videos
	await context.close();
});
