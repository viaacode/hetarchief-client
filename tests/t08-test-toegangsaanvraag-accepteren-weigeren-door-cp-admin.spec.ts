import { expect, test } from '@playwright/test';

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

	// Check number of approved on the "all" tab
	const numberOfPending = await page
		.locator('[class*="RequestStatusBadge_c-request-status-badge"]:has-text("Open aanvraag")')
		.count();

	// Check number of approved on the "all" tab
	const numberOfApproved = await page.locator('.c-badge--success').count();

	// Check number of denied on the "all" tab
	const numberOfDenied = await page.locator('.c-badge--error').count();

	// Check the total number of visit requests on the "all" tab
	const totalNumberOfRequests = await page
		.locator('[class*="SidebarLayout_l-sidebar__main"] .c-table__wrapper--body .c-table__row')
		.count();

	// Check pending count
	await page.click('.c-tab__label:has-text("Open")');
	await expect(
		await page.locator('[class*="PaginationProgress_c-pagination-progress"]')
	).toContainText(`1-${numberOfPending} van ${numberOfPending}`);

	// Check approved count
	await page.click('.c-tab__label:has-text("Goedgekeurd")');
	await expect(
		await page.locator('[class*="PaginationProgress_c-pagination-progress"]')
	).toContainText(`1-${numberOfApproved} van ${numberOfApproved}`);

	// Check denied count
	await page.click('.c-tab__label:has-text("Geweigerd")');
	await expect(
		await page.locator('[class*="PaginationProgress_c-pagination-progress"]')
	).toContainText(`1-${numberOfDenied} van ${numberOfDenied}`);

	// Go back to the "All" tab
	await page.click('.c-tab__label:has-text("Alle")');

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
	).toContainText(`1-${totalNumberOfRequests} van ${totalNumberOfRequests}`);

	// Click the pending visit request
	await page
		.locator(
			'[class*="SidebarLayout_l-sidebar__main"] .c-table__wrapper--body .c-table__row .c-table__cell:first-child'
		)
		.first()
		.click();

	// Check the blade title
	const bladeTitle = await page.locator(
		'[class*="Blade_c-blade--visible"] h3[class*="Blade_c-blade__title"]'
	);
	await expect(bladeTitle).toContainText('Open aanvraag');
	await expect(bladeTitle).toBeVisible();

	// Check request summary contains requester name
	const summaryHtml = await page
		.locator('[class*="Blade_c-blade--visible"] [class*="VisitSummary_c-visit-summary"]')
		.innerHTML();
	await expect(summaryHtml).toContain('BezoekerVoornaam BezoekerAchternaam');
	await expect(summaryHtml).toContain('Een geldige reden');

	// Check buttons for approve and deny are visible
	const approveButton = await page.locator(
		'[class*="Blade_c-blade--visible"] [class*="Blade_c-blade__footer-wrapper"] .c-button--black'
	);
	await expect(approveButton).toBeVisible();
	await expect(await approveButton.innerHTML()).toContain('Goedkeuren');
	const denyButton = await page.locator(
		'[class*="Blade_c-blade--visible"] [class*="Blade_c-blade__footer-wrapper"] .c-button--text'
	);
	await expect(denyButton).toBeVisible();
	await expect(await denyButton.innerHTML()).toContain('Weigeren');

	// Click the approve button
	await approveButton.click();

	// Check blade title
	await expect(
		await page.locator('[class*="Blade_c-blade--visible"] [class*="Blade_c-blade__title__"]')
	).toContainText('Aanvraag goedkeuren');

	//

	// Wait for close to save the videos
	await context.close();
});
