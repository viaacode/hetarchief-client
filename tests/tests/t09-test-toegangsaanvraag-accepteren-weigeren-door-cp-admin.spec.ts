import { expect, test } from '@playwright/test';

import { checkActiveSidebarNavigationItem } from '../helpers/check-active-sidebar-navigation-item';
import { checkBladeTitle } from '../helpers/check-blade-title';
import { checkToastMessage } from '../helpers/check-toast-message';
import { checkVisitRequestStatuses } from '../helpers/check-visit-request-statuses';
import { getSiteTranslations, Locale } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';
import { moduleClassSelector } from '../helpers/module-class-locator';

declare const document: any;

test('T09: Test toegangsaanvraag accepteren + weigeren door CP admin', async ({
	page,
	context,
}) => {
	const SITE_TRANSLATIONS = await getSiteTranslations();

	// GO to the hetarchief homepage
	await goToPageAndAcceptCookies(page);

	// Login as CP admin
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_CP_ADMIN_VRT_ACCOUNT_USERNAME as string,
		process.env.TEST_CP_ADMIN_VRT_ACCOUNT_PASSWORD as string,
		undefined,
		Locale.Nl,
		SITE_TRANSLATIONS
	);

	// Check navbar exists
	await expect(page.locator(`nav${moduleClassSelector('c-navigation')}`)).toBeVisible();

	// Admin should not be visible and beheer should be visible
	await expect(page.locator('a.c-dropdown-menu__item', { hasText: 'Admin' })).toHaveCount(0);
	await expect(page.locator('a.c-dropdown-menu__item', { hasText: 'Beheer' })).toHaveCount(1);

	// Click "beheer" navigation item
	await page.locator('.c-avatar__text').click();
	// Click visit requests navigation item
	await page.click('a[href="/beheer/toegangsaanvragen"]');

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
	await new Promise((resolve) => setTimeout(resolve, 2 * 1000)); //temp bcs waitForLoading doesnt work

	// Check active tab: All
	await expect(await page.locator('.c-tab--active').innerHTML()).toContain('Alle');

	const countsBeforeApproveDeny = await checkVisitRequestStatuses(page);

	// Search for visit requests by name
	await page.fill('.p-cp-requests__header [placeholder="Zoek"]', 'Martine Tanghe');
	await page.press('.p-cp-requests__header [placeholder="Zoek"]', 'Enter');

	// There should be zero requests with this name
	await expect(page.locator('text=Er zijn geen openstaande aanvragen.')).toBeVisible();

	// Search for marie.odhiambo@example.com
	await page.fill('.p-cp-requests__header [placeholder="Zoek"]', 'marie.odhiambo@example.com');
	await page.press('.p-cp-requests__header [placeholder="Zoek"]', 'Enter');

	// The number of requests should be 3
	await expect(page.locator(moduleClassSelector('c-pagination-progress'))).toContainText(
		`1-3 van 3`
	);
	// Clear search term with x button
	await page.locator('[aria-label="Opnieuw instellen"]').first().click();

	// Number of results should be equal tot total results from before
	await expect(page.locator(moduleClassSelector('c-pagination-progress'))).toContainText(
		`1-${countsBeforeApproveDeny.totalNumberOfRequests} van ${countsBeforeApproveDeny.totalNumberOfRequests}`
	);

	/**
	 * Approve request --------------------------------------------------------
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

	// Click the approve button
	await approveButton.click();

	// Check blade title
	await checkBladeTitle(page, 'Aanvraag goedkeuren');

	// Expect 'toegang tot de volledige collectie' to be checked
	await expect(
		page.locator(`${moduleClassSelector('c-radio-button')} span`, {
			hasText: 'Toegang tot de volledige collectie',
		})
	).toBeChecked();

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

	// Check first row is approved
	await expect(
		page
			.locator(
				`${moduleClassSelector(
					'SidebarLayout_l-sidebar__main'
				)} .c-table__wrapper--body .c-table__row`
			)
			.first()
			.locator('text=Goedgekeurd')
	).toBeVisible();
	await new Promise((resolve) => setTimeout(resolve, 2 * 1000)); //temp bcs waitForLoading doesnt work
	// Check number of requests for each status
	const countsAfterOneApprove = await checkVisitRequestStatuses(page);

	// Verify that the numbers changes before and after the approved request
	expect(countsBeforeApproveDeny.totalNumberOfRequests).toEqual(
		countsAfterOneApprove.totalNumberOfRequests
	);
	expect(countsBeforeApproveDeny.numberOfPending).toEqual(
		countsAfterOneApprove.numberOfPending + 1
	);
	expect(countsBeforeApproveDeny.numberOfApproved).toEqual(
		countsAfterOneApprove.numberOfApproved - 1
	);
	expect(countsBeforeApproveDeny.numberOfDenied).toEqual(countsAfterOneApprove.numberOfDenied);

	/**
	 * Deny request --------------------------------------------------------
	 */

	// Click the pending visit request
	await page
		.locator(
			`${moduleClassSelector(
				'SidebarLayout_l-sidebar__main'
			)} .c-table__wrapper--body .c-table__row .c-table__cell:first-child`,
			{ hasText: 'Meemoo admin' }
		)
		.first()
		.click();

	// Check the blade title
	await checkBladeTitle(page, 'Open aanvraag');

	// Check request summary contains requester name
	summaryHtml = await page
		.locator(`.c-blade--active ${moduleClassSelector('c-visit-summary')}`)
		.innerHTML();
	expect(summaryHtml).toContain('Meemoo');
	expect(summaryHtml).toContain('admin');
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

	// Click the deny button
	await denyButton.click();

	// Check blade title
	await checkBladeTitle(page, 'Aanvraag weigeren');

	// Click the deny button on the second blade
	await page
		.locator(`.c-blade--active ${moduleClassSelector('c-blade__footer-wrapper')} .c-button`, {
			hasText: 'Weigeren',
		})
		.click();

	// Blade closes
	await expect(page.locator('.c-blade--active')).not.toBeVisible();

	// Toast message
	await checkToastMessage(page, 'De aanvraag is geweigerd.');
	await new Promise((resolve) => setTimeout(resolve, 2 * 1000)); // TODO: temp bcs waitForLoading doesnt work
	// Check number of requests for each status
	const countsAfterOneApproveAndOneDeny = await checkVisitRequestStatuses(page);

	// Verify that the numbers changes before and after the deny request
	expect(countsAfterOneApprove.totalNumberOfRequests).toEqual(
		countsAfterOneApproveAndOneDeny.totalNumberOfRequests
	);
	expect(countsAfterOneApprove.numberOfPending).toEqual(
		countsAfterOneApproveAndOneDeny.numberOfPending + 1
	);
	expect(countsAfterOneApprove.numberOfApproved).toEqual(
		countsAfterOneApproveAndOneDeny.numberOfApproved
	);
	expect(countsAfterOneApprove.numberOfDenied).toEqual(
		countsAfterOneApproveAndOneDeny.numberOfDenied - 1
	);

	// Check approved and denied requests are visible under their respective tabs
	// Check approved count
	await page.click('.c-tab__label:has-text("Goedgekeurd")');
	await expect(page.locator('text=BezoekerVoornaam').first()).toBeVisible();

	// Check denied count
	await page.click('.c-tab__label:has-text("Geweigerd")');
	await expect(page.locator('text=meemoo Admin').first()).toBeVisible();

	// Wait for close to save the videos
	await context.close();
});
