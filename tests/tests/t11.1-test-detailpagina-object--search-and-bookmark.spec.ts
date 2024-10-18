import { expect, test } from '@playwright/test';

import { IconName } from '../consts/icon-names';
import { checkToastMessage } from '../helpers/check-toast-message';
import { clickToastMessageButton } from '../helpers/click-toast-message-button';
import { getFolderObjectCounts } from '../helpers/get-folder-object-counts';
import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';
import { moduleClassSelector } from '../helpers/module-class-locator';

test('T11: Test detailpagina object + materiaal aanvraag doen: search en bookmark item', async ({
	page,
	context,
}) => {
	const SITE_TRANSLATIONS = await getSiteTranslations();
	const SEARCH_PAGE_TITLE = SITE_TRANSLATIONS.nl['pages/zoeken/index___zoeken-pagina-titel'];
	const FAVORITES_FOLDER_NAME =
		SITE_TRANSLATIONS.nl['modules/folders/controllers___default-collection-name'];
	const SECOND_FOLDER_NAME = 'test folder 2';

	// GO to the hetarchief homepage
	await goToPageAndAcceptCookies(
		page,
		(process.env.TEST_CLIENT_ENDPOINT as string) + '/zoeken?aanbieder=vrt',
		SEARCH_PAGE_TITLE
	);

	// Login with existing user
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_2_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_2_PASSWORD as string,
		SEARCH_PAGE_TITLE
	);

	// TODO this test fails because there is only one item in the visitor space of VRT. Once more items are added to INT we can uncomment this
	// Get tab counts before search
	// const countsBeforeSearch = await getSearchTabBarCounts(page);

	// Enter search term
	const SEARCH_TERM = 'J19 QUOTE SABINE'; // t43hx4m77d
	const searchField = page.locator('.c-tags-input__input-container').first();
	await searchField.click();
	await searchField.pressSequentially(SEARCH_TERM);
	await searchField.press('Enter');

	// Check green pill exists with search term inside
	const pill = page.locator('.c-tags-input__multi-value .c-tag__label');
	await expect(pill).toBeVisible();
	await expect(pill).toContainText(SEARCH_TERM);

	// Wait for filtered search results
	await new Promise((resolve) => setTimeout(resolve, 2 * 1000));

	// TODO this test fails because there is only one item in the visitor space of VRT. Once more items are added to INT we can uncomment this
	// Check tab counts decreased
	// const countsAfterSearchByText = await getSearchTabBarCounts(page);

	// Expect counts to have gone down, or stay the same
	// compareSearchTabCountsLessThen(countsBeforeSearch, countsAfterSearchByText);

	// Check item contains search term
	const markedWord = await page
		.locator(moduleClassSelector('c-media-card-list__content') + ' article mark')
		.first()
		.innerText();
	expect(markedWord.toLowerCase()).toEqual(SEARCH_TERM.split(' ')[0].toLowerCase());

	// Bookmark this item
	// Click bookmark button
	const saveThisItemLabel =
		SITE_TRANSLATIONS.nl[
			'modules/visitor-space/components/visitor-space-search-page/visitor-space-search-page___sla-dit-item-op'
		];
	await page
		.locator(`[title="${saveThisItemLabel}"]`, { hasText: IconName.Bookmark })
		.first()
		.click();

	// Check blade opens
	await expect(page.locator('.c-blade--active')).toBeVisible();

	// Check bookmark folder counts
	let bookmarkFolderCounts1 = await getFolderObjectCounts(page);
	expect(bookmarkFolderCounts1[FAVORITES_FOLDER_NAME]).toEqual(0);
	expect(bookmarkFolderCounts1[SECOND_FOLDER_NAME]).toEqual(0);

	// Add object to Favorites folder
	let folderList = page.locator(
		`.c-blade--active ${moduleClassSelector('c-add-to-folder-blade__list')}`
	);
	let checkboxes = folderList.locator('.c-checkbox__check-icon');
	expect(await checkboxes.count()).toEqual(2);
	await checkboxes.first().click();

	// Check count changes to 1
	let bookmarkFolderCounts2 = await getFolderObjectCounts(page);
	expect(bookmarkFolderCounts2[FAVORITES_FOLDER_NAME]).toEqual(1);
	expect(bookmarkFolderCounts2[SECOND_FOLDER_NAME]).toEqual(0);

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

	// Go to the following url
	await page.goto(
		((process.env.TEST_CLIENT_ENDPOINT as string) +
			'/pid/' +
			(process.env.TEST_OBJECT_DETAIL_PAGE_STUIFZAND as string)) as string
	);

	/**
	 * Detail page --------------------------------------------------------------------
	 */

	// Check page title
	await expect(
		page.locator(moduleClassSelector('p-object-detail__metadata-content') + ' h3').first()
	).toContainText('Het Annoncenblad van Mol en omliggende dorpen'); // w950g5230s

	/**
	 * Bookmark button
	 */

	// Click bookmark button
	await page
		.locator('.p-object-detail__primary-actions .c-button', {
			hasText: IconName.Bookmark,
		})
		.first()
		.click();

	// Check blade opens
	await expect(page.locator('.c-blade--active')).toBeVisible();

	// Check bookmark folder counts
	bookmarkFolderCounts1 = await getFolderObjectCounts(page);
	expect(bookmarkFolderCounts1[FAVORITES_FOLDER_NAME]).toEqual(1);
	expect(bookmarkFolderCounts1[SECOND_FOLDER_NAME]).toEqual(0);

	// Add object to Favorites folder
	folderList = page.locator(
		`.c-blade--active ${moduleClassSelector('c-add-to-folder-blade__list')}`
	);
	checkboxes = folderList.locator('.c-checkbox__check-icon');
	expect(await checkboxes.count()).toEqual(2);
	await checkboxes.first().click();

	// Check count changes to 1
	bookmarkFolderCounts2 = await getFolderObjectCounts(page);
	expect(bookmarkFolderCounts2[FAVORITES_FOLDER_NAME]).toEqual(2);
	expect(bookmarkFolderCounts2[SECOND_FOLDER_NAME]).toEqual(0);

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

	// Wait for close to save the videos
	await context.close();
});
