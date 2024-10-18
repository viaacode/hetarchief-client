// import { expect, request, test } from '@playwright/test';
// import addMinutes from 'date-fns/addMinutes';
// import { kebabCase, trim } from 'lodash-es';
//
// import { checkToastMessage } from '../helpers/check-toast-message';
// import { fillRequestVisitBlade } from '../helpers/fill-request-visit-blade';
// import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
// import { logout } from '../helpers/log-out';
// import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';
// import { waitForSearchResults } from '../helpers/wait-for-search-results';
export {};
//
// declare const document: any;
//
// test('T12: Test einde sessie bezoekertool', async ({ page, context }) => {
// const SITE_TRANSLATIONS = await getSiteTranslations();

// 	// We need to wait for multiple notifications that are only checked every minute
// 	test.setTimeout(300 * 1000);
//
// 	// GO to the hetarchief homepage
// 	await goToPageAndAcceptCookies(
// 		page,
// 		process.env.TEST_CLIENT_ENDPOINT as string,
// 		await getHomepageTitle()
// 	);
//
// 	// Check the homepage show the correct title for searching maintainers
// 	await expect(page.locator('text=Vind een aanbieder')).toBeVisible();
//
// 	// Login with end user
// 	await loginUserHetArchiefIdp(
// 		page,
// 		process.env.TEST_VISITOR_ACCOUNT_USERNAME as string,
// 		process.env.TEST_VISITOR_ACCOUNT_PASSWORD as string,
// 	);
//
// 	/**
// 	 * Make a visit request as end user
// 	 */
//
// 	const spaceName = 'Vlaams Parlement';
// 	const vlaamsParlementCard = await page.locator('.p-home__results .c-card', {
// 		hasText: spaceName,
// 	});
// 	await expect(vlaamsParlementCard.first()).toBeVisible();
// 	await vlaamsParlementCard.locator('.c-button--black').click();
//
// 	const visitId = await fillRequestVisitBlade(
// 		page,
// 		kebabCase(spaceName),
// 		'Een geldige reden',
// 		'tot over 1 minuut',
// 		true
// 	);
//
// 	// Wait for confirmation page to load
// 	await expect.poll(() => page.url()).toContain(`/${kebabCase(spaceName)}/toegang-aangevraagd`);
//
// 	// Logout the end user
// 	await logout(page);
//
// 	/**
// 	 * Approve visit request as meemoo admin
// 	 */
//
// 	// Login as meemoo admin
// 	await loginUserHetArchiefIdp(
// 		page,
// 		process.env.TEST_MEEMOO_ADMIN_ACCOUNT_USERNAME as string,
// 		process.env.TEST_MEEMOO_ADMIN_ACCOUNT_PASSWORD as string
// 	);
//
// 	// Approve request using api
// 	const requestContext = await request.newContext({
// 		baseURL: process.env.TEST_PROXY_ENDPOINT as string,
// 	});
// 	const cookies = await context.cookies();
// 	const startAt = addMinutes(new Date(), -200); // Start date: 200 minutes before now
// 	const endAt = addMinutes(new Date(), 1); // End date: 1 minute from now
// 	const response = await requestContext.patch(`/visits/${visitId}`, {
// 		data: {
// 			status: 'APPROVED',
// 			startAt: startAt.toISOString(),
// 			endAt: endAt.toISOString(),
// 		},
// 		headers: {
// 			Cookie: cookies.map((cookie) => cookie.name + '=' + cookie.value).join('; '),
// 		},
// 	});
// 	expect(response.ok()).toBeTruthy();
//
// 	// logout meemoo admin
// 	await logout(page);
//
// 	/**
// 	 * Check end date expired as end user
// 	 */
//
// 	// Login with end user
// 	await loginUserHetArchiefIdp(
// 		page,
// 		process.env.TEST_VISITOR_ACCOUNT_USERNAME as string,
// 		process.env.TEST_VISITOR_ACCOUNT_PASSWORD as string,
// 	);
//
// 	// Go to the search page of vlaams parlement
// 	const visitorSpaceLink = moduleClassSelector('c-visitor-space-card--granted') + ' a[href="/${kebabCase(
// 		spaceName
// 	)}"]`;
// 	await page.locator(visitorSpaceLink).first().click();
//
// 	// Wait for search page to be ready
// 	await waitForSearchResults(page);
//
// 	// Check Vlaams Parlement in sub navigation
// 	const subNavigationTitle1 = await page.locator(
// 		`.p-visitor-space ${moduleClassSelector('c-navigation')} h1`
// 	);
// 	await expect(subNavigationTitle1).toBeVisible();
// 	await expect(subNavigationTitle1).toContainText(spaceName);
//
// 	/**
// 	 * Add Vlaams parlement object to the Favorites bookmarks folder
// 	 */
//
// 	// Filter by creation date
// 	await page.click('text=Creatiedatum');
// 	await page.fill('.c-menu--visible--default .c-input__field', '1 jan. 2000');
// 	await page.locator('.c-menu--visible--default').locator('text=Pas toe').click();
//
// 	// Click bookmark button of the first search result
// 	await page.locator('.c-card .c-button', { hasText: IconName.Bookmark }).click();
//
// 	// Check blade opens
// 	await expect(page.locator('.c-blade--active')).toBeVisible();
//
// 	// Add object to Favorites folder
// 	const folderList = await page.locator(
// 		`.c-blade--active ${moduleClassSelector('c-add-to-folder-blade__list')}`
// 	);
// 	const checkboxes = await folderList.locator('.c-checkbox__input');
// 	await checkboxes.first().check();
//
// 	// Click the add button
// 	await page.locator('.c-blade--active').locator('.c-button', { hasText: 'Voeg toe' }).click();
//
// 	// Blade closes
// 	await expect(page.locator('.c-blade--active')).not.toBeVisible();
//
// 	// Toast message
// 	await checkToastMessage(page, 'Item toegevoegd aan map');
//
// 	/**
// 	 * Check end date toast message
// 	 */
//
// 	// End date should still be in the future if we want to see the toast message show up
// 	expect(endAt.getTime()).toBeGreaterThan(new Date().getTime());
//
// 	// Check notifications request to contain "end of visit" message
// 	await page.waitForResponse(
// 		async (resp) =>
// 			resp.request().method() === 'GET' &&
// 			resp.url().includes('/notifications') &&
// 			resp.status() >= 200 &&
// 			resp.status() < 400 &&
// 			(await resp.body()).includes(`Je toegang tot ${spaceName} is afgelopen`),
// 		{ timeout: 3 * 60 * 1000 }
// 	);
//
// 	// Check user is redirected to the homepage
// 	await expect
// 		.poll(() => trim(page.url(), '/'), { timeout: 10000 })
// 		.toEqual(process.env.TEST_CLIENT_ENDPOINT);
//
// 	/**
// 	 * Check detail page after end of visit
// 	 */
//
// 	// Click on "start you visit" navigation item and wait for the new page to load
// 	await page.waitForLoadState('networkidle');
// 	await Promise.all([
// 		page.goto(
// 			((process.env.TEST_CLIENT_ENDPOINT as string) +
// 				process.env.TEST_OBJECT_DETAIL_PAGE_VLAAMS_PARLEMENT) as string
// 		),
// 		page.waitForLoadState('networkidle'),
// 	]);
//
// 	// Expect the no access message
// 	await expect(page.locator('text=Geen toegang aanbieder')).toBeVisible();
//
// 	// Button to return to homepage
// 	await expect(
// 		await page.locator('.c-button', { hasText: 'Ga naar de startpagina' })
// 	).toBeVisible();
//
// 	/**
// 	 * Check bookmarked object metadata access
// 	 */
//
// 	// Go to user folders page
// 	await page.locator(`${moduleClassSelector('c-navigation__list')} .c-avatar`).click();
// 	await page.locator('.c-dropdown-menu__item', { hasText: 'Mijn mappen' }).click();
//
// 	// Check favorite folder is selected
// 	await expect(
// 		await page.locator('.c-content-input__value', { hasText: FAVORITES_FOLDER_NAME })
// 	).toBeVisible();
//
// 	// Click on last saved object
// 	const lastCard = await page
// 		.locator(`${moduleClassSelector('c-media-card-list--')} .c-card`)
// 		.last();
//
// 	// Check metadata is visible
// 	await expect(await lastCard.locator('text=Aanbieder: ' + spaceName)).toBeVisible();
// 	await expect(await lastCard.locator('text=Type')).toBeVisible();
// 	await expect(await lastCard.locator('text=Creatiedatum')).toBeVisible();
// 	await expect(await lastCard.locator('text=Uitzenddatum')).toBeVisible();
// 	await expect(await lastCard.locator('text=Identifiër bij meemoo')).toBeVisible();
// 	await expect(await lastCard.locator('text=Identifiër bij aanbieder')).toBeVisible();
//
// 	// Go to last card detail and wait for the new page to load
// 	await Promise.all([
// 		lastCard.locator('.c-card__title-wrapper a').click(),
// 		page.waitForLoadState('networkidle'),
// 	]);
//
// 	// Expect the no access message
// 	await expect(page.locator('text=Geen toegang aanbieder')).toBeVisible();
//
// 	// Button to return to homepage
// 	await expect(
// 		await page.locator('.c-button', { hasText: 'Ga naar de startpagina' })
// 	).toBeVisible();
//
// 	// Wait for close to save the videos
// 	await context.close();
// });
