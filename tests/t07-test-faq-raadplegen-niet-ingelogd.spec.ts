import { expect, test } from '@playwright/test';

import { acceptCookies } from './helpers/accept-cookies';

test('T07: Test FAQ raadplegen (niet ingelogd)', async ({ page, context }) => {
	// GO to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

	// Check homepage title
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});

	// Accept all cookies
	await acceptCookies(page, 'all');

	// Check the homepage show the correct title for searching maintainers
	await expect(page.locator('text=Vind een aanbieder')).toBeVisible();

	// Click on FAQ button the navbar
	await page
		.locator(
			'[class*="Navigation_c-navigation__section--responsive-desktop"] a[href="/vragen"]'
		)
		.click();

	// Check content page title
	const title = await page.locator('.content-block-preview-0 h2');
	await title.waitFor({
		state: 'visible',
		timeout: 10000,
	});
	await expect(title).toContainText('Veelgestelde vragen');

	// Click on the faq item: Wat kan ik via de Bezoekertool vinden?
	await page.click('text=Wat kan ik via de Bezoekertool vinden?');

	// Check accordion body content
	const accordionBody = await page.locator('.c-accordion__body:visible');
	await expect(await accordionBody.innerHTML()).toContain(
		'Met de bezoekertool kan je toegang vragen tot'
	);

	// Click on the faq item: Wat kan ik via de Bezoekertool vinden?
	await page.click('text=Wat kan ik via de Bezoekertool vinden?');

	// Check that the body has been hidden again
	await expect(accordionBody).not.toBeVisible();

	// Go to the homepage
	await page.click('text=Start je bezoek');

	// Check the homepage show the correct title for searching maintainers
	await expect(page.locator('text=Vind een aanbieder')).toBeVisible();

	// Wait for close to save the videos
	await context.close();
});
