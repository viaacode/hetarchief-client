import { expect, test } from '@playwright/test';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';

import { IconName } from '../consts/icon-names';
import { checkToastMessage } from '../helpers/check-toast-message';
import { clickToastMessageButton } from '../helpers/click-toast-message-button';
import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';

test('T11.3: Test detailpagina object + materiaal aanvraag doen: materiaal aanvraag', async ({
	page,
	context,
}) => {
	const SITE_TRANSLATIONS = await getSiteTranslations();
	const PAGE_TITLE = 'Planning for a saner world';

	// GO to the hetarchief homepage
	await goToPageAndAcceptCookies(
		page,
		(process.env.TEST_CLIENT_ENDPOINT as string) +
			'/pid/' +
			(process.env.TEST_OBJECT_DETAIL_PAGE_AMSAB as string),
		PAGE_TITLE
	);

	// Login with existing user
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_2_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_2_PASSWORD as string,
		PAGE_TITLE
	);

	/**
	 * Request item
	 */

	const addToListLabel =
		SITE_TRANSLATIONS.nl[
			'modules/ie-objects/const/index___toevoegen-aan-aanvraaglijst-desktop'
		];
	await page.locator(`[aria-label="${addToListLabel}"]`).click();

	const addToRequestsLabel =
		SITE_TRANSLATIONS.nl[
			'modules/visitor-space/components/material-request-blade/material-request-blade___voeg-toe'
		];
	page.locator('text=' + addToRequestsLabel);

	// Click 'Ik wil dit materiaal hergebruiken'
	const reuseLabel =
		SITE_TRANSLATIONS.nl[
			'modules/visitor-space/components/material-request-blade/material-request-blade___reuse'
		];
	await page.locator('text=' + reuseLabel).click();

	// Click 'Voeg toe aan aanvraaglijst en zoek verder'
	const addToRequestListAndSearchLabel =
		SITE_TRANSLATIONS.nl[
			'modules/visitor-space/components/material-request-blade/material-request-blade___voeg-toe-en-zoek'
		];
	await page.locator('text=' + addToRequestListAndSearchLabel).click();

	// Toast message
	await checkToastMessage(
		page,
		SITE_TRANSLATIONS.nl[
			'modules/visitor-space/components/material-request-blade/material-request-blade___succes'
		]
	);
	await clickToastMessageButton(page);

	// Click request list icon
	await page
		.locator(`nav span${moduleClassSelector('c-material-request-center')}`, {
			hasText: IconName.Request,
		})
		.click();
	// await checkBladeTitle(page, 'Aanvraaglijst');

	// Click 'Vul gegevens aan en verstuur'
	const confirmYourInfoLabel =
		SITE_TRANSLATIONS.nl[
			'modules/navigation/components/material-request-center-blade/material-request-center-blade___vul-gegevens-aan'
		];
	await page.locator('text=' + confirmYourInfoLabel).click();

	// Check if the title of the blade is now 'Persoonlijke gegevens'
	// await expect(page.locator('.c-blade--active')).toBeVisible({ timeout: 10000 });
	// const bladeTitle = await page.locator(
	// 	`.c-blade--active ${moduleClassSelector('c-personal-info-blade__title')}`
	// );
	// await expect(bladeTitle).toContainText('Persoonlijke gegevens');
	// await expect(bladeTitle).toBeVisible();

	// Expect firstname, lastname and email address to be filled in, organisation to be empty
	const prefilledData = await page
		.locator(moduleClassSelector('c-personal-info-blade__content-value'))
		.allInnerTexts();
	expect(prefilledData).toContain('Basis Gebruiker 2');
	expect(prefilledData).toContain('hetarchief2.0+basisgebruiker2@meemoo.be');
	expect(prefilledData[2]).toEqual('');

	// Click 'ik vraag het materiaal op in het kader van mijn beroep (uitgezonderd onderwijs)'
	await page
		.locator(
			'text=' +
				SITE_TRANSLATIONS.nl[
					'modules/navigation/components/personal-info-blade/personal-info-blade___requester-capacity-work'
				]
		)
		.click();

	// Click 'Verstuur aanvraag'
	await page
		.locator(
			'text=' +
				SITE_TRANSLATIONS.nl[
					'modules/navigation/components/personal-info-blade/personal-info-blade___verstuur'
				]
		)
		.click();

	// Toast message
	await checkToastMessage(
		page,
		SITE_TRANSLATIONS.nl[
			'modules/navigation/components/personal-info-blade/personal-info-blade___verzenden-succes'
		]
	);
	await clickToastMessageButton(page);

	// Check blade is closed
	await expect(page.locator('.c-blade--active')).not.toBeVisible();

	// Wait for close to save the videos
	await context.close();
});
