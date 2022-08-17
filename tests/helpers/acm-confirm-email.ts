import { expect, Page } from '@playwright/test';

export async function acmConfirmEmail(page: Page, userEmail: string): Promise<void> {
	// Load the INT acm dashboard
	await page.goto(process.env.TEST_ACM_DASHBOARD as string);

	// Enter username and password
	await page.fill('#username', process.env.TEST_ACM_DASHBOARD_USERNAME as string);
	await page.fill('#password', process.env.TEST_ACM_DASHBOARD_PASSWORD as string);

	// Click the login button
	await page.click('text=Log in');

	// Enter the user's email in the search field
	await page.fill('[name="email"]', userEmail);

	// Click the search button
	await page.waitForTimeout(1000);
	await page.click('.advanced-search-button .primary.button');

	// Wait for the search results => only a single row should be visible
	await page.waitForFunction(
		() => {
			return document.querySelectorAll('.rt-tbody [role="row"]').length === 1;
		},
		null,
		{
			timeout: 10000,
		}
	);

	// Click the first result row
	await page.click('text=Testers-at');

	// Check the edit user button
	await page.click('text=Aanpassen');

	// Enter true in the email confirmed field
	const emailConfirmedField = await page.locator(':text("E-mail bevestigd") + div input');
	await emailConfirmedField.click();
	await page.locator('[role="listbox"].visible [role="option"]').locator('text=True').click();

	// Click the save button
	await page.click('text=Opslaan');

	// Check that the save was successfull
	await expect(page.locator('text=Je wijzigingen zijn opgeslagen')).toBeVisible();
}
