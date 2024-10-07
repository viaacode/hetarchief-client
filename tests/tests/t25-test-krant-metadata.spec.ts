import { expect, test } from '@playwright/test';

import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';
import { moduleClassSelector } from '../helpers/module-class-locator';

test('T25: Krant metadata', async ({ page, context }) => {
	const SITE_TRANSLATIONS = await getSiteTranslations();

	const IE_OBJECT_ID = '6d5p873h9s';

	/**
	 * Go to a newspaper detail page ---------------------------------------------------------------
	 */
	const NEWSPAPER_PAGE_TITLE =
		'De volksmacht: weekblad van de christelijke arb... | hetarchief.be';
	await goToPageAndAcceptCookies(
		page,
		`${process.env.TEST_CLIENT_ENDPOINT as string}/pid/${IE_OBJECT_ID}?showAuth=1`,
		NEWSPAPER_PAGE_TITLE
	);

	// Check user with limited metadata access ---------------------------------------------------------------
	// Login visitor
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_PASSWORD as string,
		NEWSPAPER_PAGE_TITLE
	);

	// Check if metadata field "Fysieke drager" is "newspaper"
	let metadataField1 = page.locator(moduleClassSelector('c-metadata__item'), {
		hasText: SITE_TRANSLATIONS.nl['modules/ie-objects/ie-objects___fysieke-drager'],
	});
	await expect(metadataField1).toBeVisible();
	await expect(metadataField1.locator('text=newspaper')).toBeVisible();

	// Check if the metadata field "OCR Software" is hidden
	let metadataField2 = page.locator(moduleClassSelector('c-metadata__item'), {
		hasText: SITE_TRANSLATIONS.nl['modules/ie-objects/ie-objects___ocr-software'],
	});
	await expect(metadataField2).not.toBeVisible();

	// Logout
	await page.goto(`${process.env.TEST_CLIENT_ENDPOINT as string}/uitloggen`);
	await expect(
		page.locator(moduleClassSelector('c-navigation__auth'), {
			hasText:
				SITE_TRANSLATIONS.nl[
					'modules/shared/layouts/app-layout/app-layout___inloggen-of-registreren'
				],
		})
	).toBeVisible();

	// Check user with all metadata access ---------------------------------------------------------------
	// Go to a newspaper detail page
	await goToPageAndAcceptCookies(
		page,
		`${process.env.TEST_CLIENT_ENDPOINT as string}/pid/${IE_OBJECT_ID}?showAuth=1`,
		NEWSPAPER_PAGE_TITLE
	);

	// Login visitor with key user
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_KEY_VISITOR_ACCOUNT_USERNAME as string,
		process.env.TEST_KEY_VISITOR_ACCOUNT_PASSWORD as string,
		NEWSPAPER_PAGE_TITLE
	);

	// Check if metadata field "Fysieke drager" is "newspaper"
	metadataField1 = page.locator(moduleClassSelector('c-metadata__item'), {
		hasText: SITE_TRANSLATIONS.nl['modules/ie-objects/ie-objects___fysieke-drager'],
	});
	await expect(metadataField1).toBeVisible();
	await expect(metadataField1.locator('text=newspaper')).toBeVisible();

	// Check if the metadata field "OCR Software" is "ABBYY FineReader Engine"
	metadataField2 = page.locator(moduleClassSelector('c-metadata__item'), {
		hasText: SITE_TRANSLATIONS.nl['modules/ie-objects/ie-objects___ocr-software-version'],
	});
	console.log(await metadataField2.innerHTML());
	await expect(metadataField2).toBeVisible();
	await expect(metadataField2.locator('text=12')).toBeVisible();

	// Wait for close to save the videos
	await context.close();
});
