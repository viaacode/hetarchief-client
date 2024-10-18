import { type Page } from '@playwright/test';

import { getSiteTranslations } from './get-site-translations';

type BlockName =
	| 'Voeg een contentblock toe'
	| 'Titel'
	| 'Tekst'
	| 'Tekst (2 kolommen)'
	| 'Knoppen'
	| 'Intro'
	| 'Afbeelding of animated gif'
	| 'Afbeeldingen in grid (meerdere formaten)'
	| 'Overzichtsblok'
	| 'Quote'
	| 'Afbeelding(en) met grote titel, vast formaat (USP)';

/**
 * Adds a content block on page: https://bezoek-int.hetarchief.be/admin/content/maak
 * @param page
 * @param blockName Name of the block to add. eg: Title, Tekst, ...
 */
export async function addContentBlock(page: Page, blockName: BlockName): Promise<void> {
	const SITE_TRANSLATIONS = await getSiteTranslations();

	const blockSelect = page.locator('.o-sidebar__content .c-select');
	await blockSelect
		.locator('.c-select__placeholder', {
			hasText:
				SITE_TRANSLATIONS.nl[
					'admin/content-block/content-block___voeg-een-content-blok-toe'
				],
		})
		.click();

	const options = page.locator('.c-select__option');
	const texts = await options.allInnerTexts();
	const optionIndex = texts.indexOf(blockName);
	await options.nth(optionIndex).click();
}
