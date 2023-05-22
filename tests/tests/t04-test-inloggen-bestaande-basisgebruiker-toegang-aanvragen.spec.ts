import { expect, test } from '@playwright/test';

import { acceptCookies } from '../helpers/accept-cookies';
import { acceptTos } from '../helpers/accept-tos';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';

test('T04: Test inloggen bestaande basisgebruiker', async ({ page, context }) => {
	// GO to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

	// Check homepage title
	await page.waitForFunction(() => document.title === 'hetarchief.be', null, {
		timeout: 10000,
	});

	// // Accept all cookies
	await acceptCookies(page, 'all'); // enable this when running on int

	// Check navbar exists
	await expect(page.locator('nav[class^=Navigation_c-navigation]')).toBeVisible();

	// Click on 'Bezoek een aanbieder'
	await page
		.locator('a[class^=Navigation_c-navigation__link]', { hasText: 'Bezoek een aanbieder' })
		.first()
		.click();

	// Check the page to contain 'Vind een aanbieder'
	await expect(page.locator('text=Vind een aanbieder')).toBeVisible();

	// Scroll down and enter 'V' in the searchbar
	await page.fill('#VisitorSpaceCardsWithSearch__search', 'V');

	// Press the contact buton
	await page
		.locator('.c-visitor-space-card--name--vrt .c-button__content .c-button__icon')
		.first()
		.click();

	// Check if email and phone number of VRT are visible
	const visitorSpaceInfo = await page
		.locator(
			'.c-visitor-space-card--name--vrt [class^=VisitorSpaceCardControls_c-visitor-space-card-controls__contact-list] p'
		)
		.allInnerTexts();
	await expect(visitorSpaceInfo).toEqual(['vrtarchief@vrt.be', '+32 2 741 37 20']);

	// Click on 'Vraag toegang aan' van VRT
	const vrtCard = await page.locator('.c-visitor-space-card--name--vrt .c-button__content', {
		hasText: 'Vraag toegang aan',
	});
	await vrtCard.click();

	// Login
	// Click the login button
	await page.locator('.c-button.c-button--black', { hasText: 'Inloggen' }).click();

	// Fill in credentials
	await page.fill('#emailId', process.env.TEST_VISITOR_ACCOUNT_USERNAME as string);
	await page.fill('#passwordId', process.env.TEST_VISITOR_ACCOUNT_PASSWORD as string);

	// Click the login button
	await page.click('button[type="submit"]');

	// Wait for the new page to load
	await page.waitForLoadState('networkidle');

	// Accept the tos
	await acceptTos(page); // TODO: Enable when on int

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

	await expect(page.locator('text=We hebben je aanvraag goed ontvangen')).toBeVisible();

	// Go back to the homescreen using the navigation bar
	// Click on the meemoo icon
	await page.locator('a[href="/"]').first().click();

	// Check navbar exists
	await expect(page.locator('nav[class^=Navigation_c-navigation]').first()).toBeVisible();

	// Click on 'Bezoek een aanbieder'
	await page
		.locator('a[class^=Navigation_c-navigation__link]', { hasText: 'Bezoek een aanbieder' })
		.first()
		.click();

	await new Promise((resolve) => setTimeout(resolve, 1 * 1000));

	const visitorSpaceCards = await page.locator('#aangevraagde-bezoeken b').allInnerTexts();
	await expect(visitorSpaceCards).toContain('VRT');

	// Wait for close to save the videos
	await context.close();
});
