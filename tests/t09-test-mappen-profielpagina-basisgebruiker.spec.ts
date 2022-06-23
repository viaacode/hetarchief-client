import { expect, test } from '@playwright/test';

import { getSearchTabBarCounts } from './helpers/get-search-tab-bar-counts';
import { loginUserHetArchiefIdp } from './helpers/login-user-het-archief-idp';

test('T09: Test mappen + profielpagina basisgebruiker\t\t\t', async ({ page, context }) => {
	// GO to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

	// Check homepage title
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});

	// Check the homepage show the correct title for searching maintainers
	await expect(await page.locator('text=Vind een aanbieder')).toBeVisible();

	// Click on login or register
	await page.locator('text=Inloggen of registreren').click();

	// Login with existing user
	await loginUserHetArchiefIdp(
		page,
		process.env.TEST_VISITOR_ACCOUNT_USERNAME as string,
		process.env.TEST_VISITOR_ACCOUNT_PASSWORD as string
	);

	// Check homepage title
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});

	// Check toast message is shown for visitor space access
	await page.waitForFunction(
		() => document.querySelectorAll('[data-testid="toast-title"]').length > 0,
		null,
		{
			timeout: 120000, // 2 min
		}
	);
	await expect(await page.locator('Je hebt nu toegang tot VRT')).toBeVisible();

	// Check green badge is visible and has value 1
	const badge = await page.locator('[role="menuitem"] .c-badge').first();
	await expect(badge).toBeVisible();
	await expect(badge).toContainText('1');

	// Click on "start you visit" navigation item
	await page.click('text=Start je bezoek');

	// Check flyout menu is visible
	const flyout = await page.locator('.c-dropdown__content-open');
	const flyoutHtml = await flyout.innerHTML();
	await expect(flyoutHtml).toContain('Zoeken naar aanbieders');
	await expect(flyoutHtml).toContain('VRT');

	// Click on VRT in the flyout menu
	await flyout.locator('text=VRT').click();

	// Check empty results banner
	await expect(await page.locator('h3:has-text("Geen resultaten")')).toBeVisible();

	// Check VRT in sub navigation
	const subNavigationTitle = await page.locator(
		'.p-visitor-space [class*="Navigation_c-navigation"] h1'
	);
	await expect(subNavigationTitle).toBeVisible();
	await expect(subNavigationTitle).toContainText('VRT');

	// Get tab counts before search
	const countsBeforeSearch = await getSearchTabBarCounts(page);

	// Enter search term
	const SEARCH_TERM = 'journaal';
	const searchField = await page.locator('.c-tags-input__input-container');
	await searchField.click();
	await searchField.type(SEARCH_TERM);
	await searchField.press('Enter');

	// Check green pill exists with search term inside
	const pill = await page.locator('.c-tags-input__multi-value .c-tag__label');
	await expect(pill).toBeVisible();
	await expect(pill).toContainText(SEARCH_TERM);

	// Check tab counts decreased
	const countsAfterSearch = await getSearchTabBarCounts(page);

	// Expect counts to have gone down, or stay the same
	if (countsBeforeSearch.all > 0) {
		// Only check counts if there are at least a few items
		expect(countsBeforeSearch.all > countsAfterSearch.all).toBeTruthy();
		expect(countsBeforeSearch.video >= countsAfterSearch.video).toBeTruthy();
		expect(countsBeforeSearch.audio >= countsAfterSearch.audio).toBeTruthy();
	}

	// Wait for close to save the videos
	await context.close();
});
