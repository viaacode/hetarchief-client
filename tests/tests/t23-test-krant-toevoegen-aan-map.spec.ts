import { expect, test } from '@playwright/test';

import { IconName } from '../consts/icon-names';
import { checkToastMessage } from '../helpers/check-toast-message';
import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';
import { moduleClassSelector } from '../helpers/module-class-locator';

test('T23: Krant toevoegen aan map', async ({ page, context }) => {
	const SITE_TRANSLATIONS = await getSiteTranslations();

	/**
	 * Go to a newspaper detail page ---------------------------------------------------------------
	 */
	const NEWSPAPER_PAGE_TITLE = `Wet- en verordeningsblad voor de bezette streke...`;
	await goToPageAndAcceptCookies(
		page,
		(process.env.TEST_CLIENT_ENDPOINT as string) + '/pid/h98z893q54?showAuth=1',
		NEWSPAPER_PAGE_TITLE
	);

	// Login visitor
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_PASSWORD as string,
		NEWSPAPER_PAGE_TITLE
	);

	// Open the button overflow menu
	let buttonOverflowMenu = page.locator('.p-object-detail__primary-actions .c-button', {
		hasText: IconName.DotsHorizontal,
	});
	await expect(buttonOverflowMenu).toBeVisible();

	// Click the button overflow menu
	await buttonOverflowMenu.click();

	// Bookmark button should be visible
	let bookmarkButton = page.locator('.p-object-detail__primary-actions .c-dropdown-menu__item', {
		hasText: IconName.Bookmark,
	});
	await expect(bookmarkButton).toBeVisible();

	// Click the bookmark button
	await bookmarkButton.click();

	// Check the checkbox next to favorites
	let folderList = page.locator(
		`.c-blade--active ${moduleClassSelector('c-add-to-folder-blade__list')}`
	);
	let checkboxes = folderList.locator('.c-checkbox__check-icon');
	expect(await checkboxes.count()).toEqual(1);
	await checkboxes.first().click();

	// Save the changes
	const saveButton = page.locator(
		`.c-blade--active ${moduleClassSelector('c-blade__footer')} .c-button--black`
	);
	await expect(saveButton).toBeVisible();
	await saveButton.click();

	// Check toast message appears
	await checkToastMessage(
		page,
		SITE_TRANSLATIONS.nl[
			'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___item-toegevoegd-aan-map-titel'
		]
	);

	await page.reload();

	// Open the button overflow menu
	buttonOverflowMenu = page.locator('.p-object-detail__primary-actions .c-button', {
		hasText: IconName.DotsHorizontal,
	});
	await expect(buttonOverflowMenu).toBeVisible();

	// Click the button overflow menu
	await buttonOverflowMenu.click();

	// Bookmark button should be visible
	bookmarkButton = page.locator('.p-object-detail__primary-actions .c-dropdown-menu__item', {
		hasText: IconName.Bookmark,
	});
	await expect(bookmarkButton).toBeVisible();

	// Click the bookmark button
	await bookmarkButton.click();

	// Check the checkbox next to favorites
	folderList = page.locator(
		`.c-blade--active ${moduleClassSelector('c-add-to-folder-blade__list')}`
	);
	checkboxes = folderList.locator('[type="checkbox"]');
	expect(await checkboxes.count()).toEqual(1);
	await expect(checkboxes.first()).toBeChecked();

	// Wait for close to save the videos
	await context.close();
});
