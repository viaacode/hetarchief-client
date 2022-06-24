import { expect, Page } from '@playwright/test';
import { Locator } from 'playwright-core';

export async function checkActiveSidebarNavigationItem(
	page: Page,
	navigationListIndex: number,
	label: string,
	linkUrlPrefix: string
): Promise<Locator> {
	const sidebarSelector = `[class*="SidebarLayout_l-sidebar__navigation__"] >> nth=${navigationListIndex}`;
	const activeSelector = `${sidebarSelector} >> [class*="ListNavigation_c-list-navigation__item--active"]`;
	await expect
		.poll(async () => {
			const activeNavigationItem = await page.locator(activeSelector);
			return activeNavigationItem.innerHTML();
		})
		.toContain(label);
	const activeNavigationItem = await page.locator(activeSelector);
	await expect(await activeNavigationItem.innerHTML()).toContain(`href="${linkUrlPrefix}`);

	return page.locator(sidebarSelector);
}
