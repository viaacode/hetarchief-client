import { Page } from '@playwright/test';
import { Locator } from 'playwright-core';

/**
 * Selects the text (blue highlight) in the editor specified by the editor locator
 * @param page
 * @param editor
 * @param textToSelect
 */
export async function selectText(page: Page, editor: Locator, textToSelect: string): Promise<void> {
	const editorText = await editor.innerText();
	const startIndex = editorText.indexOf(textToSelect);
	await page.keyboard.press('Control+Home');
	for (let i = 0; i < startIndex; i++) {
		await page.keyboard.press('ArrowRight');
	}
	for (let i = 0; i < textToSelect.length; i++) {
		await page.keyboard.press('Shift+ArrowRight');
	}
}
