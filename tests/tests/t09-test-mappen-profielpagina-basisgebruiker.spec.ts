import { expect, test } from '@playwright/test';

import { acceptCookies } from '../helpers/accept-cookies';
import { checkActiveSidebarNavigationItem } from '../helpers/check-active-sidebar-navigation-item';
import { checkBladeTitle } from '../helpers/check-blade-title';
import { checkToastMessage } from '../helpers/check-toast-message';
import { getFolderObjectCounts } from '../helpers/get-folder-object-counts';
import { getSearchTabBarCounts } from '../helpers/get-search-tab-bar-counts';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';
import { waitForSearchResults } from '../helpers/wait-for-search-results';

test('T09: Test mappen + profielpagina basisgebruiker', async ({ page, context }) => {
	// GO to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

	// Check homepage title
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});

	// Accept all cookies
	await acceptCookies(page, 'all');

	// Check the homepage show the correct title for searching maintainers
	await expect(page.locator('text=Vind een aanbieder')).toBeVisible();

	// Login with existing user
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_PASSWORD as string
	);

	// Check homepage title
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});

	// Check toast message is shown for visitor space access
	// await checkToastMessage(page, 'Je hebt nu toegang tot VRT', 200000);

	// Check green badge is visible and has value 1
	const badge = await page.locator('nav ul li a .c-badge').first();
	await expect(badge).toBeVisible();
	await expect(badge).toContainText('1');

	/**
	 * Go to search page VRT --------------------------------------------------------------------
	 */

	// Click on "start you visit" navigation item
	await page.click('text=Start je bezoek');

	// Check flyout menu is visible
	const flyout = await page.locator('.c-dropdown__content-open');
	const flyoutHtml = await flyout.innerHTML();
	await expect(flyoutHtml).toContain('Zoeken naar aanbieders');
	await expect(flyoutHtml).toContain('VRT');

	// Click on VRT in the flyout menu
	await flyout.locator('text=VRT').click();

	// Wait for search page to be ready
	await waitForSearchResults(page);

	// Check VRT in sub navigation
	const subNavigationTitle = await page.locator(
		'.p-visitor-space [class*="Navigation_c-navigation"] h1'
	);
	await expect(subNavigationTitle).toBeVisible();
	await expect(subNavigationTitle).toContainText('VRT');

	/**
	 * Search on search page --------------------------------------------------------------------
	 */

	// Get tab counts before search
	const countsBeforeSearch = await getSearchTabBarCounts(page);

	// Enter search term
	const SEARCH_TERM = 'dublin';
	const searchField = await page.locator('.c-tags-input__input-container');
	await searchField.click();
	await searchField.type(SEARCH_TERM);
	await searchField.press('Enter');

	// Check green pill exists with search term inside
	const pill = await page.locator('.c-tags-input__multi-value .c-tag__label');
	await expect(pill).toBeVisible();
	await expect(pill).toContainText(SEARCH_TERM);

	// Check tab counts decreased
	const countsAfterSearch = await getSearchTabBarCounts(page);

	// Expect counts to have gone down, or stay the same
	if (countsBeforeSearch.all > 0) {
		// Only check counts if there are at least a few items
		expect(countsBeforeSearch.all > countsAfterSearch.all).toBeTruthy();
		expect(countsBeforeSearch.video >= countsAfterSearch.video).toBeTruthy();
		expect(countsBeforeSearch.audio >= countsAfterSearch.audio).toBeTruthy();
	}

	/**
	 * Add object to folder --------------------------------------------------------------------
	 */

	// Click first item's bookmark icon
	await page.click('.c-card__toolbar-wrapper .c-button__icon > span:has-text("bookmark")');

	// Check blade title
	await checkBladeTitle(page, 'Voeg toe aan jouw map');

	// Get folder list container
	const folderList = await page.locator(
		'.c-blade--active [class*="AddToFolderBlade_c-add-to-folder-blade__list__"]'
	);

	// Check folder favorites already exists
	await expect(await folderList.locator('text=Favorieten')).toBeVisible();

	// Click on create new folder
	await folderList.locator('.c-content-input__value', { hasText: 'Nieuwe map aanmaken' }).click();

	// Check input field  and accept and abort buttons are visible
	await expect(await folderList.locator('input[placeholder="Nieuwe map"]')).toBeVisible();
	let acceptButton = await folderList.locator('.c-button', { hasText: 'check' });
	await expect(acceptButton).toBeVisible();
	await expect(await folderList.locator('.c-button', { hasText: 'times' })).toBeVisible();

	// Enter a folder name
	await folderList.locator('input[placeholder="Nieuwe map"]').type('Map automated test');
	await acceptButton.click();

	// Check folder created toast message
	await checkToastMessage(page, '"Map automated test" is aangemaakt');

	// Check folder is added to the list in the blade
	await expect(await folderList.locator('text=Map automated test')).toBeVisible();

	// Get folder count before adding objects
	const countsBeforeAdding = await getFolderObjectCounts(page);
	expect(countsBeforeAdding['Favorieten']).toEqual(0);
	expect(countsBeforeAdding['Map automated test']).toEqual(0);

	// Check box folder checkboxes
	const checkboxes = await folderList.locator('.c-checkbox__input');
	expect(await checkboxes.count()).toEqual(2);
	await checkboxes.first().check();
	await checkboxes.last().check();

	const countsAfterAdding = await getFolderObjectCounts(page);
	expect(countsAfterAdding['Favorieten']).toEqual(1);
	expect(countsAfterAdding['Map automated test']).toEqual(1);

	// Click the add button
	await page.locator('.c-button', { hasText: 'Voeg toe' }).click();

	// Check toast message
	await checkToastMessage(page, 'Item toegevoegd aan map');

	/**
	 * Go to my folders page --------------------------------------------------------------------
	 */

	// Click user's name in navigation bar
	await page.click('nav .c-avatar');

	// Click my folders nav item
	await page.click('nav a[href="/account/mijn-mappen"]');

	// Check active nav item in sidebar
	await checkActiveSidebarNavigationItem(page, 0, 'Mijn mappen', '/account/mijn-mappen');

	// Check active state on "favorites" navigation item
	let secondaryNav = await checkActiveSidebarNavigationItem(
		page,
		1,
		'Favorieten',
		'/account/mijn-mappen/favorieten'
	);

	// Check "Map automated test folder" navigation item
	const automatedTestFolderNavItem = await secondaryNav.locator(
		'[href^="/account/mijn-mappen/map-automated-test"]'
	);
	await expect(automatedTestFolderNavItem).toBeVisible();

	// Check one object is visible
	let objectCard = await page.locator(
		'[class*="MediaCardList_c-media-card-list--two-columns__"]'
	);
	await expect.poll(() => objectCard.count()).toEqual(1);
	await expect(objectCard).toBeVisible();

	// Click on the automated test folder
	await automatedTestFolderNavItem.click();

	objectCard = await page.locator('[class*="MediaCardList_c-media-card-list--two-columns__"]');
	await expect.poll(() => objectCard.count()).toEqual(1);
	await expect(objectCard).toBeVisible();

	/**
	 * Delete object from folder --------------------------------------------------------------------
	 */

	// Click 3dots button on object card
	await objectCard.locator('text=dots-vertical').click();
	await objectCard.locator('text=Verwijderen').click();

	// Check toast message
	await checkToastMessage(page, 'Item verwijderd uit map');

	// Check object card is no longer visible
	objectCard = await page.locator('[class*="MediaCardList_c-media-card-list--two-columns__"]');
	await expect.poll(() => objectCard.count()).toEqual(0);
	await expect(objectCard).not.toBeVisible();

	/**
	 * Edit folder name --------------------------------------------------------------------
	 */

	// Click on edit folder title
	await page.click('[name="Map aanpassen"]');

	// Check folder name input field appears
	const pageContent = page.locator('[class*="SidebarLayout_l-sidebar__main"]').last();
	let folderNameEdit = await pageContent.locator('.c-content-input');
	let folderNameInput = await folderNameEdit.locator('input[name="name"]');
	await expect(folderNameInput).toBeVisible();
	acceptButton = await folderNameEdit.locator('.c-button', { hasText: 'check' });
	await expect(acceptButton).toBeVisible();
	await expect(await folderNameEdit.locator('.c-button', { hasText: 'times' })).toBeVisible();

	// Type new name in input field
	await folderNameInput.fill('Bestaande map, nieuwe naam');

	// Click the accept button
	await acceptButton.click();

	// Check toast message
	await checkToastMessage(page, 'Bestaande map, nieuwe naam" is aangepast.');

	// Check active folder navigation item
	secondaryNav = await checkActiveSidebarNavigationItem(
		page,
		1,
		'Bestaande map, nieuwe naam',
		'/account/mijn-mappen/bestaande-map%2C-nieuwe-naam'
	);

	// Check folder page title
	let folderTitle = await page.locator(
		'[class*="EditCollectionTitle_c-edit-folder-title__"] .c-content-input__value'
	);
	await expect(folderTitle).toBeVisible();
	await expect(folderTitle).toContainText('Bestaande map, nieuwe naam');

	/**
	 * Create new folder --------------------------------------------------------------------
	 */

	// Click the create new folder button
	await secondaryNav
		.locator('.c-content-input__value', { hasText: 'Nieuwe map aanmaken' })
		.click();

	// Check new folder input and confirm and cancel buttons appear
	folderNameEdit = await secondaryNav.locator('.c-content-input');
	folderNameInput = await folderNameEdit.locator('input[name="name"]');
	await expect(folderNameInput).toBeVisible();
	await expect(await folderNameEdit.locator('.c-button', { hasText: 'check' })).toBeVisible();
	await expect(await folderNameEdit.locator('.c-button', { hasText: 'times' })).toBeVisible();

	// Type in new folder name
	await folderNameInput.fill('Nieuwe map automated test');

	// Click accept button
	await folderNameEdit.locator('.c-button', { hasText: 'check' }).click();

	// Check toast
	await checkToastMessage(page, '"Nieuwe map automated test" is aangemaakt.');

	// Open new folder
	await page.locator('[href^="/account/mijn-mappen/nieuwe-map-automated-test--"]').click();

	// Check folder page title
	folderTitle = await page.locator(
		'[class*="EditCollectionTitle_c-edit-folder-title__"] .c-content-input__value'
	);
	await expect(folderTitle).toBeVisible();
	await expect(folderTitle).toContainText('Nieuwe map automated test');

	/**
	 * Delete new folder --------------------------------------------------------------------
	 */

	// Click on delete button
	await page.click('.p-account-my-folders__delete');

	// Check confirmation modal
	const modalTitle = await page.locator('.c-confirmation-modal h3');
	await expect(modalTitle).toContainText('Ben je zeker?');
	await expect(modalTitle).toBeVisible();

	// Click on remove
	await page.locator('.c-confirmation-modal .c-button', { hasText: 'Verwijderen' }).click();

	// Check active state on "favorites" navigation item
	await checkActiveSidebarNavigationItem(
		page,
		1,
		'Favorieten',
		'/account/mijn-mappen/favorieten'
	);

	/**
	 * My history page --------------------------------------------------------------------
	 */

	// Click my history in sidebar
	await page.click('.l-app__main a[href="/account/mijn-historiek"]');

	// Check active nav item
	await checkActiveSidebarNavigationItem(page, 0, 'Mijn historiek', '/account/mijn-historiek');

	// No history is visible
	await expect(page.locator('.l-container', { hasText: 'Geen historiek' })).toBeVisible();

	/**
	 * My profile page --------------------------------------------------------------------
	 */

	// Click my history in sidebar
	await page.click('.l-app__main a[href="/account/mijn-profiel"]');

	// Check active nav item
	await checkActiveSidebarNavigationItem(page, 0, 'Mijn profiel', '/account/mijn-profiel');

	// Check page title to say: my profile
	const getPageContent = () => page.locator('[class*="SidebarLayout_l-sidebar__main"]').last();
	const pageTitle = await getPageContent().locator('h2');
	await expect(pageTitle).toBeVisible();
	await expect(pageTitle).toContainText('Mijn profiel');

	// Check profile info
	const existingFirstName = await page.locator('dd', { hasText: 'BezoekerVoornaam' }).innerHTML();
	await expect(page.locator('dt', { hasText: 'Mijn voornaam' })).toBeVisible();
	await expect(page.locator('dd', { hasText: 'BezoekerVoornaam' })).toBeVisible();
	await expect(page.locator('dt', { hasText: 'Mijn familienaam' })).toBeVisible();
	await expect(page.locator('dd', { hasText: 'BezoekerAchternaam' })).toBeVisible();
	await expect(page.locator('dt', { hasText: 'Mijn e-mailadres' })).toBeVisible();
	await expect(
		await page.locator('text=hetarchief2.0+ateindgebruikerbzt@meemoo.be')
	).toBeVisible();

	// Click on change my info
	await page.click('text=Wijzig mijn gegevens');

	// Check correct ssum page loads
	await expect.poll(() => page.url()).toContain('/account/wijzig');

	// Change first name to auto
	const newFirstName = existingFirstName.includes('1')
		? 'BezoekerVoornaam-auto-2'
		: 'BezoekerVoornaam-auto-1';
	await page.fill('#person_first_name', newFirstName);

	// Enter password
	await page.type('#password_field', process.env.TEST_VISITOR_ACCOUNT_PASSWORD as string);

	// Click save button
	await page.locator('[type="submit"]').click();

	// Wait for redirect to homepage
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});

	// Login with existing user
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_PASSWORD as string
	);

	// Check first name changed
	await expect(page.locator('dd', { hasText: newFirstName })).toBeVisible();
	await expect(page.locator('dd', { hasText: existingFirstName })).not.toBeVisible();

	// Check nav bar first name
	await expect(page.locator('nav .c-avatar__text')).toContainText(newFirstName);

	// Wait for close to save the videos
	await context.close();
});
