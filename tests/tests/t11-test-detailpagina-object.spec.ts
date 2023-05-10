import { expect, test } from '@playwright/test';

import { acceptCookies } from '../helpers/accept-cookies';
import { checkToastMessage } from '../helpers/check-toast-message';
import { clickToastMessageButton } from '../helpers/click-toast-message-button';
import { getFolderObjectCounts } from '../helpers/get-folder-object-counts';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';
import { getSearchTabBarCounts } from '../helpers/get-search-tab-bar-counts';

test.use({
	viewport: { width: 1400, height: 850 },
});
test('T11: Test detailpagina object', async ({ page, context }) => {
	// GO to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

	// Check homepage title
	await page.waitForFunction(() => document.title === 'hetarchief.be', null, {
		timeout: 10000,
	});

	// // Accept all cookies
	// await acceptCookies(page, 'all'); //Enable when on int

	// Login with existing user
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_PASSWORD as string
	);

	// Check homepage title
	await page.waitForFunction(() => document.title === 'hetarchief.be', null, {
		timeout: 10000,
	});

	/**
	 * Go to search page VRT --------------------------------------------------------------------
	 */
	// Check navbar exists
	await expect(page.locator('nav[class^=Navigation_c-navigation]')).toBeVisible();
	await expect(page.locator('a[href="/bezoek"] div[class^="c-badge"]').first()).toContainText(
		'1'
	);
	// Click on "Bezoek een aanbieder" navigation item
	await page.click('text=Bezoek een aanbieder');

	const subNavItems = await page
		.locator('div[class^="c-menu c-menu--default"]')
		.first()
		.locator('a')
		.allInnerTexts();
	await expect(subNavItems).toContain('Zoeken naar bezoekersruimtes');
	await expect(subNavItems[1]).toMatch(/VRT.*/);
	await page.click('text=VRT');

	/**
	 * Go to search page VRT --------------------------------------------------------------------
	 */

	// // Click on "start you visit" navigation item
	// await page.goto(
	// 	((process.env.TEST_CLIENT_ENDPOINT as string) +
	// 		process.env.TEST_OBJECT_DETAIL_PAGE_VRT) as string
	// );

	// // Wait for detail page to load
	// await page.waitForFunction(
	// 	() => document.querySelectorAll('.p-object-detail__metadata-content').length > 0,
	// 	null,
	// 	{
	// 		timeout: 10000,
	// 	}
	// );

	// // Check VRT in sub navigation
	// const subNavigationTitle = await page.locator(
	// 	'.p-object-detail [class*="Navigation_c-navigation"] h1'
	// );
	// await expect(subNavigationTitle).toBeVisible();
	// await expect(subNavigationTitle).toContainText('VRT');
	// Get tab counts before search
	const countsBeforeSearch = await getSearchTabBarCounts(page);

	// Enter search term
	const SEARCH_TERM = 'schoen';
	const searchField = await page.locator('.c-tags-input__input-container').first();
	await searchField.click();
	await searchField.type(SEARCH_TERM);
	await searchField.press('Enter');

	// Check green pill exists with search term inside
	const pill = await page.locator('.c-tags-input__multi-value .c-tag__label');
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
	await expect(markedWord.toLowerCase()).toEqual(SEARCH_TERM);

	// Click on the found object
	const foundObjectButton = await page
		.locator(
			"[class^='MediaCardList_c-media-card-list__content__'] [class^='c-card__title-wrapper'] a"
		)
		.first();

	await foundObjectButton.click();

	// For some reason it doesnt always go to the page after clicking
	await page.goto(
		((process.env.TEST_CLIENT_ENDPOINT as string) +
			'/zoeken/vrt/3cdc6c0a301b45a599bcd969529850dae1f77cc02670470dad09d51b0d3249b2d3e2b291fac74b0bb0a46d44de609144?searchTerms=schoen') as string
	);

	/**
	 * Detail page --------------------------------------------------------------------
	 */

	// Check page title
	await expect(
		await page.locator(
			'.p-object-detail__metadata-content h3:has-text("Gouden Schoen - Eerste Gouden Schoen voor Tine De Caigny")'
		)
	).toBeVisible();

	/**
	 * Bookmark button
	 */

	// Click bookmark button
	await page.locator('[title="Sla dit item op"]', { hasText: 'bookmark' }).click();

	// Check blade opens
	await expect(page.locator('.c-blade--active')).toBeVisible();

	// Check bookmark folder counts
	const bookmarkFolderCounts1 = await getFolderObjectCounts(page);
	expect(bookmarkFolderCounts1['Favorieten']).toEqual(0);
	expect(bookmarkFolderCounts1['Bestaande map, nieuwe naam']).toBeUndefined();

	// Add object to Favorites folder
	const folderList = await page.locator(
		'.c-blade--active [class*="AddToFolderBlade_c-add-to-folder-blade__list__"]'
	);
	const checkboxes = await folderList.locator('.c-checkbox__input');
	expect(await checkboxes.count()).toEqual(1);
	await checkboxes.first().check();

	// Check count changes to 1
	const bookmarkFolderCounts2 = await getFolderObjectCounts(page);
	expect(bookmarkFolderCounts2['Favorieten']).toEqual(1);
	expect(bookmarkFolderCounts2['Bestaande map, nieuwe naam']).toBeUndefined();

	// Click the add button
	await page.locator('.c-blade--active').locator('.c-button', { hasText: 'Voeg toe' }).click();

	// Blade closes
	await expect(page.locator('.c-blade--active')).not.toBeVisible();

	// Toast message
	await checkToastMessage(page, 'Item toegevoegd aan map');
	await clickToastMessageButton(page);

	/**
	 * Sidebar width
	 */

	// Get metadata sidebar width
	const sidebarWidthBeforeExpand =
		(await (await page.$('.p-object-detail__metadata'))?.boundingBox())?.width || 0;
	expect(sidebarWidthBeforeExpand).toBeGreaterThan(0);

	// Change metadata sidebar size
	await page.locator('.p-object-detail__wrapper').locator('text=expand-left').click();

	// Wait for animation
	await page.waitForTimeout(2000);

	// Get sidebar width after expand
	const sidebarWidthAfterExpand =
		(await (await page.$('.p-object-detail__metadata'))?.boundingBox())?.width || 0;
	expect(sidebarWidthAfterExpand).toBeGreaterThan(0);

	// Check sidebar got wider
	expect(sidebarWidthAfterExpand).toBeGreaterThan(sidebarWidthBeforeExpand);

	// Collapse metadata sidebar
	await page.locator('.p-object-detail__wrapper').locator('text=expand-right').click();

	// Wait for animation
	await page.waitForTimeout(2000);

	/**
	 * Download metadata
	 */

	// Download metadata
	const [download] = await Promise.all([
		page.waitForEvent('download'),
		page.locator('[aria-label="Exporteer metadata"]').click(),
		page
			.locator('.p-object-detail__wrapper')
			.locator('button:has-text("Exporteer metadata als CSV")')
			.click(),
	]);
	const path = await download.path();
	await expect(path).toBeDefined();

	/**
	 * Video player
	 */
	// Playing video is disabled because we get error: unsupported media type
	// // Check video is playing
	// const player = await page.locator('.flowplayer');
	// await expect(player).toBeVisible();

	// // Click player
	// await player.click();

	// // Check flowplayer starts playing
	// await expect(player).toHaveClass(/is-playing/);

	// // // Get player size before fullscreen
	// // const playerSizeBeforeFullscreen =
	// // 	(await (await page.$('.flowplayer'))?.boundingBox())?.width || 0;
	// //
	// // // Make video fullscreen
	// // await page.hover('.flowplayer'); // Hover video so controls become visible
	// // await page.evaluate(() => {
	// // 	(document?.querySelector('.fp-fullscreen') as any)?.click();
	// // });
	// //
	// // // Wait for fullscreen to open
	// // await page.waitForTimeout(1000);
	// //
	// // // Get player size after fullscreen
	// // const playerSizeAfterFullscreen =
	// // 	(await (await page.$('.flowplayer'))?.boundingBox())?.width || 0;
	// //
	// // // Check video size is bigger
	// // await expect(playerSizeAfterFullscreen).toBeGreaterThan(playerSizeBeforeFullscreen);

	// // Check video object keeps playing
	// await expect(player).toBeVisible();
	// await expect(player).toHaveClass(/is-playing/);

	// // Press escape key
	// await page.hover('.flowplayer'); // Hover video so controls become visible
	// await page.evaluate(() => {
	// 	(document?.querySelector('.fp-fullscreen-exit') as any)?.click();
	// });

	// // // Wait for fullscreen to close
	// // await page.waitForTimeout(1000);
	// //
	// // // Get player size after fullscreen
	// // const playerSizeAfterCloseFullscreen =
	// // 	(await (await page.$('.flowplayer'))?.boundingBox())?.width || 0;
	// //
	// // // Check video size to be smaller than fullscreen
	// // await expect(playerSizeAfterCloseFullscreen).toBeLessThan(playerSizeAfterFullscreen);

	// // Check video object keeps playing
	// await expect(player).toBeVisible();
	// await expect(player).toHaveClass(/is-playing/);

	// TODO Click on related item when more items are added to the database

	/**
	 * Keyword links
	 */

	// Click on keyword
	await page.locator('[class^="Metadata_c-metadata__list__"] .c-tag-list__item').first().click();

	// Check page url changes:
	await expect.poll(() => page.url(), { timeout: 10000 }).toContain('/vrt?search=');

	// Check the search by keyword tag is present in the search input field
	const searchInput = await page.locator('.c-tags-input__control');
	await expect(await searchInput.innerHTML()).toContain('Trefwoord');

	// Wait for close to save the videos
	await context.close();
});
