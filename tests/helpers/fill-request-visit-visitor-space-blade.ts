import { expect, type Page } from '@playwright/test';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';

import { getSiteTranslations } from './get-site-translations';

export async function fillRequestVisitVisitorSpaceBlade(
	page: Page,
	reason: string,
	visitTime: string | null
): Promise<void> {
	const SITE_TRANSLATIONS = await getSiteTranslations();

	// Get active blade
	const activeBlade = page.locator(moduleClassSelector('c-blade--visible'));
	await expect(activeBlade).toBeVisible();

	// Fill in 'reason'
	const reasonInputField = activeBlade.locator('#RequestAccessBlade__requestReason');
	await expect(reasonInputField).toBeVisible();
	await reasonInputField.fill(reason);

	// Fill in 'when' if it is provided
	if (visitTime) {
		await activeBlade.locator('RequestAccessBlade__visitTime').fill(visitTime);
	}

	// Enable checkbox 'Ik vraag deze toegang aan voor onderzoeksdoeleinden of privéstudie'
	const researchCheckboxLabel =
		SITE_TRANSLATIONS.nl[
			'modules/home/components/request-access-blade/request-access-blade___ik-verklaar-deze-toegang-aan-te-vragen-met-het-oog-op-onderzoeksdoeleinden-of-prive-studie'
		];
	await activeBlade
		.locator('.c-checkbox', {
			hasText: researchCheckboxLabel,
		})
		.click();

	// Click on 'Verstuur'
	await page
		.locator(`${moduleClassSelector('c-request-access-blade')} .c-button__label`, {
			hasText:
				SITE_TRANSLATIONS.nl[
					'modules/home/components/request-access-blade/request-access-blade___verstuur'
				],
		})
		.click();

	// Check success message on success page
	const receivedYourRequestText =
		SITE_TRANSLATIONS.nl[
			'pages/slug/toegang-aangevraagd/index___we-hebben-je-aanvraag-ontvangen'
		];
	await expect(page.locator(`text=${receivedYourRequestText}`)).toBeVisible({
		timeout: 10000,
	});
}
