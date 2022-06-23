import { expect, test } from '@playwright/test';

import { checkVisitRequestStatuses } from './helpers/check-visit-request-statuses';
import { loginUserMeemooIdp } from './helpers/login-user-meemoo-idp';

test('T08: Test toegangsaanvraag accepteren + weigeren door CP admin', async ({
	page,
	context,
}) => {
	// GO to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

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
	await expect(await page.locator('text=Vind een aanbieder')).toBeVisible();

	// Click "beheer" navigation item
	await page.click('.c-dropdown [role="menuitem"]');

	// Click visit requests navigation item
	await page.click('a[href="/beheer/aanvragen"]');

	// Check page title matches visitor requests page title
	await page.waitForFunction(() => document.title === 'Aanvragen | bezoekertool', null, {
		timeout: 10000,
	});

	// Check Visit Requests is active in the sidebar
	const activeNavigationItem = await page.locator(
		'[class*="ListNavigation_c-list-navigation__item--active"]'
	);
	await expect(await activeNavigationItem.count()).toBe(1);
	const activeNavigationItemHtml = await activeNavigationItem.innerHTML();
	await expect(activeNavigationItemHtml).toContain('Aanvragen');
	await expect(activeNavigationItemHtml).toContain('href="/beheer/aanvragen"');

	// Wait for results to load
	await page.waitForFunction(() => document.querySelectorAll('.c-loading').length === 0, null, {
		timeout: 10000,
	});

	// Check active tab: All
	await expect(await page.locator('.c-tab--active').innerHTML()).toContain('Alle');

	const counts = await checkVisitRequestStatuses(page);

	// Search for visit requests by name
	await page.fill('.p-cp-requests__header [placeholder="Zoek"]', 'Martine Tanghe');
	await page.press('.p-cp-requests__header [placeholder="Zoek"]', 'Enter');

	// There should be zero requests with this name
	await expect(await page.locator('text=Er zijn geen openstaande aanvragen.')).toBeVisible();

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
	).toContainText(`1-${counts.totalNumberOfRequests} van ${counts.totalNumberOfRequests}`);

	// Click the pending visit request
	await page
		.locator(
			'[class*="SidebarLayout_l-sidebar__main"] .c-table__wrapper--body .c-table__row .c-table__cell:first-child'
		)
		.first()
		.click();

	// Check the blade title
	const bladeTitle = await page.locator('.c-blade--active h3[class*="Blade_c-blade__title"]');
	await expect(bladeTitle).toContainText('Open aanvraag');
	await expect(bladeTitle).toBeVisible();

	// Check request summary contains requester name
	const summaryHtml = await page
		.locator('.c-blade--active [class*="VisitSummary_c-visit-summary"]')
		.innerHTML();
	await expect(summaryHtml).toContain('BezoekerVoornaam BezoekerAchternaam');
	await expect(summaryHtml).toContain('Een geldige reden');

	// Check buttons for approve and deny are visible
	const approveButton = await page.locator(
		'.c-blade--active [class*="Blade_c-blade__footer-wrapper"] .c-button--black'
	);
	await expect(approveButton).toBeVisible();
	await expect(await approveButton.innerHTML()).toContain('Goedkeuren');
	const denyButton = await page.locator(
		'.c-blade--active [class*="Blade_c-blade__footer-wrapper"] .c-button--text'
	);
	await expect(denyButton).toBeVisible();
	await expect(await denyButton.innerHTML()).toContain('Weigeren');

	// Click the approve button
	await approveButton.click();

	// Check blade title
	await expect(
		await page.locator('.c-blade--active [class*="Blade_c-blade__title__"]')
	).toContainText('Aanvraag goedkeuren');

	// Enter time from: 00:00
	await page.click('input[name="accessFrom"]');
	await page.click('.react-datepicker__time-list-item:has-text("00:00")');

	// Click the approve button
	await page.click('.c-blade--active [class*="Blade_c-blade__footer-wrapper"] .c-button--black');

	// Blade closes
	await expect(await page.locator('.c-blade--active')).not.toBeVisible();

	// Toast message
	await expect(await page.locator('text=De aanvraag is goedgekeurd.')).toBeVisible();

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
	await checkVisitRequestStatuses(page);

	// Wait for close to save the videos
	await context.close();
});
