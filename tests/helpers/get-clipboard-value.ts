import { type BrowserContext, type Page } from '@playwright/test';

export async function getClipboardValue(page: Page, context: BrowserContext): Promise<string> {
	await context.grantPermissions(['clipboard-read']);

	const handle = await page.evaluateHandle(() => navigator.clipboard.readText());
	return await handle.jsonValue();
}
