import { type Page } from '@playwright/test';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';

export interface SearchTabCounts {
	all: number;
	video: number;
	audio: number;
	newspaper: number;
}

export async function getSearchTabBarCounts(page: Page): Promise<SearchTabCounts> {
	await page.waitForTimeout(1000);
	const tabBar = page.locator(moduleClassSelector('c-scrollable-tabs'));
	const allTab = await tabBar.locator('.c-tab--all small').innerText();
	const videosTab = await tabBar.locator('.c-tab--video small').innerText();
	const audioTab = await tabBar.locator('.c-tab--audio small').innerText();
	const newspaperTab = await tabBar.locator('.c-tab--newspaper small').innerText();

	return {
		all: parseInt(allTab.replace(/[^0-9]+/g, '')),
		video: parseInt(videosTab.replace(/[^0-9]+/g, '')),
		audio: parseInt(audioTab.replace(/[^0-9]+/g, '')),
		newspaper: parseInt(newspaperTab.replace(/[^0-9]+/g, '')),
	};
}
