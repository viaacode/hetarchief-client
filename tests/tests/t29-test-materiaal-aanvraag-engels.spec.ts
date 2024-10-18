import { expect, test } from '@playwright/test';
import { Locale } from '@shared/utils/i18n';

import { checkToastMessage } from '../helpers/check-toast-message';
import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';
import { moduleClassSelector } from '../helpers/module-class-locator';

test('T29: Test materiaal aanvraag flow engels', async ({ page, context }) => {
	const SITE_TRANSLATIONS = await getSiteTranslations();

	/**
	 * Go to a detail page
	 */
	const NEWSPAPER_PAGE_TITLE = 'Wet- en verordeningsblad voor de bezette streke...';
	await goToPageAndAcceptCookies(
		page,
		`${process.env.TEST_CLIENT_ENDPOINT as string}/en/pid/h98z893q54?showAuth=1`,
		NEWSPAPER_PAGE_TITLE,
		'all',
		Locale.en
	);

	// Login visitor
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_3_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_3_PASSWORD as string,
		NEWSPAPER_PAGE_TITLE,
		Locale.en
	);

	// Click on the "add to material request list" button
	const addToMaterialRequestListButton = page.locator(
		`.c-button[aria-label="${SITE_TRANSLATIONS.en['modules/ie-objects/const/index___toevoegen-aan-aanvraaglijst-desktop']}"]`
	);
	await expect(addToMaterialRequestListButton).toBeVisible();
	await addToMaterialRequestListButton.click();

	// Check the blade "Add to requests" opens
	const addToRequestsBlade = page.locator(moduleClassSelector('c-blade--visible'));
	await expect(addToRequestsBlade).toBeVisible();
	await expect(addToRequestsBlade).toContainText(
		SITE_TRANSLATIONS.en[
			'modules/visitor-space/components/material-request-blade/material-request-blade___voeg-toe'
		]
	);

	// Select the first radio button
	const firstRadioButton = addToRequestsBlade
		.locator(moduleClassSelector('c-request-material__radio-button'))
		.first();
	await firstRadioButton.click();

	// Click the "Add" button (desktop button)
	const addButton = addToRequestsBlade.locator(
		`.u-hide-lt-bp2 ${moduleClassSelector('c-request-material__voeg-toe-button')}`
	);
	await expect(addButton).toBeVisible();
	await addButton.click();

	// Check the success message is visible
	await checkToastMessage(
		page,
		SITE_TRANSLATIONS.en[
			'modules/visitor-space/components/material-request-blade/material-request-blade___succes'
		]
	);

	// Check blade has closed
	await expect(addToRequestsBlade).not.toBeVisible();

	// Check the material list has a badge with the number 1
	let materialListBadge = page.locator(
		moduleClassSelector('c-material-request-center__icon-container-badge')
	);
	await expect(materialListBadge).toBeVisible();
	await expect(materialListBadge).toHaveText('1');

	// Click the material list icon
	const materialListIcon = page.locator(
		'.c-button' + moduleClassSelector('c-material-request-center')
	);
	await materialListIcon.click();

	// Check the material list opens
	const materialListBlade = page.locator('.c-blade--active');
	await expect(materialListBlade).toBeVisible();
	await expect(materialListBlade).toContainText(
		SITE_TRANSLATIONS.en[
			'modules/navigation/components/material-request-center-blade/material-request-center-blade___aanvraaglijst'
		]
	);

	// Wait for items to load: Wait for "Applications for" label
	await expect(
		materialListBlade.locator(
			moduleClassSelector('c-material-request-center-blade__maintainer-details'),
			{
				hasText:
					SITE_TRANSLATIONS.en[
						'modules/navigation/components/material-request-center-blade/material-request-center-blade___aangevraagd'
					],
			}
		)
	).toBeVisible();

	// Click the confirm your detail button
	const confirmDetailsButton = materialListBlade.locator(
		moduleClassSelector('c-material-request-center-blade__send-button')
	);
	await expect(confirmDetailsButton).toBeVisible();
	await confirmDetailsButton.click();

	// Check blade that opens is "Personal details" blade
	const bladeTitle =
		SITE_TRANSLATIONS.en[
			'modules/navigation/components/personal-info-blade/personal-info-blade___persoonlijke-gegevens'
		];
	await expect(
		page.locator(moduleClassSelector('c-blade__title'), { hasText: bladeTitle })
	).toBeVisible();
	const personalDetailsBlade = page.locator('.c-blade--active');
	await expect(personalDetailsBlade).toBeVisible();
	await expect(personalDetailsBlade).toContainText(bladeTitle);

	// Check name is filled in:
	const nameLabel = personalDetailsBlade
		.locator(moduleClassSelector('c-personal-info-blade__content-label'))
		.first();
	await expect(nameLabel).toBeVisible();
	await expect(nameLabel).toContainText(
		SITE_TRANSLATIONS.en[
			'modules/navigation/components/personal-info-blade/personal-info-blade___fullName'
		]
	);

	const nameValue = personalDetailsBlade
		.locator(moduleClassSelector('c-personal-info-blade__content-value'))
		.first();
	await expect(nameValue).toBeVisible();
	await expect(nameValue).toContainText('Basisgebruiker Test');

	// Check email is filled in:
	const emailLabel = personalDetailsBlade
		.locator(moduleClassSelector('c-personal-info-blade__content-label'))
		.nth(1);
	await expect(emailLabel).toBeVisible();
	await expect(emailLabel).toContainText(
		SITE_TRANSLATIONS.en[
			'modules/visitor-space/components/report-blade/report-blade___email-adres'
		]
	);

	const emailValue = personalDetailsBlade
		.locator(moduleClassSelector('c-personal-info-blade__content-value'))
		.nth(1);
	await expect(emailValue).toBeVisible();
	await expect(emailValue).toContainText('hetarchief2.0+basisgebruiker@meemoo.be');

	// Check organisation is empty
	const orgInputField = page.locator(
		moduleClassSelector('c-personal-info-blade__requester-capacity') +
			' .c-input__field[type="text"]'
	);
	await expect(orgInputField).toBeVisible();
	expect(await orgInputField.inputValue()).toEqual('');

	// Check checkbox for subscribe newsletter is visible (desktop)
	const subscribeNewsletterCheckbox = page.locator(
		'.u-hide-lt-bp2 ' + moduleClassSelector('c-personal-info-blade__checkbox')
	);
	await expect(subscribeNewsletterCheckbox).toContainText(
		SITE_TRANSLATIONS.en[
			'modules/home/components/request-access-blade/request-access-blade___schrijf-je-in-voor-de-nieuwsbrief'
		]
	);
	await expect(subscribeNewsletterCheckbox).toBeVisible();

	// Check the radio button for "I ask for fragments in the context of private research"
	const privateResearchRadioButton = page.locator(
		moduleClassSelector('c-personal-info-blade__radio-button'),
		{
			hasText:
				SITE_TRANSLATIONS.en[
					'modules/navigation/components/personal-info-blade/personal-info-blade___requester-capacity-private-researcher'
				],
		}
	);
	await expect(privateResearchRadioButton).toBeVisible();
	await privateResearchRadioButton.click();

	// Click the submit button
	const submitButton = personalDetailsBlade.locator(
		'.u-hide-lt-bp2 ' + moduleClassSelector('c-personal-info-blade__send-button')
	);
	await expect(submitButton).toBeVisible();
	await submitButton.click();

	// Check the success message is visible
	await checkToastMessage(
		page,
		SITE_TRANSLATIONS.en[
			'modules/navigation/components/personal-info-blade/personal-info-blade___verzenden-succes'
		]
	);

	// Check the material list does not have a badge
	materialListBadge = page.locator(
		moduleClassSelector('c-material-request-center__icon-container-badge')
	);
	await expect(materialListBadge).not.toBeVisible();

	// Wait for close to save the videos
	await context.close();
});
