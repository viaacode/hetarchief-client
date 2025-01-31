import { expect, test } from '@playwright/test';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';

import { checkActiveSidebarNavigationItem } from '../helpers/check-active-sidebar-navigation-item';
import { checkBladeTitle } from '../helpers/check-blade-title';
import { checkToastMessage } from '../helpers/check-toast-message';
import { checkVisitRequestStatuses } from '../helpers/check-visit-request-statuses';
import { closeActiveBlade } from '../helpers/close-active-blade';
import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';
import { waitForPageTitle } from '../helpers/wait-for-page-title';

test('T09: Test toegangsaanvraag accepteren + weigeren door CP admin', async ({
	page,
	context,
}) => {
	const SITE_TRANSLATIONS = await getSiteTranslations();
	const VISIT_REQUEST_REASON = 'Een geldige reden';
	const paginationLabelBetween =
		SITE_TRANSLATIONS.nl[
			'modules/shared/components/filter-table/filter-table___label-between-start-and-end-page-in-pagination-bar'
		];
	const paginationLabelOf =
		SITE_TRANSLATIONS.nl[
			'modules/shared/components/filter-table/filter-table___label-between-end-page-and-total-in-pagination-bar'
		];

	// GO to the hetarchief homepage
	await goToPageAndAcceptCookies(page, process.env.TEST_CLIENT_ENDPOINT as string);

	// Login as CP admin
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_CP_ADMIN_VRT_ACCOUNT_USERNAME as string,
		process.env.TEST_CP_ADMIN_VRT_ACCOUNT_PASSWORD as string
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
	const visitRequestsTitle = `${SITE_TRANSLATIONS.nl['pages/beheer/toegangsaanvragen/index___toegangsaanvragen']} | ${SITE_TRANSLATIONS.nl['modules/cp/views/cp-admin-visit-requests-page___beheer']}`;
	await waitForPageTitle(page, visitRequestsTitle);

	// Check Visit Requests is active in the sidebar
	await checkActiveSidebarNavigationItem(
		page,
		0,
		SITE_TRANSLATIONS.nl['modules/navigation/components/navigation/navigation___aanvragen'],
		'/beheer/toegangsaanvragen'
	);

	// Wait for results to load
	// await waitForLoading(page);
	await new Promise((resolve) => setTimeout(resolve, 2 * 1000)); //temp bcs waitForLoading doesnt work

	// Check active tab: All
	expect(await page.locator('.c-tab--active').innerHTML()).toContain(
		SITE_TRANSLATIONS.nl['modules/cp/const/requests___alle']
	);

	const countsBeforeApproveDeny = await checkVisitRequestStatuses(page);

	// Search for visit requests by name
	const searchPlaceholder = SITE_TRANSLATIONS.nl['pages/beheer/toegangsaanvragen/index___zoek'];
	const searchInput = page.locator(`.p-cp-requests__header [placeholder="${searchPlaceholder}"]`);
	await searchInput.fill('Martine Tanghe');
	await searchInput.press('Enter');

	// There should be zero requests with this name
	await expect(
		page.locator(
			`text=${SITE_TRANSLATIONS.nl[
					'pages/beheer/toegangsaanvragen/index___er-zijn-geen-openstaande-aanvragen'
				]}`
		)
	).toBeVisible();

	// Search for marie.odhiambo@example.com
	await searchInput.fill('marie.odhiambo@example.com');
	await searchInput.press('Enter');

	// The number of requests should be 3
	await expect(page.locator('.c-pagination-progress')).toContainText(
		`1${paginationLabelBetween}3${paginationLabelOf}3`
	);
	// Clear search term with x button
	const clearSearchAriaLabel =
		SITE_TRANSLATIONS.nl['modules/shared/components/search-bar/search-bar___opnieuw-instellen'];
	await page.locator(`[aria-label="${clearSearchAriaLabel}"]`).first().click();

	// Number of results should be equal tot total results from before
	await expect(page.locator('.c-pagination-progress')).toContainText(
		`1${paginationLabelBetween}${countsBeforeApproveDeny.totalNumberOfRequests}${paginationLabelOf}${countsBeforeApproveDeny.totalNumberOfRequests}`
	);

	/**
	 * Approve request --------------------------------------------------------
	 */

	// Click the pending visit request
	const rowSelector = `${moduleClassSelector(
		'l-sidebar__main'
	)} .c-table__wrapper--body .c-table__row .c-table__cell:first-child`;
	const pendingVisitRow = page.locator(rowSelector, { hasText: 'Sleutelgebruiker Test' }).first();
	await expect(pendingVisitRow).toBeVisible();
	await pendingVisitRow.click();

	// Wait for url to contain the request id:
	await page.waitForURL(/aanvraag=/);

	// Store the request blade url
	const requestBladeUrl = page.url();

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
	expect(summaryHtml).toContain('Sleutelgebruiker Test');
	expect(summaryHtml).toContain('test with second account');
	expect(summaryHtml).toContain('next monday');

	// Check buttons for approve and deny are visible
	const bladeButtonsSelector = `.c-blade--active ${moduleClassSelector(
		'c-blade__footer'
	)} .c-button`;
	let approveButton = page.locator(bladeButtonsSelector, {
		hasText:
			SITE_TRANSLATIONS.nl[
				'modules/cp/components/approve-request-blade/approve-request-blade___keur-goed'
			],
	});
	await expect(approveButton).toBeVisible();
	let denyButton = page.locator(bladeButtonsSelector, {
		hasText:
			SITE_TRANSLATIONS.nl[
				'modules/cp/components/decline-request-blade/decline-request-blade___keur-af'
			],
	});
	await expect(denyButton).toBeVisible();

	// Click the approve button
	await approveButton.click();

	// Check blade title
	await checkBladeTitle(
		page,
		SITE_TRANSLATIONS.nl[
			'modules/cp/components/approve-request-blade/approve-request-blade___aanvraag-goedkeuren'
		]
	);

	// Expect 'toegang tot de volledige collectie' to be checked
	const radioButtonSelector = '.c-radio-button span';
	const radioButtonLabel =
		SITE_TRANSLATIONS.nl[
			'modules/cp/components/approve-request-blade/approve-request-blade___toegang-tot-de-volledige-collectie'
		];
	await expect(
		page.locator(radioButtonSelector, {
			hasText: radioButtonLabel,
		})
	).toBeChecked();

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

	// Wait 2 seconds
	await new Promise((resolve) => setTimeout(resolve, 2 * 1000));

	// Check request is approved
	await page.goto(requestBladeUrl);

	// Check blade title is approved
	await checkBladeTitle(
		page,
		SITE_TRANSLATIONS.nl[
			'modules/cp/components/process-request-blade/process-request-blade___goedgekeurde-aanvraag'
		]
	);

	// Close the blade
	await closeActiveBlade(page);

	await new Promise((resolve) => setTimeout(resolve, 2 * 1000)); //temp bcs waitForLoading doesn't work

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
	const pendingVisitRequestCel = page
		.locator(
			`${moduleClassSelector(
				'l-sidebar__main'
			)} .c-table__wrapper--body .c-table__row .c-table__cell:first-child`,
			{ hasText: 'Meemoo admin' }
		)
		.first();
	await expect(pendingVisitRequestCel).toBeVisible({ timeout: 10000 });
	await pendingVisitRequestCel.click();

	// Wait for url to contain the request id:
	await page.waitForURL(/aanvraag=/);

	// Store the request blade url
	const requestBladeUrl2 = page.url();

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
	expect(summaryHtml).toContain('Meemoo');
	expect(summaryHtml).toContain('admin');
	expect(summaryHtml).toContain(VISIT_REQUEST_REASON);

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

	// Click the deny button
	await denyButton.click();

	// Check blade title
	await checkBladeTitle(
		page,
		SITE_TRANSLATIONS.nl[
			'modules/cp/components/decline-request-blade/decline-request-blade___aanvraag-afkeuren'
		]
	);

	// Click the deny button on the second blade
	await page
		.locator(`.c-blade--active ${moduleClassSelector('c-blade__footer')} .c-button`, {
			hasText:
				SITE_TRANSLATIONS.nl[
					'modules/cp/components/decline-request-blade/decline-request-blade___keur-af'
				],
		})
		.click();

	// Blade closes
	await expect(page.locator('.c-blade--active')).not.toBeVisible();

	// Toast message
	await checkToastMessage(
		page,
		SITE_TRANSLATIONS.nl[
			'modules/cp/components/decline-request-blade/decline-request-blade___de-aanvraag-is-afgekeurd'
		]
	);
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

	// Check request is denied
	await page.goto(requestBladeUrl2);

	// Check blade title is denied
	await checkBladeTitle(
		page,
		SITE_TRANSLATIONS.nl[
			'modules/cp/components/process-request-blade/process-request-blade___geweigerde-aanvraag'
		]
	);

	// Close the blade
	await closeActiveBlade(page);

	// Check denied count
	const deniedLabel = SITE_TRANSLATIONS.nl['modules/cp/const/requests___geweigerd'];
	await page.click(`.c-tab__label:has-text("${deniedLabel}")`);
	await expect(page.locator('text=meemoo Admin').first()).toBeVisible();

	// Wait for close to save the videos
	await context.close();
});
