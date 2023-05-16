import { expect, test } from '@playwright/test';

import { acceptCookies } from '../helpers/accept-cookies';
import { acceptTos } from '../helpers/accept-tos';
import { fillRequestVisitBlade } from '../helpers/fill-request-visit-blade';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';
import { logout } from '../helpers/log-out';
import { checkActiveSidebarNavigationItem } from '../helpers/check-active-sidebar-navigation-item';
import { checkBladeTitle } from '../helpers/check-blade-title';
import { getFolderObjectCounts } from '../helpers/get-folder-object-counts';
import { checkToastMessage } from '../helpers/check-toast-message';

test('t17: Verifieer of gedeeltelijke toegang tot een bezoekersruimte correct kan worden toegekend', async ({
	page,
	context,
}) => {
	// Go to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

	// Check page title is the home page
	await page.waitForFunction(() => document.title === 'hetarchief.be', null, {
		timeout: 10000,
	});

	// // Accept all cookies
	// await acceptCookies(page, 'all');  // Enable this on INT, comment bcs localhost

	// Login visitor
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_PASSWORD as string
	);

	// Check tos is displayed, scroll down and click accept button
	// await acceptTos(page); //It is not displayed //Enable when on int

	// Check navbar exists
	await expect(page.locator('nav[class^=Navigation_c-navigation]')).toBeVisible();

	/**
	 * Go to 'Bezoek een aanbieder'
	 */
	// Click on "Bezoek een aanbieder" navigation item
	await page.click('text=Bezoek een aanbieder');
	// await page.click('text=Zoeken naar bezoekersruimtes');

	// Click on request access button for Amsab-ISG
	const amsabCard = await page.locator('.p-home__results .c-visitor-space-card--name--amsab-isg');
	await expect(amsabCard).toContainText('Amsab-ISG');
	await amsabCard.locator('.c-button--black').click();
	// await new Promise((resolve) => setTimeout(resolve, 10 * 1000));

	// Fill in 'Reden van aanvraag'
	await page.fill('#RequestAccessBlade__requestReason', `Een geldige reden`);

	// Enable checkbox 'Ik vraag deze toegang aan voor onderzoeksdoeleinden of privéstudie'
	await page.locator('[class^=RequestAccessBlade_c-request-access-blade] .c-checkbox').click();

	// Click on 'Verstuur'
	await page
		.locator('[class^=RequestAccessBlade_c-request-access-blade] .c-button__label', {
			hasText: 'Verstuur',
		})
		.click();

	await expect(await page.locator('text=We hebben je aanvraag goed ontvangen')).toBeVisible({
		timeout: 10000,
	});

	// Go back to the homescreen using the navigation bar
	// Click on the meemoo icon
	await page.locator('a[href="/"]').first().click();

	// Logout the end user
	await logout(page);

	// Check navbar exists
	await expect(page.locator('nav[class^=Navigation_c-navigation]')).toBeVisible();

	// Login cp admin amsab isg
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_CP_ADMIN_AMSAB_ACCOUNT_USERNAME as string,
		process.env.TEST_CP_ADMIN_AMSAB_ACCOUNT_PASSWORD as string
	);

	// Click "beheer" navigation item
	// await page.click('nav ul li .c-dropdown a');
	await page.locator('.c-avatar__text').click();
	// Click visit requests navigation item
	await page.click('a[href="/beheer/aanvragen"]');

	// Check page title matches visitor requests page title
	await page.waitForFunction(() => document.title === 'Toegangsaanvragen | hetarchief.be', null, {
		timeout: 10000,
	});

	// Check Visit Requests is active in the sidebar
	await checkActiveSidebarNavigationItem(
		page,
		0,
		'Toegangsaanvragen',
		'/beheer/toegangsaanvragen'
	);

	// Wait for results to load
	// await waitForLoading(page);
	await new Promise((resolve) => setTimeout(resolve, 2 * 1000)); // TODO temp bcs waitForLoading doesnt work

	// Check active tab: All
	await expect(await page.locator('.c-tab--active').innerHTML()).toContain('Alle');

	/**
	 * Approve request
	 */
	// Click the pending visit request
	await page
		.locator(
			'[class*="SidebarLayout_l-sidebar__main"] .c-table__wrapper--body .c-table__row .c-table__cell:first-child',
			{ hasText: 'BezoekerVoornaam' }
		)
		.first()
		.click();

	// Check the blade title
	await checkBladeTitle(page, 'Open aanvraag');

	// Check request summary contains requester name
	let summaryHtml = await page
		.locator('.c-blade--active [class*="VisitSummary_c-visit-summary"]')
		.innerHTML();
	await expect(summaryHtml).toContain('BezoekerVoornaam');
	await expect(summaryHtml).toContain('BezoekerAchternaam');
	await expect(summaryHtml).toContain('Een geldige reden');

	// Check buttons for approve and deny are visible
	let approveButton = await page.locator(
		'.c-blade--active [class*="Blade_c-blade__footer-wrapper"] .c-button',
		{ hasText: 'Goedkeuren' }
	);
	await expect(approveButton).toBeVisible();
	let denyButton = await page.locator(
		'.c-blade--active [class*="Blade_c-blade__footer-wrapper"] .c-button',
		{ hasText: 'Weigeren' }
	);
	await expect(denyButton).toBeVisible();

	// Click the approve button 'Goedkeuren'
	await approveButton.click();

	// Check blade title
	await checkBladeTitle(page, 'Aanvraag goedkeuren');

	// Click 'Toegang tot een deel van collectie'
	await page
		.locator('[class^="c-radio-button"] span', {
			hasText: 'Toegang tot een deel van collectie',
		})
		.click();

	// Open the dropdown
	await page.locator('text=Kies een map').click();

	// There should be 1 folder: 'Favorieten'
	let existingfolders = await page.locator('ul .c-checkbox-list li > span');
	await expect(existingfolders).toHaveCount(1);
	await expect(await existingfolders.allInnerTexts()).toContain('Favorieten');

	// Click next to the blade to close it, need to click it two times
	const notBlade = await page.locator('[class*=Overlay_c-overlay--visible__]').first();
	await notBlade.click();
	await notBlade.click();

	// expect the blade to not be visible
	await expect(await page.locator('[class*=Overlay_c-overlay--visible]')).toHaveCount(0);
	await new Promise((resolve) => setTimeout(resolve, 1 * 1000)); // TODO: replace this

	// Click on 'Naar mijn bezoekertool'
	await page.locator('a[href="/zoeken?aanbieder=amsab-isg"] span', { hasText: 'search' }).click(); // TODO: this is really inconsistent

	await new Promise((resolve) => setTimeout(resolve, 3 * 1000)); // TODO: replace this
	// Check user is in correct space
	await expect(
		await page
			.locator('[class^=VisitorSpaceDropdown_c-visitor-spaces-dropdown__active-label]')
			.allInnerTexts()
	).toEqual(['Amsab-ISG']);

	// Click bookmark button
	await page.locator('[title="Sla dit item op"]', { hasText: 'bookmark' }).first().click();

	// Check blade opens
	await expect(page.locator('.c-blade--active')).toBeVisible();

	// Check bookmark folder counts
	let bookmarkFolderCounts = await getFolderObjectCounts(page);
	expect(bookmarkFolderCounts['Favorieten']).toEqual(0);
	expect(bookmarkFolderCounts['Map automated test']).toBeUndefined();

	// Create new folder
	// Click 'Nieuwe map aanmaken'
	await page.locator('span[role="button"]:has-text("Nieuwe map aanmaken")').click();
	// check accept and cancel button to be visible
	await expect(await page.locator('[aria-label="Nieuwe map aanmaken annuleren"]')).toBeVisible();
	await expect(await page.locator('[aria-label="Nieuwe map opslaan"]')).toBeVisible();

	// Create folder
	await page.fill('#CreateFolderButton__name', 'Map automated test');
	await page.locator('[aria-label="Nieuwe map opslaan"]').click();

	await checkToastMessage(page, '"Map automated test" is aangemaakt.');

	// Check folder is added
	bookmarkFolderCounts = await getFolderObjectCounts(page);
	expect(bookmarkFolderCounts['Favorieten']).toEqual(0);
	expect(bookmarkFolderCounts['Map automated test']).toEqual(0);

	const folderList = await page.locator(
		'.c-blade--active [class*="AddToFolderBlade_c-add-to-folder-blade__list__"]'
	);
	const checkboxes = await folderList.locator('.c-checkbox__input');
	await checkboxes.first().click();
	await checkboxes.nth(1).click();

	// Check folder counts have gone up by 1
	bookmarkFolderCounts = await getFolderObjectCounts(page);
	expect(bookmarkFolderCounts['Favorieten']).toEqual(1);
	expect(bookmarkFolderCounts['Map automated test']).toEqual(1);

	// Click on 'Voeg toe'
	await page.locator('button', { hasText: 'Voeg toe' }).click();

	// Use the back button of the browser
	await page.goBack(); // TODO: this should only be needed one time
	await page.goBack();

	page.goto(`${process.env.TEST_CLIENT_ENDPOINT} + /beheer/toegangsaanvragen`);
	// Check page title matches visitor requests page title
	await page.waitForFunction(() => document.title === 'Toegangsaanvragen | hetarchief.be', null, {
		timeout: 10000,
	});

	// Check Visit Requests is active in the sidebar
	await checkActiveSidebarNavigationItem(
		page,
		0,
		'Toegangsaanvragen',
		'/beheer/toegangsaanvragen'
	);

	// Wait for results to load
	// await waitForLoading(page);
	await new Promise((resolve) => setTimeout(resolve, 2 * 1000)); // TODO temp bcs waitForLoading doesnt work

	// Check active tab: All
	await expect(await page.locator('.c-tab--active').innerHTML()).toContain('Alle');

	/**
	 * Approve request
	 */
	// Click the pending visit request
	await page
		.locator(
			'[class*="SidebarLayout_l-sidebar__main"] .c-table__wrapper--body .c-table__row .c-table__cell:first-child',
			{ hasText: 'BezoekerVoornaam' }
		)
		.first()
		.click();

	// Check the blade title
	await checkBladeTitle(page, 'Open aanvraag');

	// Check request summary contains requester name
	summaryHtml = await page
		.locator('.c-blade--active [class*="VisitSummary_c-visit-summary"]')
		.innerHTML();
	await expect(summaryHtml).toContain('BezoekerVoornaam');
	await expect(summaryHtml).toContain('BezoekerAchternaam');
	await expect(summaryHtml).toContain('Een geldige reden');

	// Check buttons for approve and deny are visible
	approveButton = await page.locator(
		'.c-blade--active [class*="Blade_c-blade__footer-wrapper"] .c-button',
		{ hasText: 'Goedkeuren' }
	);
	await expect(approveButton).toBeVisible();
	denyButton = await page.locator(
		'.c-blade--active [class*="Blade_c-blade__footer-wrapper"] .c-button',
		{ hasText: 'Weigeren' }
	);
	await expect(denyButton).toBeVisible();

	// Click the approve button 'Goedkeuren'
	await approveButton.click();

	// Check blade title
	await checkBladeTitle(page, 'Aanvraag goedkeuren');

	// Click 'Toegang tot een deel van collectie'
	await page
		.locator('[class^="c-radio-button"] span', {
			hasText: 'Toegang tot een deel van collectie',
		})
		.click();

	// Open the dropdown
	await page.locator('text=Kies een map').click();

	// There should be 1 folder: 'Favorieten'
	existingfolders = await page.locator('ul .c-checkbox-list li > span');
	await expect(existingfolders).toHaveCount(2);
	await expect(await existingfolders.allInnerTexts()).toContain('Favorieten');
	await expect(await existingfolders.allInnerTexts()).toContain('Map automated test');

	// Click 'Map automated test'
	await page.locator('ul .c-checkbox-list li > span', { hasText: 'Map automated test' }).click();

	// Enter time from: 00:00
	await page.click('.c-datepicker--time input[name="accessFrom"]');
	await page.click('.react-datepicker__time-list-item:has-text("00:00")');

	// Click the approve button
	await page.click('.c-blade--active [class*="Blade_c-blade__footer-wrapper"] .c-button--black');

	// Blade closes
	await expect(page.locator('.c-blade--active')).not.toBeVisible();

	// Toast message
	await checkToastMessage(page, 'De aanvraag is goedgekeurd.');

	const approvedRequest = await page
		.locator('[class*="SidebarLayout_l-sidebar__main"] .c-table__wrapper--body .c-table__row', {
			hasText: 'BezoekerVoornaam',
		})
		.first();

	await expect(
		await approvedRequest
			.locator('[class^=RequestStatusBadge_c-request-status-badge]')
			.innerText()
	).toContain('Goedgekeurd');

	await expect(await approvedRequest.locator('td').nth(4).allInnerTexts()).toContain(
		'Gedeeltelijke'
	);

	await page.locator('.c-avatar__text').click();
	// Click visit requests navigation item
	await page.click('a[href="/account/mijn-mappen"]');

	// Check 'Mijn mappen' is active in the sidebar
	await checkActiveSidebarNavigationItem(page, 0, 'Mijn mappen', '/account/mijn-mappen');

	// Check the first folder is selecten in the second sidebar
	await checkActiveSidebarNavigationItem(
		page,
		1,
		'Favorieten',
		'/account/mijn-mappen/favorieten'
	);

	// Check for an icon to be displayed next to the newly created folder
	const newFolder = await page.locator('[aria-label="Map automated test"]');
	await expect(await newFolder.innerText()).toContain('Map automated test');
	await expect(
		newFolder.locator('[class^=p-account-my-folders__link__limited-access-icon]')
	).toBeVisible();

	// Wait for close to save the videos
	await context.close();
});
