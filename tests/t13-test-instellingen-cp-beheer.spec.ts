import { expect, test } from '@playwright/test';

import { checkActiveSidebarNavigationItem } from './helpers/check-active-sidebar-navigation-item';
import { checkToastMessage } from './helpers/check-toast-message';
import { fillRequestVisitBlade } from './helpers/fill-request-visit-blade';
import { loginUserMeemooIdp } from './helpers/login-user-meemoo-idp';
import { selectText } from './helpers/select-text';

test('T13: Test instellingen CP-beheer', async ({ page, context }) => {
	// Go to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

	// Check page title is the home page
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});

	// Login cp admin using the meemoo idp
	await loginUserMeemooIdp(
		page,
		process.env.TEST_CP_ADMIN_ACCOUNT_USERNAME as string,
		process.env.TEST_CP_ADMIN_ACCOUNT_PASSWORD as string
	);

	// Check logged in status
	await expect(await page.locator('.c-avatar__text')).toHaveText('Test');

	// Admin should not be visible and beheer should be visible
	const navigationItemTexts = await page
		.locator('.l-app a[class*="Navigation_c-navigation__link"]')
		.allInnerTexts();
	await expect(navigationItemTexts).not.toContain('Admin');
	await expect(navigationItemTexts).toContain('Beheer');

	// Go to settings page
	const desktopNavigation = await page.locator(
		'[class*="Navigation_c-navigation__section--responsive-desktop__"]'
	);
	await desktopNavigation
		.locator('[class*="Navigation_c-navigation__link--dropdown__"]', { hasText: 'Beheer' })
		.click();
	await desktopNavigation.locator('[href="/beheer/instellingen"]').click();

	// Check active navigation is settings
	await checkActiveSidebarNavigationItem(page, 0, 'Instellingen', '/beheer/instellingen');

	// Check page title
	await expect(
		await page.locator('[class*="CPAdminLayout_c-cp-admin__page-title__"]')
	).toContainText('Instellingen');

	/**
	 * Upload file section
	 */

	// Upload file
	const uploadFileSection = page.locator(
		'[class*="VisitorSpaceImageForm_c-visitor-space-image-form__image__"]'
	);
	const [fileChooser] = await Promise.all([
		// It is important to call waitForEvent before click to set up waiting.
		page.waitForEvent('filechooser'),
		// Opens the file chooser.
		uploadFileSection.locator('input[type="file"]').click(),
	]);
	await fileChooser.setFiles(['tests/fixtures/new-cover-photo.jpg']);

	// Check background image is displayed
	await expect(
		await uploadFileSection.locator('[class*="CardImage_c-card-image__background--image__"]')
	).toBeVisible();

	// Check upload button changed
	await expect(await uploadFileSection.locator('text=Upload nieuwe afbeelding')).toBeVisible();
	await expect(await uploadFileSection.locator('text=Verwijder afbeelding')).toBeVisible();
	await expect(await uploadFileSection.locator('text=Annuleer')).toBeVisible();
	await expect(await uploadFileSection.locator('text=Bewaar wijzigingen')).toBeVisible();

	// Click save changes button
	await uploadFileSection.locator('text=Bewaar wijzigingen').click();

	// Check toast message for successful save
	await checkToastMessage(page, 'Gelukt');

	// Check save buttons disappeared
	await expect(await uploadFileSection.locator('text=Upload nieuwe afbeelding')).toBeVisible();
	await expect(await uploadFileSection.locator('text=Verwijder afbeelding')).toBeVisible();
	await expect(await uploadFileSection.locator('text=Annuleer')).not.toBeVisible();
	await expect(await uploadFileSection.locator('text=Bewaar wijzigingen')).not.toBeVisible();

	/**
	 * Description during visit request section
	 */

	// Description during visit request
	const descriptionDuringRequestSection = await page.locator(
		'[class*="VisitorSpaceSettings_c-cp-settings__content-block__"]',
		{ hasText: 'Omschrijving aanvraag' }
	);
	await expect(descriptionDuringRequestSection).toBeVisible();

	// Type some text
	const editor1 = await descriptionDuringRequestSection.locator('.public-DraftEditor-content');

	await editor1.type(
		'bold\nitalic\nitem1\nitem2\nitem3\nAnd a link to google\nDit is een automated test. Verschijnt dit in de blade?'
	);

	// Make text "bold" bold
	await selectText(page, editor1, 'bold');
	await descriptionDuringRequestSection.locator('.bfi-bold').click();

	// Make text "italic" italic
	await selectText(page, editor1, 'italic');
	await descriptionDuringRequestSection.locator('.bfi-italic').click();

	// Make "item1, item2, item3" a list
	await selectText(page, editor1, 'item1\nitem2\nitem3');
	await descriptionDuringRequestSection.locator('.bfi-list').click();

	// Add a link to "a link to google"
	await selectText(page, editor1, 'a link to google');
	await descriptionDuringRequestSection.locator('[data-title="Link"]').click();
	await descriptionDuringRequestSection
		.locator('.dropdown-content [placeholder="Link URL invoeren"]')
		.fill('https://google.com');
	await descriptionDuringRequestSection.locator('.dropdown-content .bf-switch').click();
	await descriptionDuringRequestSection
		.locator('.dropdown-content button', { hasText: 'Bevestig' })
		.click();

	// Save buttons appear:
	await expect(await descriptionDuringRequestSection.locator('text=Annuleer')).toBeVisible();
	await expect(
		await descriptionDuringRequestSection.locator('text=Bewaar wijzigingen')
	).toBeVisible();

	// Click save changes button
	await descriptionDuringRequestSection.locator('text=Bewaar wijzigingen').click();

	// Check toast message for successful save
	await checkToastMessage(page, 'Gelukt');

	// Check save buttons disappeared;
	await expect(await descriptionDuringRequestSection.locator('text=Annuleer')).not.toBeVisible();
	await expect(
		await descriptionDuringRequestSection.locator('text=Bewaar wijzigingen')
	).not.toBeVisible();

	/**
	 * Description for waiting for access section
	 */

	// Description during visit request
	const descriptionOnWaitingForAccessSection = await page.locator(
		'[class*="VisitorSpaceSettings_c-cp-settings__content-block__"]',
		{ hasText: 'Omschrijving bij het wachten op toegang' }
	);
	await expect(descriptionOnWaitingForAccessSection).toBeVisible();

	// Type some text
	const editor2 = await descriptionOnWaitingForAccessSection.locator(
		'.public-DraftEditor-content'
	);

	await editor2.type('Dit is een automated test. Verschijnt dit op de wachtpagina?');

	// Save buttons appear:
	await expect(await descriptionOnWaitingForAccessSection.locator('text=Annuleer')).toBeVisible();
	await expect(
		await descriptionOnWaitingForAccessSection.locator('text=Bewaar wijzigingen')
	).toBeVisible();

	// Click save changes button
	await descriptionOnWaitingForAccessSection.locator('text=Bewaar wijzigingen').click();

	// Check toast message for successful save
	await checkToastMessage(page, 'Gelukt');

	// Check save buttons disappeared;
	await expect(await descriptionDuringRequestSection.locator('text=Annuleer')).not.toBeVisible();
	await expect(
		await descriptionDuringRequestSection.locator('text=Bewaar wijzigingen')
	).not.toBeVisible();

	/**
	 * Check changes are correctly shown during visit request flow
	 */

	// Go to homepage
	await page.locator('[class*="Navigation_c-navigation__section--responsive-desktop__"] a', {
		hasText: 'Start je bezoek',
	});

	// Check new background image is visible
	const vrtCard = await page.locator('.p-home__results .c-card', { hasText: 'VRT' });
	const backgroundDiv = await (
		await vrtCard.locator('[class*="CardImage_c-card-image__background--image__"]')
	).innerHTML();
	await expect(backgroundDiv).toContain('new-cover-photo');

	// Click request access button
	await vrtCard.locator('.c-button', { hasText: 'Vraag toegang aan' });

	// Check description text is visible
	await expect(
		await page.locator('text=Dit is een automated test. Verschijnt dit in de blade?')
	).toBeVisible();

	await fillRequestVisitBlade(page, 'vrt', 'checking the description text of the waiting page');

	// Check description text is visible on the waiting page
	await expect(
		await page.locator('text=Dit is een automated test. Verschijnt dit op de wachtpagina?')
	).toBeVisible();

	// Wait for close to save the videos
	await context.close();
});
