import { expect, test } from '@playwright/test';

import { fillRequestVisitBlade } from './helpers/fill-request-visit-blade';
import { loginUserHetArchiefIdp } from './helpers/login-user-het-archief-idp';
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
		process.env.TEST_CP_ACCOUNT_USERNAME,
		process.env.TEST_CP_ACCOUNT_PASSWORD
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
	await expect(await page.title()).toEqual('Aanvragen | bezoekertool');

	// Check Visit Requests is active in the sidebar
	const requestsLink = await page.locator(
		'[class^="SidebarLayout_l-sidebar__navigation"] a[href="/beheer/aanvragen"]'
	);
	const parentNavigationItem = await requestsLink.locator(
		'ancestor=[class^="ListNavigation_c-list-navigation__item"]'
	);
	await expect(parentNavigationItem.getAttribute('class')).toContain(
		'ListNavigation_c-list-navigation__item--active'
	);

	// Check active tab: All
	await expect(await page.locator('.c-tab--active').innerHTML()).toContain('Alle');

	// Check number of approved on the "all" tab
	const numberOfApproved = await page.locator('.c-badge--success').count();

	// Check number of denied on the "all" tab
	const numberOfDenied = await page.locator('.c-badge--error').count();

	// Check the total number of visit requests on the "all" tab
	const totalNumberOfRequests = await page
		.locator('[class^="SidebarLayout_l-sidebar__main"] .c-table__row')
		.count();

	// Check approved count
	await page.click('.c-tab__label:has-text("Goedgekeurd")');
	await expect(
		await page.locator('[class^="PaginationProgress_c-pagination-progress"]')
	).toContainText(`1-${numberOfApproved} van ${numberOfApproved}`);

	// Check denied count
	await page.click('.c-tab__label:has-text("Geweigerd")');
	await expect(
		await page.locator('[class^="PaginationProgress_c-pagination-progress"]')
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

	// The number of requests should be equal to the number without a filter active
	await expect(
		await page.locator('[class^="PaginationProgress_c-pagination-progress"]')
	).toContainText(`1-${totalNumberOfRequests} van ${totalNumberOfRequests}`);

	// Clear search term with x button
	await page.click('text=times');

	// Click the pending visit request
	await page.locator('[class^="SidebarLayout_l-sidebar__main"] .c-table__row').first().click();

	// Check the blade title
	await expect(await page.locator('[class^="Blade_c-blade__title"]:visible')).toContainText(
		'Open aanvraag'
	);

	// Check request summary contains requester name
	const summaryHtml = await page
		.locator('[class^=VisitSummary_c-visit-summary]:visible')
		.innerHTML();
	await expect(summaryHtml).toContain('BezoekerVoornaam BezoekerAchternaam');
	await expect(summaryHtml).toContain('Een geldige reden');

	// Check buttons for approve and deny are visible
	const approveButton = await page.locator('[role="dialog"] .c-button--black');
	await expect(approveButton).toBeVisible();
	await expect(approveButton.innerHTML()).toContain('Goedkeuren');
	const denyButton = await page.locator('[role="dialog"] .c-button--text');
	await expect(denyButton).toBeVisible();
	await expect(denyButton.innerHTML()).toContain('Weigeren');

	// Click the approve button
	await approveButton.click();

	// Check blade title
	await expect(
		await page.locator('[class^="Blade_c-blade--visible"] [class^="Blade_c-blade__title__"]')
	).toContainText('Aanvraag goedkeuren');

	//

	// Wait for close to save the videos
	await context.close();
});
