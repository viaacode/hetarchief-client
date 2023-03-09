import { expect, test } from '@playwright/test';
import { escapeRegExp } from 'lodash-es';

import { acceptCookies } from '../helpers/accept-cookies';
import { fillRequestVisitBlade } from '../helpers/fill-request-visit-blade';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';

test('T05: Test zoeken naar + toegang aanvragen tot een bezoekersruimte', async ({
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

	// Check the homepage show the correct title for searching maintainers
	await expect(page.locator('text=Vind een aanbieder')).toBeVisible();

	// Enter "v" in the search field for maintainers
	await page.fill('input[placeholder="zoek"]', 'v');

	// Press enter and wait for the network response
	const [request] = await Promise.all([
		// Waits for the next request with the specified url
		page.waitForRequest(
			new RegExp('^' + escapeRegExp(`${process.env.TEST_PROXY_ENDPOINT}/spaces`) + '.*$', 'g')
		),
		// Triggers the request
		page.press('input[placeholder="zoek"]', 'Enter'),
	]);
	await expect(request).toBeDefined();
	await page.waitForTimeout(1000);

	// Check all maintainer titles contain the letter "v"
	const maintainerTitles = await page
		.locator('.p-home__results [class*="VisitorSpaceCard_c-visitor-space-card__title"]')
		.allInnerTexts();
	await Promise.all(
		maintainerTitles.map((maintainerTitle) =>
			expect(maintainerTitle.toLowerCase()).toContain('v')
		)
	);

	// Click VRT contact button
	await page.click('.c-visitor-space-card--name--vrt .c-button--silver');

	// Check telephone and email is shown in popup
	const contactPopup = await page.locator(
		'.c-visitor-space-card--name--vrt [class*="VisitorSpaceCardControls_c-visitor-space-card-controls__contact-list"]'
	);
	await expect(await contactPopup.innerHTML()).toContain('@vrt.be');
	// await expect(await contactPopup.innerHTML()).toContain('+32'); // TODO re-enable when VRT has telephone in the INT org api v2

	// Click on request access button for VRT
	const vrtCard = await page.locator('.p-home__results .c-visitor-space-card--name--vrt');
	await expect(vrtCard).toContainText('VRT');
	await vrtCard.locator('.c-button--black').click();

	// Login
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_PASSWORD as string
	);

	// Fill in request blade and send
	await fillRequestVisitBlade(page, 'vrt', 'Een geldige reden', undefined, false);

	// Check reason stays filled in
	await expect(await page.locator('[name="requestReason"]').inputValue()).toEqual(
		'Een geldige reden'
	);

	// Check error is shown: accepting the conditions is required
	await expect(page.locator('text=De voorwaarden accepteren is verplicht.')).toBeVisible();

	// Fill in request blade and send
	await fillRequestVisitBlade(page, 'vrt', 'Een geldige reden', undefined, true);

	// Check that we were redirected to the request pending page of the VRT
	await expect(page.locator('text=We hebben je aanvraag goed ontvangen')).toBeVisible();
	await expect(await page.locator('.p-visit-requested__content').innerHTML()).toContain('VRT');

	// Go to the homepage
	await page.click('text=Start je bezoek');

	// Check request section is present
	await expect(
		await page.locator('.p-home [class*="LoggedInHome_c-hero__section-title"]')
	).toContainText('Aanvragen');

	// Check pending request is visible
	await expect(
		await page.locator(
			'[class*="LoggedInHome_c-hero__requests"] [class*="VisitorSpaceCard_c-visitor-space-card__title"]'
		)
	).toContainText('VRT');

	// Check the homepage show the correct title for searching maintainers
	await expect(page.locator('text=Vind een aanbieder')).toBeVisible();

	// Wait for close to save the videos
	await context.close();
});
