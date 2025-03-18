import { expect, test } from '@playwright/test';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';

import { IconName } from '../consts/icon-names';
import { fillRequestVisitVisitorSpaceBlade } from '../helpers/fill-request-visit-visitor-space-blade';
import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';

test('T04: Test inloggen bestaande basisgebruiker', async ({ page, context }) => {
	const SITE_TRANSLATIONS = await getSiteTranslations();
	const REASON = 'Een geldige reden';

	// GO to the hetarchief homepage
	await goToPageAndAcceptCookies(page, context, process.env.TEST_CLIENT_ENDPOINT as string);

	// Check navbar exists
	await expect(page.locator(`nav${moduleClassSelector('c-navigation')}`)).toBeVisible();

	// Click on 'Bezoek een aanbieder'
	await page
		.locator(`a${moduleClassSelector('c-navigation__link')}`, {
			hasText: 'Bezoek een aanbieder', // Comes from the database navigation item, so we cannot use SITE_TRANSLATIONS
		})
		.first()
		.click();

	// Check the page to contain 'Vind een aanbieder'
	await expect(
		page.locator(`text=${SITE_TRANSLATIONS.nl['pages/index___vind-een-bezoekersruimte']}`)
	).toBeVisible();

	// Scroll down and enter 'V' in the searchbar
	await page.fill('#VisitorSpaceCardsWithSearch__search', 'VR');

	// Press the contact button
	const contactButton = page.locator(
		'.p-home__results .c-visitor-space-card--name--vrt .c-button__content .c-button__icon',
		{ hasText: IconName.Contact }
	);
	await expect(contactButton).toBeVisible();
	await contactButton.click();

	// Check if email and phone number of VRT are visible
	const vrtCard = page.locator('.c-visitor-space-card--name--vrt');
	await expect(vrtCard).toBeVisible();
	const selector = `.c-menu--visible--default ${moduleClassSelector('c-visitor-space-card-controls__contact-list')} p`;
	const visitorSpaceInfos = vrtCard.locator(selector);
	await expect(visitorSpaceInfos.nth(0)).toBeVisible();
	await expect(visitorSpaceInfos.nth(1)).toBeVisible();
	const visitorSpaceInfoTexts = await visitorSpaceInfos.allInnerTexts();
	expect(visitorSpaceInfoTexts).toEqual(['vrtarchief@vrt.be', '+32 2 741 37 20']);

	// Click on 'Vraag toegang aan' van VRT
	const vrtCardButton = vrtCard.locator('.c-button__content', {
		hasText:
			SITE_TRANSLATIONS.nl[
				'modules/shared/components/visitor-space-card/visitor-space-card-controls/visitor-space-card-controls___vraag-toegang-aan'
			],
	});
	await vrtCardButton.click();

	// Expect login modal to be visible
	const loginModalTitle = page.locator(
		`${moduleClassSelector('c-hetarchief-modal')} .ReactModal__Content--after-open`,
		{
			hasText:
				SITE_TRANSLATIONS.nl[
					'modules/shared/layouts/app-layout/app-layout___inloggen-of-registreren'
				],
		}
	);
	await expect(loginModalTitle).toBeVisible();

	// Login basic visitor
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_PASSWORD as string,
		SITE_TRANSLATIONS.nl[
			'modules/visitor-space/views/visitor-spaces-home-page___bezoek-pagina-titel'
		]
	);

	// Fill in request visit blade:
	await fillRequestVisitVisitorSpaceBlade(page, REASON, null);

	// Go back to the homescreen using the navigation bar
	// Click on the meemoo icon
	await page.locator('a[href="/"]').first().click();

	// Check navbar exists
	await expect(page.locator(`nav${moduleClassSelector('c-navigation')}`).first()).toBeVisible();

	// Click on 'Bezoek een aanbieder'
	await page
		.locator(`a${moduleClassSelector('c-navigation__link')}`, {
			hasText: 'Bezoek een aanbieder', // Comes from the database navigation item, so we cannot use SITE_TRANSLATIONS
		})
		.first()
		.click();

	await new Promise((resolve) => setTimeout(resolve, 1000));

	const visitorSpaceCards = await page.locator('#aangevraagde-bezoeken b').allInnerTexts();
	expect(visitorSpaceCards).toContain('VRT');

	// Wait for close to save the videos
	await context.close();
});
