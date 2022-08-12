import { Page } from '@playwright/test';

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
	const blockSelect = await page.locator('.o-sidebar__content .c-select');
	await blockSelect
		.locator('.c-select__placeholder', { hasText: 'Voeg een contentblock toe' })
		.click();

	const options = await page.locator('.c-select__option');
	const texts = await options.allInnerTexts();
	const optionIndex = texts.indexOf(blockName);
	await options.nth(optionIndex).click();
}
