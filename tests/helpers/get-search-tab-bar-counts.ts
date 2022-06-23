import { Page } from '@playwright/test';

export async function getSearchTabBarCounts(
	page: Page
): Promise<{ all: number; video: number; audio: number }> {
	const tabBar = await page.locator('[class*="ScrollableTabs_c-scrollable-tabs"]');
	const allTab = await tabBar.locator('.c-tab--all small').innerText();
	const videosTab = await tabBar.locator('.c-tab--video small').innerText();
	const audioTab = await tabBar.locator('.c-tab--audio small').innerText();

	return {
		all: parseInt(allTab.replace(/[^0-ç]g/, '')),
		video: parseInt(videosTab.replace(/[^0-ç]g/, '')),
		audio: parseInt(audioTab.replace(/[^0-ç]g/, '')),
	};
}
