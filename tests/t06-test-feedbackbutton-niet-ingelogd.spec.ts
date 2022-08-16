import { expect, test } from '@playwright/test';

test('T06: Test Feedbackbutton (niet ingelogd)', async ({ page, context }) => {
	// GO to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

	// Check homepage title
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});

	// Check the homepage show the correct title for searching maintainers
	await expect(await page.locator('text=Vind een aanbieder')).toBeVisible();

	// Click the zendesk button
	const zendeskIframeButton = await page.frameLocator('iframe#launcher');
	const zendeskButton = await zendeskIframeButton.locator('button[data-testid="launcher"]');
	await expect(zendeskButton).toBeVisible();
	await zendeskButton.click();

	// Check that the zendesk form is visible
	const zendeskIframeForm = await page.frameLocator('#webWidget');
	await expect(await zendeskIframeForm.locator('[name="email"]')).toBeVisible();

	// Fill in zendesk form
	await zendeskIframeForm
		.locator('[name="email"]')
		.fill(process.env.TEST_VISITOR_ACCOUNT_USERNAME as string);
	await zendeskIframeForm.locator('[name="description"]').fill('automated test bezoekertool');

	// Click the zendesk send button and wait for the zendesk response
	const [response] = await Promise.all([
		// Waits for the next request with the specified url
		page.waitForResponse('https://meemoo.zendesk.com/api/v2/requests'),
		// Triggers the request
		zendeskIframeForm.locator('button[data-testid="button-ok"]').click(),
	]);
	await expect(response.ok()).toEqual(true);

	// Check message sent status
	await expect(await zendeskIframeForm.locator('#widgetHeaderTitle')).toContainText(
		'Message sent'
	);

	// Wait for close to save the videos
	await context.close();
});
