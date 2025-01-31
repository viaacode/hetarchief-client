import { expect, test } from '@playwright/test';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';

import { IconName } from '../consts/icon-names';
import { getSiteTranslations } from '../helpers/get-site-translations';
import { goToPageAndAcceptCookies } from '../helpers/go-to-page-and-accept-cookies';
import { loginUserHetArchiefIdp } from '../helpers/login-user-het-archief-idp';

test('T24: Download krant in verschillende formaten', async ({ page, context }) => {
	const SITE_TRANSLATIONS = await getSiteTranslations();

	const IE_OBJECT_ID = 'h98z893q54';

	/**
	 * Go to a newspaper detail page ---------------------------------------------------------------
	 */
	const NEWSPAPER_PAGE_TITLE = 'Wet- en verordeningsblad voor de bezette streke...';
	await goToPageAndAcceptCookies(
		page,
		`${process.env.TEST_CLIENT_ENDPOINT as string}/pid/${IE_OBJECT_ID}?showAuth=1`,
		NEWSPAPER_PAGE_TITLE
	);

	// Login visitor
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_PASSWORD as string,
		NEWSPAPER_PAGE_TITLE
	);

	// Open the button overflow menu
	const exportNewspaperButton = page.locator('.p-object-detail__primary-actions .c-button', {
		hasText: IconName.Export,
	});
	await expect(exportNewspaperButton).toBeVisible();

	// Click the export newspaper dropdown button
	await exportNewspaperButton.click();

	// Check that the 4 options exist
	let exportOptions = page.locator('.c-dropdown__content-open .c-dropdown-menu__item');
	await expect(exportOptions.nth(0)).toHaveText(
		SITE_TRANSLATIONS.nl['modules/ie-objects/ie-objects___download-alle-paginas-zip']
	);
	await expect(exportOptions.nth(1)).toHaveText(
		SITE_TRANSLATIONS.nl['modules/ie-objects/ie-objects___download-deze-pagina-zip']
	);
	await expect(exportOptions.nth(2)).toHaveText(
		SITE_TRANSLATIONS.nl[
			'pages/bezoekersruimte/visitor-space-slug/object-id/index___exporteer-metadata-als-XML'
		]
	);
	await expect(exportOptions.nth(3)).toHaveText(
		SITE_TRANSLATIONS.nl[
			'pages/bezoekersruimte/visitor-space-slug/object-id/index___exporteer-metadata-als-CSV'
		]
	);

	// Test export download all pages as zip ---------------------------------------------------------------
	// Click download all pages zip button
	await exportOptions.nth(0).click();

	// Check that a modal opened with button: Continue download
	const continueDownloadLabel =
		SITE_TRANSLATIONS.nl[
			'modules/ie-objects/components/copyright-confirmation-modal/copyright-confirmation-modal___ga-door-met-downloaden'
		];
	const continueDownloadButtonSelector = `.ReactModal__Content--after-open ${moduleClassSelector(
		'c-copyright-modal__content__button-wrapper'
	)} .c-button--black`;
	const continueDownloadButton = page.locator(continueDownloadButtonSelector);
	await expect(continueDownloadButton).toBeVisible();
	await expect(continueDownloadButton).toHaveText(continueDownloadLabel);
	const html = await continueDownloadButton.innerHTML();

	// register a download event listener
	let downloadPromise = page.waitForEvent('download');

	// Click continue download button
	await continueDownloadButton.click();

	// Wait for the download to complete
	let download = await downloadPromise;

	// Check if the browser downloaded a zip file with name: newspaper-h98z893q54.zip
	expect(download.suggestedFilename()).toBe(`newspaper-${IE_OBJECT_ID}.zip`);

	// Check XML download --------------------------------------------------------------------------------------------
	// Click the export newspaper dropdown button
	await exportNewspaperButton.click();

	// Get the 4 dropdown options again
	exportOptions = page.locator('.c-dropdown__content-open .c-dropdown-menu__item');

	// register a download event listener
	downloadPromise = page.waitForEvent('download');

	// Click the export metadata as xml
	await exportOptions.nth(2).click();

	// Wait for the download to complete
	download = await downloadPromise;

	// Check if the browser downloaded a zip file with name: newspaper-h98z893q54.zip
	expect(download.suggestedFilename()).toBe(
		'wet-en-verordeningsblad-voor-de-bezette-streken-van-belgie.xml'
	);

	// Wait for close to save the videos
	await context.close();
});
