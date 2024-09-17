import { type Page } from '@playwright/test';
import { type Locator } from 'playwright-core';

export async function isElementFullscreen(page: Page, element: Locator): Promise<boolean> {
	const viewportSize = page.viewportSize();
	if (!viewportSize) {
		throw new Error('could not get page viewport size');
	}

	const elementSize = await element.boundingBox();

	if (!elementSize) {
		throw new Error('could not get element size');
	}

	return elementSize.width === viewportSize.width && elementSize.height === viewportSize.height;
}
