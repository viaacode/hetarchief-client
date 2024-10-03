import { expect, test } from '@playwright/test';

import { checkActiveSidebarNavigationItem } from '../helpers/check-active-sidebar-navigation-item';
import { checkBladeTitle } from '../helpers/check-blade-title';
import { checkToastMessage } from '../helpers/check-toast-message';
import { getFolderObjectCounts } from '../helpers/get-folder-object-counts';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { logout } from '../helpers/log-out';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';
import { moduleClassSelector } from '../helpers/module-class-locator';
import { waitForSearchResults } from '../helpers/wait-for-search-results';

declare const document: any;

test('t17: Verifieer of gedeeltelijke toegang tot een bezoekersruimte correct kan worden toegekend', async ({
	page,
	context,
}) => {
	// Go to the hetarchief homepage
	await goToPageAndAcceptCookies(page);

	// Login visitor
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_PASSWORD as string
	);

	// Check navbar exists
	await expect(page.locator(`nav${moduleClassSelector('c-navigation')}`)).toBeVisible();

	/**
	 * Go to 'Bezoek een aanbieder'
	 */
	// Click on "Bezoek een aanbieder" navigation item
	await page.click(`${moduleClassSelector('c-navigation__link--dropdown')}[href="/bezoek"]`);

	// Click on "Zoeken naar aanbieders" navigation option
	await page.click('text=Zoeken naar aanbieders');

	// Click on request access button for Amsab-ISG
	const amsabCard = page.locator('.p-home__results .c-visitor-space-card--name--amsab-isg');
	await expect(amsabCard).toContainText('Amsab-ISG');
	await amsabCard.locator('.c-button--black').click();
	// await new Promise((resolve) => setTimeout(resolve, 10 * 1000));

	// Fill in 'Reden van aanvraag'
	await page.fill('#RequestAccessBlade__requestReason', `Een geldige reden`);

	// Enable checkbox 'Ik vraag deze toegang aan voor onderzoeksdoeleinden of privéstudie'
	await page.locator(`${moduleClassSelector('c-request-access-blade')} .c-checkbox`).click();

	// Click on 'Verstuur'
	await page
		.locator(`${moduleClassSelector('c-request-access-blade')} .c-button__label`, {
			hasText: 'Verstuur',
		})
		.click();

	await expect(page.locator('text=We hebben je aanvraag goed ontvangen')).toBeVisible({
		timeout: 10000,
	});

	// Go back to the homescreen using the navigation bar
	// Click on the meemoo icon
	await page.locator('a[href="/"]').first().click();

	// Logout the end user
	await logout(page);
	//await new Promise((resolve) => setTimeout(resolve, 1 * 1000)); // TODO: replace this

	// Check navbar exists
	await expect(page.locator(`nav${moduleClassSelector('c-navigation')}`)).toBeVisible();

	// Login cp admin amsab isg
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_CP_ADMIN_AMSAB_ACCOUNT_USERNAME as string,
		process.env.TEST_CP_ADMIN_AMSAB_ACCOUNT_PASSWORD as string
	);

	// Click "beheer" navigation item
	await new Promise((resolve) => setTimeout(resolve, 1000));
	await page.locator('.c-avatar__text').click();
	await new Promise((resolve) => setTimeout(resolve, 1000));

	// Click visit requests navigation item and wait for results to load
	await Promise.all([
		page.click('a[href="/beheer/toegangsaanvragen"]'),
		page.waitForLoadState('networkidle'),
	]);

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

	// Check active tab: All
	expect(await page.locator('.c-tab--active').innerHTML()).toContain('Alle');

	/**
	 * Approve request
	 */
	// Click the pending visit request
	await page
		.locator(
			`${moduleClassSelector(
				'SidebarLayout_l-sidebar__main'
			)} .c-table__wrapper--body .c-table__row .c-table__cell:first-child`,
			{ hasText: 'BezoekerVoornaam' }
		)
		.first()
		.click();

	// Check the blade title
	await checkBladeTitle(page, 'Open aanvraag');

	// Check request summary contains requester name
	let summaryHtml = await page
		.locator(`.c-blade--active ${moduleClassSelector('c-visit-summary')}`)
		.innerHTML();
	expect(summaryHtml).toContain('BezoekerVoornaam');
	expect(summaryHtml).toContain('BezoekerAchternaam');
	expect(summaryHtml).toContain('Een geldige reden');

	// Check buttons for approve and deny are visible
	let approveButton = page.locator(
		`.c-blade--active ${moduleClassSelector('c-blade__footer-wrapper')} .c-button`,
		{ hasText: 'Goedkeuren' }
	);
	await expect(approveButton).toBeVisible();
	let denyButton = page.locator(
		`.c-blade--active ${moduleClassSelector('c-blade__footer-wrapper')} .c-button`,
		{ hasText: 'Weigeren' }
	);
	await expect(denyButton).toBeVisible();

	// Click the approve button 'Goedkeuren'
	await approveButton.click();

	// Check blade title
	await checkBladeTitle(page, 'Aanvraag goedkeuren');

	// Click 'Toegang tot een deel van collectie'
	await page
		.locator(`${moduleClassSelector('c-radio-button')} span`, {
			hasText: 'Toegang tot een deel van collectie',
		})
		.click();

	// Open the dropdown
	await page.locator('text=Kies een map').click();

	// There should be 1 folder: 'Favorieten'
	let existingfolders = await page.locator('ul .c-checkbox-list li > span');
	await expect(existingfolders).toHaveCount(1);
	expect(await existingfolders.nth(0).innerText()).toContain('Favorieten');

	// Click next to the blade to close it, need to click it two times
	const notBlade = page.locator('[class*=Overlay_c-overlay--visible__]').first();
	await notBlade.click();
	await notBlade.click();

	// expect the blade to not be visible
	await expect(page.locator('[class*=Overlay_c-overlay--visible]')).toHaveCount(0);
	await new Promise((resolve) => setTimeout(resolve, 1000)); // TODO: replace this

	// Click on 'Naar mijn bezoekertool'
	await page.locator('a[href="/zoeken?aanbieder=amsab-isg"] span', { hasText: 'search' }).click(); // TODO: this is really inconsistent
	await page.goto(`${process.env.TEST_CLIENT_ENDPOINT as string}/zoeken?aanbieder=amsab-isg`); //TODO: remove this, it is added because it is really inconsistent

	// await new Promise((resolve) => setTimeout(resolve, 3 * 1000)); // TODO: replace this
	// Check user is in correct space
	// await expect(
	// 	await page
	// 		.locator(moduleClassSelector('c-visitor-spaces-dropdown__active-label'))
	// 		.allInnerTexts()
	// ).toEqual(['Amsab-ISG']);
	// Go to the hetarchief homepage

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

	const folderList = page.locator(
		`.c-blade--active ${moduleClassSelector('c-add-to-folder-blade__list')}`
	);
	const checkboxes = folderList.locator('.c-checkbox__check-icon');
	await checkboxes.first().click();
	await checkboxes.nth(1).click();

	// Check folder counts have gone up by 1
	bookmarkFolderCounts = await getFolderObjectCounts(page);
	expect(bookmarkFolderCounts['Favorieten']).toEqual(1);
	expect(bookmarkFolderCounts['Map automated test']).toEqual(1);

	// Click on 'Voeg toe'
	await page.locator('button', { hasText: 'Voeg toe' }).click();

	// Go to visit requests page and wait for page to load
	await Promise.all([
		page.goto(`${process.env.TEST_CLIENT_ENDPOINT as string}/beheer/toegangsaanvragen`),
		page.waitForLoadState('networkidle'),
	]);

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

	// Check active tab: All
	expect(await page.locator('.c-tab--active').innerHTML()).toContain('Alle');

	/**
	 * Approve request
	 */
	// Click the pending visit request
	await page
		.locator(
			`${moduleClassSelector(
				'SidebarLayout_l-sidebar__main'
			)} .c-table__wrapper--body .c-table__row .c-table__cell:first-child`,
			{ hasText: 'BezoekerVoornaam' }
		)
		.first()
		.click();

	// Check the blade title
	await checkBladeTitle(page, 'Open aanvraag');

	// Check request summary contains requester name
	summaryHtml = await page
		.locator(`.c-blade--active ${moduleClassSelector('c-visit-summary')}`)
		.innerHTML();
	expect(summaryHtml).toContain('BezoekerVoornaam');
	expect(summaryHtml).toContain('BezoekerAchternaam');
	expect(summaryHtml).toContain('Een geldige reden');

	// Check buttons for approve and deny are visible
	approveButton = page.locator(
		`.c-blade--active ${moduleClassSelector('c-blade__footer-wrapper')} .c-button`,
		{ hasText: 'Goedkeuren' }
	);
	await expect(approveButton).toBeVisible();
	denyButton = page.locator(
		`.c-blade--active ${moduleClassSelector('c-blade__footer-wrapper')} .c-button`,
		{ hasText: 'Weigeren' }
	);
	await expect(denyButton).toBeVisible();

	// Click the approve button 'Goedkeuren'
	await approveButton.click();

	// Check blade title
	await checkBladeTitle(page, 'Aanvraag goedkeuren');

	// Click 'Toegang tot een deel van collectie'
	await page
		.locator(`${moduleClassSelector('c-radio-button')} span`, {
			hasText: 'Toegang tot een deel van collectie',
		})
		.click();

	// Open the dropdown
	await page.locator('text=Kies een map').click();

	// There should be 1 folder: 'Favorieten'
	existingfolders = page.locator('ul .c-checkbox-list li > span');
	await expect(existingfolders).toHaveCount(2);
	expect(await existingfolders.allInnerTexts()).toContain('Favorieten');
	expect(await existingfolders.allInnerTexts()).toContain('Map automated test');

	// Click 'Map automated test'
	await page.locator('ul .c-checkbox-list li > span', { hasText: 'Map automated test' }).click();

	// Enter time from: 00:00
	await page.click('.c-datepicker--time input[name="accessFrom"]');
	await page.click('.react-datepicker__time-list-item:has-text("00:00")');

	// Click the approve button
	await page.click(
		`.c-blade--active ${moduleClassSelector('c-blade__footer-wrapper')} .c-button--black`
	);

	// Blade closes
	await expect(page.locator('.c-blade--active')).not.toBeVisible();

	// Toast message
	await checkToastMessage(page, 'De aanvraag is goedgekeurd.');

	await new Promise((resolve) => setTimeout(resolve, 3 * 1000)); // TODO: temp
	const approvedRequest = page
		.locator(
			`${moduleClassSelector(
				'SidebarLayout_l-sidebar__main'
			)} .c-table__wrapper--body .c-table__row`,
			{
				hasText: 'BezoekerVoornaam',
			}
		)
		.first();

	expect(
		await approvedRequest.locator(moduleClassSelector('c-request-status-badge')).innerText()
	).toContain('Goedgekeurd');

	expect(await approvedRequest.locator('td').nth(4).allInnerTexts()).toContain('Gedeeltelijke');

	await page.locator('.c-avatar__text').click();
	// Click visit requests navigation item
	await page.click('a[href="/account/mijn-mappen"]');

	// Check page title to check page is loaded
	await page.waitForFunction(
		() => document.title === 'Mijn mappen | Favorieten | hetarchief.be',
		null,
		{
			timeout: 10000,
		}
	);

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
		newFolder.locator(moduleClassSelector('p-account-my-folders__link__limited-access-icon'))
	).toBeVisible();

	// Click on the newly created folder and check if it contains the added object
	await newFolder.click();

	const folderObject = page.locator(
		`${moduleClassSelector(
			'MediaCardList_c-media-card-list'
		)} [class^=MediaCardList_c-media-card-list__content]`
	);
	await expect(folderObject).toHaveCount(1);
	expect(
		await folderObject
			.locator('.p-account-my-folders__card-description p')
			.first()
			.allInnerTexts()
	).toEqual(['Aanbieder: Amsab-ISG']);

	await new Promise((resolve) => setTimeout(resolve, 1 * 1000)); // TODO: replace this

	const bannerText = await page
		.locator('div.p-account-my-folders__limited-access-wrapper')
		.allInnerTexts();
	expect(bannerText[0]).toMatch(
		/Deze map wordt gebruikt om bezoekers beperkte toegang te geven t.e.m..*/
	);
	await logout(page);

	// Login visitor
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_PASSWORD as string
	);

	// Check navbar exists and user has access to one visitor space
	await expect(page.locator(`nav${moduleClassSelector('c-navigation')}`)).toBeVisible();
	await expect(
		page.locator(`a[href="/bezoek"] div${moduleClassSelector('c-badge')}`).first()
	).toContainText('2');

	// Go to the Amsab-ISG visitor space
	await page.click('text=Bezoek een aanbieder');
	await page
		.locator(`div${moduleClassSelector('c-menu c-menu--default')}`)
		.first()
		.locator('a', { hasText: 'Amsab-ISG' })
		.click();

	await waitForSearchResults(page);

	expect(
		await page
			.locator('button.c-tabs__item.c-tab.c-tab--dark.c-tab--all.c-tab--active')
			.allInnerTexts()
	).toEqual(['Alles(1)']);

	// Get the pid of the first object
	const objectPid = await page
		.locator('article > section.c-card__bottom-wrapper > a .c-card__subtitle-wrapper')
		.first()
		.innerText();

	// Go to the public catalogue
	await page.locator(`li${moduleClassSelector('c-visitor-spaces-dropdown__active')}`).click();

	await page
		.locator(
			`ul${moduleClassSelector(
				'u-list-reset VisitorSpaceDropdown_c-visitor-spaces-dropdown__list'
			)} li`,
			{ hasText: 'Publieke catalogus' }
		)
		.click();

	// Check there is maximum one thumbnail available
	expect(
		await page.locator(moduleClassSelector('c-media-card__header-wrapper')).count()
	).toBeLessThanOrEqual(1);

	// Check the purple banner
	expect(await page.locator('span.p-visitor-space__temp-access-label').allInnerTexts()).toEqual([
		'Je hebt tijdelijke toegang tot het materiaal van Amsab-ISG en VRT.',
	]);

	// Enter pid
	const searchField = page.locator('.c-tags-input__input-container').first();
	await searchField.click();
	await searchField.type(objectPid);
	await searchField.press('Enter');

	await waitForSearchResults(page);

	await expect(
		page
			.locator('[class*=Pill_c-pill--expanded] span', { hasText: 'Tijdelijke toegang' })
			.first()
	).toBeVisible();
	// Wait for close to save the videos
	await context.close();
});
