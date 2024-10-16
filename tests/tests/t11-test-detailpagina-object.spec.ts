import { expect, test } from '@playwright/test';

import { checkBladeTitle } from '../helpers/check-blade-title';
import { checkToastMessage } from '../helpers/check-toast-message';
import { clickToastMessageButton } from '../helpers/click-toast-message-button';
import { getFolderObjectCounts } from '../helpers/get-folder-object-counts';
import { getSearchTabBarCounts } from '../helpers/get-search-tab-bar-counts';
import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';
import { moduleClassSelector } from '../helpers/module-class-locator';

test('T11: Test detailpagina object + materiaal aanvraag doen', async ({ page, context }) => {
	const SITE_TRANSLATIONS = await getSiteTranslations();
	const FAVORITES_FOLDER_NAME =
		SITE_TRANSLATIONS.nl['modules/folders/controllers___default-collection-name'];
	const EXISTING_FOLDER_NEW_NAME = 'Bestaande map, nieuwe naam';

	// GO to the hetarchief homepage
	await goToPageAndAcceptCookies(page, process.env.TEST_CLIENT_ENDPOINT as string);

	// Login with existing user
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_PASSWORD as string
	);

	/**
	 * Go to search page VRT --------------------------------------------------------------------
	 */
	// Check navbar exists
	await expect(page.locator(`nav${moduleClassSelector('c-navigation')}`)).toBeVisible();
	await expect(
		page.locator(`a[href="/bezoek"] div${moduleClassSelector('c-badge')}`).first()
	).toContainText('1');
	// Click on "Bezoek een aanbieder" navigation item
	await page.click('text=Bezoek een aanbieder');

	// Wait for menu to fully open
	await page.waitForTimeout(1000);

	const subNavItems = await page
		.locator(`div${moduleClassSelector('c-menu c-menu--default')}`)
		.first()
		.locator('a')
		.allInnerTexts();
	expect(subNavItems[0]).toContain(
		SITE_TRANSLATIONS.nl[
			'modules/navigation/components/navigation/navigation___alle-bezoekersruimtes'
		]
	);
	expect(subNavItems[1]).toContain('VRT');
	await page.click('text=VRT');

	// Get tab counts before search
	const countsBeforeSearch = await getSearchTabBarCounts(page);

	// Enter search term
	const SEARCH_TERM = 'betfred'; // TODO: change this to 'betfred British Masters golf' when the int environment is not changing qs251fjp7m
	const searchField = page.locator('.c-tags-input__input-container').first();
	await searchField.click();
	await searchField.fill(SEARCH_TERM);
	await searchField.press('Enter');

	// Check green pill exists with search term inside
	const pill = page.locator('.c-tags-input__multi-value .c-tag__label');
	await expect(pill).toBeVisible();
	await expect(pill).toContainText(SEARCH_TERM);

	// Check tab counts decreased
	const countsAfterSearchByText = await getSearchTabBarCounts(page);

	// Expect counts to have gone down, or stay the same
	if (countsBeforeSearch.all > 0) {
		// Only check counts if there are at least a few items
		expect(countsBeforeSearch.all > countsAfterSearchByText.all).toBeTruthy();
		expect(countsBeforeSearch.video >= countsAfterSearchByText.video).toBeTruthy();
		expect(countsBeforeSearch.audio >= countsAfterSearchByText.audio).toBeTruthy();
	}

	// Check item contains search term
	const markedWord = await page
		.locator("[class^='MediaCardList_c-media-card-list__content__'] article mark")
		.first()
		.innerText();
	expect(markedWord.toLowerCase()).toEqual(SEARCH_TERM);

	// Bookmark this item
	// Click bookmark button
	const saveThisItemLabel =
		SITE_TRANSLATIONS.nl[
			'modules/visitor-space/components/visitor-space-search-page/visitor-space-search-page___sla-dit-item-op'
		];
	await page.locator(`[title="${saveThisItemLabel}"]`, { hasText: 'bookmark' }).first().click();

	// Check blade opens
	await expect(page.locator('.c-blade--active')).toBeVisible();

	// Check bookmark folder counts
	let bookmarkFolderCounts1 = await getFolderObjectCounts(page);
	expect(bookmarkFolderCounts1[FAVORITES_FOLDER_NAME]).toEqual(0);
	expect(bookmarkFolderCounts1[EXISTING_FOLDER_NEW_NAME]).toBeUndefined();

	// Add object to Favorites folder
	let folderList = page.locator(
		`.c-blade--active ${moduleClassSelector('c-add-to-folder-blade__list')}`
	);
	let checkboxes = folderList.locator('.c-checkbox__check-icon');
	expect(await checkboxes.count()).toEqual(1);
	await checkboxes.first().click();

	// Check count changes to 1
	let bookmarkFolderCounts2 = await getFolderObjectCounts(page);
	expect(bookmarkFolderCounts2[FAVORITES_FOLDER_NAME]).toEqual(1);
	expect(bookmarkFolderCounts2[EXISTING_FOLDER_NEW_NAME]).toBeUndefined();

	// Click the add button
	await page.locator('.c-blade--active').locator('.c-button', { hasText: 'Voeg toe' }).click();

	// Blade closes
	await expect(page.locator('.c-blade--active')).not.toBeVisible();

	// Toast message
	await checkToastMessage(
		page,
		SITE_TRANSLATIONS.nl[
			'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___item-toegevoegd-aan-map-titel'
		]
	);
	await clickToastMessageButton(page);

	// Go to the following url
	await page.goto(
		((process.env.TEST_CLIENT_ENDPOINT as string) +
			'/zoeken' +
			(process.env.TEST_OBJECT_DETAIL_PAGE_VRT as string)) as string
	);

	/**
	 * Detail page --------------------------------------------------------------------
	 */

	// Check page title
	expect(
		await page.locator('.p-object-detail__metadata-content h3').first().innerText()
	).toContain('Gouden Schoen');

	/**
	 * Bookmark button
	 */

	// Click bookmark button
	await page
		.locator('.p-object-detail__metadata-content .c-button.c-button--silver.c-button--icon', {
			hasText: 'bookmark',
		})
		.first()
		.click();

	// Check blade opens
	await expect(page.locator('.c-blade--active')).toBeVisible();

	// Check bookmark folder counts
	bookmarkFolderCounts1 = await getFolderObjectCounts(page);
	expect(bookmarkFolderCounts1[FAVORITES_FOLDER_NAME]).toEqual(1);
	expect(bookmarkFolderCounts1[EXISTING_FOLDER_NEW_NAME]).toBeUndefined();

	// Add object to Favorites folder
	folderList = page.locator(
		`.c-blade--active ${moduleClassSelector('c-add-to-folder-blade__list')}`
	);
	checkboxes = folderList.locator('.c-checkbox__check-icon');
	expect(await checkboxes.count()).toEqual(1);
	await checkboxes.first().click();

	// Check count changes to 1
	bookmarkFolderCounts2 = await getFolderObjectCounts(page);
	expect(bookmarkFolderCounts2[FAVORITES_FOLDER_NAME]).toEqual(2);
	expect(bookmarkFolderCounts2[EXISTING_FOLDER_NEW_NAME]).toBeUndefined();

	// Click the add button
	await page
		.locator('.c-blade--active')
		.locator('.c-button', {
			hasText:
				SITE_TRANSLATIONS.nl[
					'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___voeg-toe'
				],
		})
		.click();

	// Blade closes
	await expect(page.locator('.c-blade--active')).not.toBeVisible();

	// Toast message
	await checkToastMessage(
		page,
		SITE_TRANSLATIONS.nl[
			'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___item-toegevoegd-aan-map-titel'
		]
	);
	await clickToastMessageButton(page);

	// TODO: step 19-21 // no data now to test
	/**
	 * Sidebar width
	 */

	// Get advanced-filters sidebar width
	const sidebarWidthBeforeExpand =
		(await (await page.$('.p-object-detail__metadata'))?.boundingBox())?.width || 0;
	expect(sidebarWidthBeforeExpand).toBeGreaterThan(0);

	// Change advanced-filters sidebar size
	await page.locator('.p-object-detail__wrapper').locator('text=expand-left').click();

	// Wait for animation
	await page.waitForTimeout(2000);

	// Get sidebar width after expand
	const sidebarWidthAfterExpand =
		(await (await page.$('.p-object-detail__metadata'))?.boundingBox())?.width || 0;
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

	/**
	 * Request item
	 */

	// First we go to a non VRT object
	await page.goto(
		((process.env.TEST_CLIENT_ENDPOINT as string) +
			'/zoeken' +
			(process.env.TEST_OBJECT_DETAIL_PAGE_AMSAB as string)) as string
	);

	const addToListLabel =
		SITE_TRANSLATIONS.nl[
			'modules/ie-objects/const/index___toevoegen-aan-aanvraaglijst-desktop'
		];
	await page.locator(`[aria-label="${addToListLabel}"]`).click();

	const addToRequestsLabel =
		SITE_TRANSLATIONS.nl[
			'modules/visitor-space/components/material-request-blade/material-request-blade___voeg-toe'
		];
	page.locator('text=' + addToRequestsLabel);

	// Click 'Ik wil dit materiaal hergebruiken'
	const reuseLabel =
		SITE_TRANSLATIONS.nl[
			'modules/visitor-space/components/material-request-blade/material-request-blade___reuse'
		];
	await page.locator('text=' + reuseLabel).click();

	// Click 'Voeg toe aan aanvraaglijst en zoek verder'
	const addToRequestListAndSearchLabel =
		SITE_TRANSLATIONS.nl[
			'modules/visitor-space/components/material-request-blade/material-request-blade___voeg-toe-en-zoek'
		];
	await page.locator('text=' + addToRequestListAndSearchLabel).click();

	// Toast message
	await checkToastMessage(
		page,
		SITE_TRANSLATIONS.nl[
			'modules/visitor-space/components/material-request-blade/material-request-blade___succes'
		]
	);
	await clickToastMessageButton(page);

	// Click request list icon
	await page
		.locator(`nav span${moduleClassSelector('MaterialRequestCenterButton')}`, {
			hasText: 'request',
		})
		.click();
	// await checkBladeTitle(page, 'Aanvraaglijst');

	// Click 'Vul gegevens aan en verstuur'
	const confirmYourInfoLabel =
		SITE_TRANSLATIONS.nl[
			'modules/navigation/components/material-request-center-blade/material-request-center-blade___vul-gegevens-aan'
		];
	await page.locator('text=' + confirmYourInfoLabel).click();

	// Check if the title of the blade is now 'Persoonlijke gegevens'
	// await expect(page.locator('.c-blade--active')).toBeVisible({ timeout: 10000 });
	// const bladeTitle = await page.locator(
	// 	`.c-blade--active ${moduleClassSelector('c-personal-info-blade__title')}`
	// );
	// await expect(bladeTitle).toContainText('Persoonlijke gegevens');
	// await expect(bladeTitle).toBeVisible();

	// Expect firstname, lastname and email address to be filled in, organisation to be empty
	const prefilledData = await page
		.locator(moduleClassSelector('c-personal-info-blade__content-value'))
		.allInnerTexts();
	expect(prefilledData).toContain('BezoekerVoornaam-auto-2 BezoekerAchternaam');
	expect(prefilledData).toContain('hetarchief2.0+ateindgebruikerbzt@meemoo.be');
	expect(prefilledData[2]).toEqual('');

	// Click 'ik vraag het materiaal op in het kader van mijn beroep (uitgezonderd onderwijs)'
	await page
		.locator(
			'text=' +
				SITE_TRANSLATIONS.nl[
					'modules/navigation/components/personal-info-blade/personal-info-blade___requester-capacity-work'
				]
		)
		.click();

	// Click 'Verstuur aanvraag'
	await page
		.locator(
			'text=' +
				SITE_TRANSLATIONS.nl[
					'modules/navigation/components/personal-info-blade/personal-info-blade___verstuur'
				]
		)
		.click();

	// Toast message
	await checkToastMessage(
		page,
		SITE_TRANSLATIONS.nl[
			'modules/navigation/components/personal-info-blade/personal-info-blade___verzenden-succes'
		]
	);
	await clickToastMessageButton(page);

	// Check blade is closed
	await expect(page.locator('.c-blade--active')).not.toBeVisible();

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
