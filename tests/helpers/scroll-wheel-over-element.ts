import type { Page } from '@playwright/test';
import type { Locator } from 'playwright-core';

export async function scrollWheelOverElement(
	page: Page,
	element: Locator,
	scrollSteps: number
): Promise<void> {
	await element.focus();
	await element.hover();
	await page.mouse.wheel(0, scrollSteps);
}
