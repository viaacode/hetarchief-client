import { expect, test } from '@playwright/test';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';

import { IconName } from '../consts/icon-names';
import { checkActiveSidebarNavigationItem } from '../helpers/check-active-sidebar-navigation-item';
import { checkBladeTitle } from '../helpers/check-blade-title';
import { checkNumberOfVisitorSpacesBadge } from '../helpers/check-number-of-visitor-spaces-badge';
import { checkToastMessage } from '../helpers/check-toast-message';
import { fillRequestVisitVisitorSpaceBlade } from '../helpers/fill-request-visit-visitor-space-blade';
import { getFolderObjectCounts } from '../helpers/get-folder-object-counts';
import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { goToPublicCatalogOnSearchPage } from '../helpers/go-to-public-catalog-on-search-page';
import { logout } from '../helpers/log-out';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';
import { waitForPageTitle } from '../helpers/wait-for-page-title';
import { waitForSearchResults } from '../helpers/wait-for-search-results';

test('t17: Verifieer of gedeeltelijke toegang tot een bezoekersruimte correct kan worden toegekend', async ({
	page,
	context,
}) => {
	const SITE_TRANSLATIONS = await getSiteTranslations();
	const FOLDER_NAME = 'Map automated test';
	const FAVORITES_FOLDER_NAME =
		SITE_TRANSLATIONS.nl['modules/folders/controllers___default-collection-name'];
	const MY_FOLDERS =
		SITE_TRANSLATIONS.nl['pages/account/mijn-mappen/folder-slug/index___mijn-mappen'];
	const REASON = 'Een geldige reden';
	const VISIT_REQUESTS_PAGE_TITLE = `${SITE_TRANSLATIONS.nl['pages/admin/bezoekersruimtesbeheer/toegangsaanvragen/index___toegangsaanvragen']} | ${SITE_TRANSLATIONS.nl['modules/cp/views/cp-admin-visit-requests-page___beheer']}`;

	// Go to the hetarchief homepage
	await goToPageAndAcceptCookies(page, process.env.TEST_CLIENT_ENDPOINT as string);

	// Login visitor
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_2_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_2_PASSWORD as string
	);

	// Check navbar exists
	await checkNumberOfVisitorSpacesBadge(page, 1);

	/**
	 * Go to 'Bezoek een aanbieder'
	 */
	// Click on "Bezoek een aanbieder" navigation item
	await page.click(`${moduleClassSelector('c-navigation__link--dropdown')}[href="/bezoek"]`);

	// Click on "Zoeken naar aanbieders" navigation option
	const findAnOrganisationLabel =
		SITE_TRANSLATIONS.nl[
			'modules/navigation/components/navigation/navigation___alle-bezoekersruimtes'
		];
	await page.click(`text=${findAnOrganisationLabel}`);

	// Click on request access button for Amsab-ISG
	const amsabCard = page.locator('.p-home__results .c-visitor-space-card--name--amsab-isg');
	await expect(amsabCard).toContainText('Amsab-ISG');
	await amsabCard.locator('.c-button--black').click();

	// Fill in request visit to visitor space blade
	await fillRequestVisitVisitorSpaceBlade(page, REASON, null);

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
	await waitForPageTitle(page, VISIT_REQUESTS_PAGE_TITLE);

	// Check Visit Requests is active in the sidebar
	await checkActiveSidebarNavigationItem(
		page,
		0,
		SITE_TRANSLATIONS.nl['modules/navigation/components/navigation/navigation___aanvragen'],
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
				'l-sidebar__main'
			)} .c-table__wrapper--body .c-table__row .c-table__cell:first-child`,
			{ hasText: 'Basis Gebruiker 2' }
		)
		.first()
		.click();

	// Check the blade title
	await checkBladeTitle(
		page,
		SITE_TRANSLATIONS.nl[
			'modules/cp/components/process-request-blade/process-request-blade___open-aanvraag'
		]
	);

	// Check request summary contains requester name
	let summaryHtml = await page
		.locator(`.c-blade--active ${moduleClassSelector('c-visit-summary')}`)
		.innerHTML();
	expect(summaryHtml).toContain('Basis Gebruiker 2');
	expect(summaryHtml).toContain(REASON);

	// Check buttons for approve and deny are visible
	let approveButton = page.locator(
		`.c-blade--active ${moduleClassSelector('c-blade__footer')} .c-button`,
		{
			hasText:
				SITE_TRANSLATIONS.nl[
					'modules/cp/components/approve-request-blade/approve-request-blade___keur-goed'
				],
		}
	);
	await expect(approveButton).toBeVisible();
	let denyButton = page.locator(
		`.c-blade--active ${moduleClassSelector('c-blade__footer')} .c-button`,
		{
			hasText:
				SITE_TRANSLATIONS.nl[
					'modules/cp/components/decline-request-blade/decline-request-blade___keur-af'
				],
		}
	);
	await expect(denyButton).toBeVisible();

	// Click the approve button 'Goedkeuren'
	await approveButton.click();

	// Check blade title
	await checkBladeTitle(
		page,
		SITE_TRANSLATIONS.nl[
			'modules/cp/components/approve-request-blade/approve-request-blade___aanvraag-goedkeuren'
		]
	);

	// Click 'Toegang tot een deel van collectie'
	await page
		.locator('.c-radio-button span', {
			hasText:
				SITE_TRANSLATIONS.nl[
					'modules/cp/components/approve-request-blade/approve-request-blade___toegang-tot-een-deel-van-collectie'
				],
		})
		.click();

	// Open the dropdown
	const chooseAFolderLabel =
		SITE_TRANSLATIONS.nl[
			'modules/cp/components/approve-request-blade/approve-request-blade___kies-een-map'
		];
	await page.locator(`text=${chooseAFolderLabel}`).click();

	// There should be 1 folder: FAVORITES_FOLDER_NAME
	let existingFolders = page.locator('ul .c-checkbox-list li > span');
	await expect(existingFolders).toHaveCount(1);
	expect(await existingFolders.nth(0).innerText()).toContain(FAVORITES_FOLDER_NAME);

	// Click next to the blade to close it, need to click it two times
	const notBlade = page.locator(moduleClassSelector('c-overlay--visible')).first();
	await notBlade.click();
	await notBlade.click();

	// expect the blade to not be visible
	await expect(page.locator(moduleClassSelector('c-overlay--visible'))).toHaveCount(0);
	await new Promise((resolve) => setTimeout(resolve, 1000)); // TODO: replace this

	// Click on 'Naar mijn bezoekertool'
	await page
		.locator('a[href="/zoeken?aanbieder=amsab-isg"] span', { hasText: IconName.Search })
		.click(); // TODO: this is really inconsistent
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
	const saveThisItemLabel = SITE_TRANSLATIONS.nl['modules/ie-objects/const/index___bookmark'];
	await page
		.locator(`[title="${saveThisItemLabel}"]`, { hasText: IconName.Bookmark })
		.first()
		.click();

	// Check blade opens
	await expect(page.locator('.c-blade--active')).toBeVisible();

	// Check bookmark folder counts
	let bookmarkFolderCounts = await getFolderObjectCounts(page);
	expect(bookmarkFolderCounts[FAVORITES_FOLDER_NAME]).toEqual(0);
	expect(bookmarkFolderCounts[FOLDER_NAME]).toBeUndefined();

	// Create new folder
	// Click 'Nieuwe map aanmaken'
	const createNewFolderLabel =
		SITE_TRANSLATIONS.nl[
			'modules/account/components/create-collection-button/create-collection-button___nieuwe-map-aanmaken'
		];
	await page.locator('span[role="button"]', { hasText: createNewFolderLabel }).click();
	// check accept and cancel button to be visible
	const abortCreatingNewFolderLabel =
		SITE_TRANSLATIONS.nl[
			'modules/account/components/create-collection-button/create-collection-button___nieuwe-map-aanmaken-annuleren'
		];
	const saveNewFolderLabel =
		SITE_TRANSLATIONS.nl[
			'modules/account/components/create-collection-button/create-collection-button___nieuwe-map-opslaan'
		];
	await expect(page.locator(`[aria-label="${abortCreatingNewFolderLabel}"]`)).toBeVisible();
	await expect(page.locator(`[aria-label="${saveNewFolderLabel}"]`)).toBeVisible();

	// Create folder
	await page.fill('#CreateFolderButton__name', FOLDER_NAME);

	await page.locator(`[aria-label="${saveNewFolderLabel}"]`).click();

	const folderHasBeenCreated = SITE_TRANSLATIONS.nl[
		'modules/account/components/create-folder-button/create-folder-button___name-is-aangemaakt'
	].replace('{{name}}', FOLDER_NAME);
	await checkToastMessage(page, folderHasBeenCreated);

	// Check folder is added and checked
	bookmarkFolderCounts = await getFolderObjectCounts(page);
	expect(bookmarkFolderCounts[FAVORITES_FOLDER_NAME]).toEqual(0);
	expect(bookmarkFolderCounts[FOLDER_NAME]).toEqual(1);

	const folderList = page.locator(
		`.c-blade--active ${moduleClassSelector('c-add-to-folder-blade__list')}`
	);

	// Check favorites folder
	const checkboxes = folderList.locator('.c-checkbox__check-icon');
	await checkboxes.first().click();

	// Check folder counts have gone up by 1
	bookmarkFolderCounts = await getFolderObjectCounts(page);
	expect(bookmarkFolderCounts[FAVORITES_FOLDER_NAME]).toEqual(1);
	expect(bookmarkFolderCounts[FOLDER_NAME]).toEqual(1);

	// Click on 'Voeg toe'
	await page
		.locator('button', {
			hasText:
				SITE_TRANSLATIONS.nl[
					'modules/visitor-space/components/add-to-folder-blade/add-to-folder-blade___voeg-toe'
				],
		})
		.click();

	// Go to visit requests page and wait for page to load
	await Promise.all([
		page.goto(`${process.env.TEST_CLIENT_ENDPOINT as string}/beheer/toegangsaanvragen`),
		page.waitForLoadState('networkidle'),
	]);

	// Check page title matches visitor requests page title
	await waitForPageTitle(page, VISIT_REQUESTS_PAGE_TITLE);

	// Check Visit Requests is active in the sidebar
	await checkActiveSidebarNavigationItem(
		page,
		0,
		SITE_TRANSLATIONS.nl['modules/navigation/components/navigation/navigation___aanvragen'],
		'/beheer/toegangsaanvragen'
	);

	// Check active tab: All
	expect(await page.locator('.c-tab--active').innerHTML()).toContain(
		SITE_TRANSLATIONS.nl['modules/cp/const/requests___alle']
	);

	/**
	 * Approve request
	 */
	// Click the pending visit request
	await page
		.locator(
			`${moduleClassSelector(
				'l-sidebar__main'
			)} .c-table__wrapper--body .c-table__row .c-table__cell:first-child`,
			{ hasText: 'Basis Gebruiker 2' }
		)
		.first()
		.click();

	// Check the blade title
	await checkBladeTitle(
		page,
		SITE_TRANSLATIONS.nl[
			'modules/cp/components/process-request-blade/process-request-blade___open-aanvraag'
		]
	);

	// Check request summary contains requester name
	summaryHtml = await page
		.locator(`.c-blade--active ${moduleClassSelector('c-visit-summary')}`)
		.innerHTML();
	expect(summaryHtml).toContain('Basis Gebruiker 2');
	expect(summaryHtml).toContain(REASON);

	// Check buttons for approve and deny are visible
	approveButton = page.locator(
		`.c-blade--active ${moduleClassSelector('c-blade__footer')} .c-button`,
		{
			hasText:
				SITE_TRANSLATIONS.nl[
					'modules/cp/components/approve-request-blade/approve-request-blade___keur-goed'
				],
		}
	);
	await expect(approveButton).toBeVisible();
	denyButton = page.locator(
		`.c-blade--active ${moduleClassSelector('c-blade__footer')} .c-button`,
		{
			hasText:
				SITE_TRANSLATIONS.nl[
					'modules/cp/components/decline-request-blade/decline-request-blade___keur-af'
				],
		}
	);
	await expect(denyButton).toBeVisible();

	// Click the approve button 'Goedkeuren'
	await approveButton.click();

	// Check blade title
	await checkBladeTitle(
		page,
		SITE_TRANSLATIONS.nl[
			'modules/cp/components/approve-request-blade/approve-request-blade___aanvraag-goedkeuren'
		]
	);

	// Click 'Toegang tot een deel van collectie'
	await page
		.locator('.c-radio-button span', {
			hasText:
				SITE_TRANSLATIONS.nl[
					'modules/cp/components/approve-request-blade/approve-request-blade___toegang-tot-een-deel-van-collectie'
				],
		})
		.click();

	// Open the dropdown
	await page.locator(`text=${chooseAFolderLabel}`).click();

	// There should be 1 folder: FAVORITES_FOLDER_NAME
	existingFolders = page.locator('ul .c-checkbox-list li > span');
	await expect(existingFolders).toHaveCount(2);
	expect(await existingFolders.allInnerTexts()).toContain(FAVORITES_FOLDER_NAME);
	expect(await existingFolders.allInnerTexts()).toContain(FOLDER_NAME);

	// Click FOLDER_NAME
	await page.locator('ul .c-checkbox-list li > span', { hasText: FOLDER_NAME }).click();

	// Enter time from: 00:00
	await page.click('.c-datepicker--time input[name="accessFrom"]');
	await page.click('.react-datepicker__time-list-item:has-text("00:00")');

	// Click the approve button
	await page.click(`.c-blade--active ${moduleClassSelector('c-blade__footer')} .c-button--black`);

	// Blade closes
	await expect(page.locator('.c-blade--active')).not.toBeVisible();

	// Toast message
	await checkToastMessage(
		page,
		SITE_TRANSLATIONS.nl[
			'modules/cp/components/approve-request-blade/approve-request-blade___de-aanvraag-is-goedgekeurd'
		]
	);

	await new Promise((resolve) => setTimeout(resolve, 3 * 1000)); // TODO: temp
	const approvedRequest = page
		.locator(
			`${moduleClassSelector('l-sidebar__main')} .c-table__wrapper--body .c-table__row`,
			{
				hasText: 'Basis Gebruiker 2',
			}
		)
		.first();

	expect(
		await approvedRequest.locator(moduleClassSelector('c-request-status-badge')).innerText()
	).toContain(
		SITE_TRANSLATIONS.nl[
			'modules/cp/components/request-status-chip/request-status-chip___goedgekeurd'
		]
	);

	expect(await approvedRequest.locator('td').nth(4).allInnerTexts()).toContain(
		SITE_TRANSLATIONS.nl['modules/cp/const/requests___gedeeltelijke-toegang']
	);

	await page.locator('.c-avatar__text').click();
	// Click visit requests navigation item
	await page.click('a[href="/account/mijn-mappen"]');

	// Check page title to check page is loaded
	await waitForPageTitle(page, `${MY_FOLDERS} | ${FAVORITES_FOLDER_NAME}`);

	// Check MY_FOLDERS is active in the sidebar
	await checkActiveSidebarNavigationItem(page, 0, MY_FOLDERS, '/account/mijn-mappen');

	// Check the first folder is selected in the second sidebar
	await checkActiveSidebarNavigationItem(
		page,
		1,
		FAVORITES_FOLDER_NAME,
		`/account/mijn-mappen/${FAVORITES_FOLDER_NAME.toLowerCase()}`
	);

	// Check for an icon to be displayed next to the newly created folder
	const newFolder = page.locator(`[aria-label="${FOLDER_NAME}"]`);
	expect(await newFolder.innerText()).toContain(FOLDER_NAME);
	await expect(
		newFolder.locator('.p-account-my-folders__link__limited-access-icon')
	).toBeVisible();

	// Click on the newly created folder and check if it contains the added object
	await newFolder.click();

	const folderObject = page.locator(
		`${moduleClassSelector('c-media-card-list')} ${moduleClassSelector(
			'c-media-card-list__content'
		)}`
	);
	await expect(folderObject).toHaveCount(1);
	const organisationLabel =
		SITE_TRANSLATIONS.nl['pages/account/mijn-mappen/folder-slug/index___aanbieder'];
	expect(
		await folderObject
			.locator('.p-account-my-folders__card-description p')
			.first()
			.allInnerTexts()
	).toEqual([`${organisationLabel}: Stadsarchief Ieper`]);

	await new Promise((resolve) => setTimeout(resolve, 1000)); // TODO: replace this

	const bannerText = await page
		.locator('div.p-account-my-folders__limited-access-wrapper')
		.allInnerTexts();
	expect(bannerText[0]).toContain(
		SITE_TRANSLATIONS.nl['pages/account/mijn-mappen/folder-slug/index___map-beperkte-toegang']
	);
	await logout(page);

	// Login visitor
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_2_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_2_PASSWORD as string
	);

	// Check navbar exists and user has access to one visitor space
	await checkNumberOfVisitorSpacesBadge(page, 2);

	// Go to the Amsab-ISG visitor space
	await page.click('text=Bezoek een aanbieder'); // This text comes from the navigation entries, so we cannot use SITE_TRANSLATIONS
	const amsabSpaceLink = page
		.locator('.c-menu--visible--default')
		.first()
		.locator('a', { hasText: 'Amsab-ISG' });
	await expect(amsabSpaceLink).toBeVisible();

	await waitForSearchResults(page, () => amsabSpaceLink.click());

	const ALL_TAB = SITE_TRANSLATIONS.nl['modules/visitor-space/const/index___alles'];
	expect(
		await page
			.locator('button.c-tabs__item.c-tab.c-tab--dark.c-tab--all.c-tab--active')
			.allInnerTexts()
	).toEqual([`${ALL_TAB}(1)`]);

	// Get the pid of the first object
	const objectPid = await page
		.locator('article > section.c-card__bottom-wrapper > a .c-card__subtitle-wrapper')
		.first()
		.innerText();

	// Go to the public catalogue
	await goToPublicCatalogOnSearchPage(page);

	// Check there is maximum one thumbnail available
	expect(
		await page.locator(moduleClassSelector('c-media-card__header-wrapper')).count()
	).toBeLessThanOrEqual(1);

	// Check the purple banner
	const tempAccessLabel =
		SITE_TRANSLATIONS.nl[
			'modules/visitor-space/components/visitor-space-search-page/visitor-space-search-page___tijdelijke-toegang'
		];
	expect(await page.locator('span.p-visitor-space__temp-access-label').allInnerTexts()).toEqual([
		`${tempAccessLabel} Amsab-ISG en VRT.`,
	]);

	// Enter pid
	const searchField = page.locator('.c-tags-input__input-container').first();
	await searchField.click();
	await searchField.pressSequentially(objectPid);

	await waitForSearchResults(page, () => searchField.press('Enter'));

	await expect(
		page
			.locator(moduleClassSelector('c-pill--expanded') + ' span', {
				hasText:
					SITE_TRANSLATIONS.nl[
						'modules/shared/components/media-card/media-card___tijdelijke-toegang'
					],
			})
			.first()
	).toBeVisible();
	// Wait for close to save the videos
	await context.close();
});
