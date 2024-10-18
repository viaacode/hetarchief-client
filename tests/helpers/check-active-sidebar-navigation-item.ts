import { expect, type Page } from '@playwright/test';
import { type Locator } from 'playwright-core';

import { moduleClassSelector } from './module-class-locator';

export async function checkActiveSidebarNavigationItem(
	page: Page,
	navigationListIndex: number,
	label: string,
	linkUrlPrefix: string
): Promise<Locator> {
	const sidebarSelector = `${moduleClassSelector(
		'l-sidebar__navigation'
	)} >> nth=${navigationListIndex}`;
	const activeSelector = `${sidebarSelector} >> ${moduleClassSelector(
		'c-list-navigation__item--active'
	)}`;
	const activeNavigationItem = await page.locator(activeSelector);
	await expect(await activeNavigationItem).toBeVisible();
	await expect(await activeNavigationItem.innerHTML()).toContain(label);
	await expect(await activeNavigationItem.innerHTML()).toContain(`href="${linkUrlPrefix}`);

	return page.locator(sidebarSelector);
}
