import { expect, test } from '@playwright/test';

import { acceptCookies } from '../helpers/accept-cookies';
import { checkActiveSidebarNavigationItem } from '../helpers/check-active-sidebar-navigation-item';
import { checkBladeTitle } from '../helpers/check-blade-title';
import { checkToastMessage } from '../helpers/check-toast-message';
import { checkVisitRequestStatuses } from '../helpers/check-visit-request-statuses';
import { loginUserMeemooIdp } from '../helpers/login-user-meemoo-idp';
import { waitForLoading } from '../helpers/wait-for-loading';

test('T08: Test toegangsaanvraag accepteren + weigeren door CP admin', async ({
	page,
	context,
}) => {
	// GO to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

	// Check homepage title
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});

	// Accept all cookies
	await acceptCookies(page, 'all');

	// Login as CP admin
	await loginUserMeemooIdp(
		page,
		process.env.TEST_CP_ADMIN_ACCOUNT_USERNAME as string,
		process.env.TEST_CP_ADMIN_ACCOUNT_PASSWORD as string
	);

	// Check homepage title
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});

	// Check the homepage show the correct title for searching maintainers
	await expect(page.locator('text=Vind een aanbieder')).toBeVisible();

	// Click "beheer" navigation item
	await page.click('nav ul li .c-dropdown a');

	// Click visit requests navigation item
	await page.click('a[href="/beheer/aanvragen"]');

	// Check page title matches visitor requests page title
	await page.waitForFunction(() => document.title === 'Aanvragen | bezoekertool', null, {
		timeout: 10000,
	});

	// Check Visit Requests is active in the sidebar
	await checkActiveSidebarNavigationItem(page, 0, 'Aanvragen', '/beheer/aanvragen');

	// Wait for results to load
	await waitForLoading(page);

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
	await expect(
		await page.locator('[class*="PaginationProgress_c-pagination-progress"]')
	).toContainText(`1-3 van 3`);

	// Clear search term with x button
	await page.click('text=times');

	// Number of results should be equal tot total results from before
	await expect(
		await page.locator('[class*="PaginationProgress_c-pagination-progress"]')
	).toContainText(
		`1-${countsBeforeApproveDeny.totalNumberOfRequests} van ${countsBeforeApproveDeny.totalNumberOfRequests}`
	);

	/**
	 * Approve request --------------------------------------------------------
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

	// Click the approve button
	await approveButton.click();

	// Check blade title
	await checkBladeTitle(page, 'Aanvraag goedkeuren');

	// Enter time from: 00:00
	await page.click('.c-datepicker--time input[name="accessFrom"]');
	await page.click('.react-datepicker__time-list-item:has-text("00:00")');

	// Click the approve button
	await page.click('.c-blade--active [class*="Blade_c-blade__footer-wrapper"] .c-button--black');

	// Blade closes
	await expect(page.locator('.c-blade--active')).not.toBeVisible();

	// Toast message
	await checkToastMessage(page, 'De aanvraag is goedgekeurd.');

	// Check first row is approved
	await expect(
		await page
			.locator(
				'[class*="SidebarLayout_l-sidebar__main"] .c-table__wrapper--body .c-table__row'
			)
			.first()
			.locator('text=Goedgekeurd')
	).toBeVisible();

	// Check number of requests for each status
	const countsAfterOneApprove = await checkVisitRequestStatuses(page);

	// Verify that the numbers changes before and after the approved request
	await expect(countsBeforeApproveDeny.totalNumberOfRequests).toEqual(
		countsAfterOneApprove.totalNumberOfRequests
	);
	await expect(countsBeforeApproveDeny.numberOfPending).toEqual(
		countsAfterOneApprove.numberOfPending + 1
	);
	await expect(countsBeforeApproveDeny.numberOfApproved).toEqual(
		countsAfterOneApprove.numberOfApproved - 1
	);
	await expect(countsBeforeApproveDeny.numberOfDenied).toEqual(
		countsAfterOneApprove.numberOfDenied
	);

	/**
	 * Deny request --------------------------------------------------------
	 */

	// Click the pending visit request
	await page
		.locator(
			'[class*="SidebarLayout_l-sidebar__main"] .c-table__wrapper--body .c-table__row .c-table__cell:first-child',
			{ hasText: 'meemoo Admin' }
		)
		.first()
		.click();

	// Check the blade title
	await checkBladeTitle(page, 'Open aanvraag');

	// Check request summary contains requester name
	summaryHtml = await page
		.locator('.c-blade--active [class*="VisitSummary_c-visit-summary"]')
		.innerHTML();
	await expect(summaryHtml).toContain('meemoo');
	await expect(summaryHtml).toContain('Admin');
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

	// Click the deny button
	await denyButton.click();

	// Check blade title
	await checkBladeTitle(page, 'Aanvraag weigeren');

	// Click the deny button on the second blade
	await page
		.locator('.c-blade--active [class*="Blade_c-blade__footer-wrapper"] .c-button', {
			hasText: 'Weigeren',
		})
		.click();

	// Blade closes
	await expect(page.locator('.c-blade--active')).not.toBeVisible();

	// Toast message
	await checkToastMessage(page, 'De aanvraag is geweigerd.');

	// Check number of requests for each status
	const countsAfterOneApproveAndOneDeny = await checkVisitRequestStatuses(page);

	// Verify that the numbers changes before and after the deny request
	await expect(countsAfterOneApprove.totalNumberOfRequests).toEqual(
		countsAfterOneApproveAndOneDeny.totalNumberOfRequests
	);
	await expect(countsAfterOneApprove.numberOfPending).toEqual(
		countsAfterOneApproveAndOneDeny.numberOfPending + 1
	);
	await expect(countsAfterOneApprove.numberOfApproved).toEqual(
		countsAfterOneApproveAndOneDeny.numberOfApproved
	);
	await expect(countsAfterOneApprove.numberOfDenied).toEqual(
		countsAfterOneApproveAndOneDeny.numberOfDenied - 1
	);

	// Check approved and denied requests are visible under their respective tabs
	// Check approved count
	await page.click('.c-tab__label:has-text("Goedgekeurd")');
	await expect(page.locator('text=hetarchief2.0+ateindgebruikerbzt')).toBeVisible();

	// Check denied count
	await page.click('.c-tab__label:has-text("Geweigerd")');
	await expect(
		await page.locator('text=' + process.env.TEST_MEEMOO_ADMIN_ACCOUNT_USERNAME)
	).toBeVisible();

	// Wait for close to save the videos
	await context.close();
});
