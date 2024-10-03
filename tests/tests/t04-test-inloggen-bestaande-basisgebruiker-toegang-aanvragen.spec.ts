import { expect, test } from '@playwright/test';

import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';
import { moduleClassSelector } from '../helpers/module-class-locator';

test('T04: Test inloggen bestaande basisgebruiker', async ({ page, context }) => {
	// GO to the hetarchief homepage
	await goToPageAndAcceptCookies(page);

	// Check navbar exists
	await expect(page.locator(`nav${moduleClassSelector('c-navigation')}`)).toBeVisible();

	// Click on 'Bezoek een aanbieder'
	await page
		.locator(`a${moduleClassSelector('c-navigation__link')}`, {
			hasText: 'Bezoek een aanbieder',
		})
		.first()
		.click();

	// Check the page to contain 'Vind een aanbieder'
	await expect(page.locator('text=Vind een aanbieder')).toBeVisible();

	// Scroll down and enter 'V' in the searchbar
	await page.fill('#VisitorSpaceCardsWithSearch__search', 'V');

	// Press the contact button
	await page
		.locator('.c-visitor-space-card--name--vrt .c-button__content .c-button__icon')
		.first()
		.click();

	// Check if email and phone number of VRT are visible
	const visitorSpaceInfo = await page
		.locator(
			`.c-visitor-space-card--name--vrt ${moduleClassSelector(
				'VisitorSpaceCardControls_c-visitor-space-card-controls__contact-list'
			)} p`
		)
		.allInnerTexts();
	expect(visitorSpaceInfo).toEqual(['vrtarchief@vrt.be', '+32 2 741 37 20']);

	// Click on 'Vraag toegang aan' van VRT
	const vrtCard = page.locator('.c-visitor-space-card--name--vrt .c-button__content', {
		hasText: 'Vraag toegang aan',
	});
	await vrtCard.click();

	// Login basic visitor
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_PASSWORD as string
	);

	// Fill in 'Reden van aanvraag'
	await page.fill('#RequestAccessBlade__requestReason', `Een geldige reden`);

	// Enable checkbox 'Ik vraag deze toegang aan voor onderzoeksdoeleinden of privéstudie'
	await page.locator(`${moduleClassSelector('c-request-access-blade')} .c-checkbox`).click();

	// Click on 'Verstuur'
	await page
		.locator(`${moduleClassSelector('c-request-access-blade')} .c-button__label`, {
			hasText: 'Verstuur',
		})
		.click();

	await expect(page.locator('text=We hebben je aanvraag goed ontvangen')).toBeVisible();

	// Go back to the homescreen using the navigation bar
	// Click on the meemoo icon
	await page.locator('a[href="/"]').first().click();

	// Check navbar exists
	await expect(page.locator(`nav${moduleClassSelector('c-navigation')}`).first()).toBeVisible();

	// Click on 'Bezoek een aanbieder'
	await page
		.locator(`a${moduleClassSelector('c-navigation__link')}`, {
			hasText: 'Bezoek een aanbieder',
		})
		.first()
		.click();

	await new Promise((resolve) => setTimeout(resolve, 1 * 1000));

	const visitorSpaceCards = await page.locator('#aangevraagde-bezoeken b').allInnerTexts();
	expect(visitorSpaceCards).toContain('VRT');

	// Wait for close to save the videos
	await context.close();
});
