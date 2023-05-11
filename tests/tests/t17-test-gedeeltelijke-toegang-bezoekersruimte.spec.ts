import { expect, test } from '@playwright/test';

import { acceptCookies } from '../helpers/accept-cookies';
import { acceptTos } from '../helpers/accept-tos';
import { fillRequestVisitBlade } from '../helpers/fill-request-visit-blade';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';
import { logout } from '../helpers/log-out';
import { checkActiveSidebarNavigationItem } from '../helpers/check-active-sidebar-navigation-item';
import { checkBladeTitle } from '../helpers/check-blade-title';

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
	await page.click('text=Zoeken naar bezoekersruimtes');

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
	const summaryHtml = await page
		.locator('.c-blade--active [class*="VisitSummary_c-visit-summary"]')
		.innerHTML();
	await expect(summaryHtml).toContain('BezoekerVoornaam');
	await expect(summaryHtml).toContain('BezoekerAchternaam');
	await expect(summaryHtml).toContain('Een geldige reden');

	// Check buttons for approve and deny are visible
	const approveButton = await page.locator(
		'.c-blade--active [class*="Blade_c-blade__footer-wrapper"] .c-button',
		{ hasText: 'Goedkeuren' }
	);
	await expect(approveButton).toBeVisible();
	const denyButton = await page.locator(
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
	await new Promise((resolve) => setTimeout(resolve, 3 * 1000));
	// Wait for close to save the videos
	await context.close();
});
