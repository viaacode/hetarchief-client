import { expect, test } from '@playwright/test';

import { checkActiveSidebarNavigationItem } from './helpers/check-active-sidebar-navigation-item';
import { checkSpaceVisibilityHomepage } from './helpers/check-space-visibility-homepage';
import { checkToastMessage } from './helpers/check-toast-message';
import { loginUserMeemooIdp } from './helpers/login-user-meemoo-idp';

test('T14: Meemoo-beheer: basis beheersfunctionaliteiten', async ({ page, context }) => {
	// Go to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

	// Check page title is the home page
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});

	/**
	 * Set amsab space to status pending
	 */

	// Login cp admin using the meemoo idp
	await loginUserMeemooIdp(
		page,
		process.env.TEST_MEEMOO_ADMIN_ACCOUNT_USERNAME as string,
		process.env.TEST_MEEMOO_ADMIN_ACCOUNT_PASSWORD as string
	);

	// Check logged in status
	await expect(await page.locator('.c-avatar__text')).toHaveText('meemoo');

	/**
	 * Set amsab space status to pending
	 */

	// Go to settings page
	const desktopNavigation = await page.locator(
		'[class*="Navigation_c-navigation__section--responsive-desktop__"]'
	);
	await desktopNavigation
		.locator('[class*="Navigation_c-navigation__link--dropdown__"]', { hasText: 'Admin' })
		.click();

	// Check page title
	await expect(
		await page.locator('[class*="AdminLayout_c-cp-admin__page-title__"]')
	).toContainText('Alle organisaties');

	// Check search input field
	const searchField = await page.locator('.p-cp-visitor-spaces__header [placeholder="Zoek"]');
	await expect(searchField).toBeVisible();

	// Check active tab
	await expect(
		await page.locator('.p-cp-visitor-spaces__status-filter-tab .c-tab--active')
	).toContainText('Alles');

	// Check active nav item in sidebar
	await checkActiveSidebarNavigationItem(
		page,
		0,
		'Zoeken naar aanbieders',
		'/admin/bezoekersruimtesbeheer/bezoekersruimtes'
	);

	// get the Amsab row in the table
	const amsabRow1 = await page.locator('.c-admin__content tbody tr', { hasText: 'Amsab-ISG' });

	// Click the three dots
	await amsabRow1.locator('.c-button', { hasText: 'dots-vertical' }).click();

	// Check the "back to pending" option
	await amsabRow1.locator('.c-button', { hasText: 'Terug naar in aanvraag' }).click();

	// Check success toast
	await checkToastMessage(page, 'Succes');

	/**
	 * Check amsab is not visible on homepage
	 */

	await checkSpaceVisibilityHomepage(page, 'amsab', false);

	/**
	 * Set amsab space status to active
	 */

	// Enter 'AM' in the search field
	await searchField.fill('AM');
	await searchField.press('Enter');

	// Check each row contains 'am'
	const rows = await page.$$('.c-admin__content tbody tr');
	for (const row of rows) {
		await expect((await row.innerHTML()).toLowerCase()).toContain('am');
	}

	// Get the amsab row:
	const amsabRow2 = await page.locator('.c-admin__content tbody tr', { hasText: 'Amsab-ISG' });

	// Check publication status is pending
	await expect(await amsabRow2.locator('td', { hasText: 'in aanvraag' })).toBeVisible();

	// Click the three dots
	await amsabRow2.locator('.c-button', { hasText: 'dots-vertical' }).click();

	// Check correct options are shown:
	await expect(await amsabRow2.locator('.c-button', { hasText: 'activeren' })).toBeVisible();
	await expect(await amsabRow2.locator('.c-button', { hasText: 'deactiveren' })).toBeVisible();

	// Click on activate
	await amsabRow2.locator('.c-button', { hasText: 'activeren' }).click();

	// Check success toast
	await checkToastMessage(page, 'Succes');

	/**
	 * Check amsab is visible on the homepage
	 */

	await checkSpaceVisibilityHomepage(page, 'amsab', true);

	/**
	 * Users
	 */

	// Click the users sidebar nav
	await page.click(
		'[class*="SidebarLayout_l-sidebar__navigation__"] [href="/admin/gebruikersbeheer/gebruikers"]'
	);

	// Check title
	await expect(
		await page.locator('[class*="AdminLayout_c-admin__page-title__"]', {
			hasText: 'Gebruikers',
		})
	).toBeVisible();

	// check search input field
	const usersSearchField = await page.locator(
		'[placeholder="Zoek op naam, e-mail, organisatie, groep, stamboeknummer"]'
	);
	await expect(usersSearchField).toBeVisible();

	// check filters
	await expect(
		await page.locator('.c-checkbox-dropdown-modal__trigger', { hasText: 'Gebruikersgroep' })
	).toBeVisible();
	await expect(
		await page.locator('.c-checkbox-dropdown-modal__trigger', { hasText: 'Organisatie' })
	).toBeVisible();
	await expect(
		await page.locator('.c-checkbox-dropdown-modal__trigger', { hasText: 'Laatste toegeng' })
	).toBeVisible();

	// Check users is active in sidebar
	await checkActiveSidebarNavigationItem(
		page,
		0,
		'Gebruikers',
		'/admin/gebruikersbeheer/gebruikers'
	);

	// Check user row is visible
	await expect(
		await page.locator('table tbody tr', { hasText: 'marie.odhiambo@example.com' })
	).toBeVisible();

	// Search for 'Marie'
	await usersSearchField.fill('Marie');
	await usersSearchField.press('Enter');

	// Check first row contains "Marie" and the row with "Ilya" is not visible
	await expect(await page.locator('table tbody tr', { hasText: 'marie' })).toBeVisible();
	await expect(await page.locator('table tbody tr', { hasText: 'Ilya' })).not.toBeVisible();

	/**
	 * Groups and permissions
	 */

	// Click the users sidebar nav
	await page.click(
		'[class*="SidebarLayout_l-sidebar__navigation__"] [href="/admin/gebruikersbeheer/permissies"]'
	);

	// Check title
	await expect(
		await page.locator('[class*="AdminLayout_c-admin__page-title__"]', {
			hasText: 'Groepen en permissies',
		})
	).toBeVisible();

	// check search input field
	const permissionsSearchField = await page.locator('[placeholder="Zoek..."]');
	await expect(permissionsSearchField).toBeVisible();

	// check table headers
	await expect(
		await page.locator('.c-table__cell--header', { hasText: 'Kioskgebruiker' })
	).toBeVisible();
	await expect(
		await page.locator('.c-table__cell--header', { hasText: 'Gebruiker' })
	).toBeVisible();
	await expect(
		await page.locator('.c-table__cell--header', { hasText: 'Contentpartner medewerker' })
	).toBeVisible();
	await expect(
		await page.locator('.c-table__cell--header', { hasText: 'Sitebeheerder' })
	).toBeVisible();

	// Check groups and permissions is active in sidebar
	await checkActiveSidebarNavigationItem(
		page,
		0,
		'Groepen en permissies',
		'/admin/gebruikersbeheer/permissies'
	);

	// Toggle permission
	await page
		.locator('.c-table__row', { hasText: 'Account: accountdropdown en notificaties' })
		.locator('.c-checkbox__input')
		.check();

	// Click the save button
	await page.locator('.c-button', { hasText: 'Wijzigingen opslaan' }).first().click();

	// Check success toast
	await checkToastMessage(page, 'Gelukt');

	// Herlaad de pagina
	await page.reload();

	// Wait for title of page to be set
	await page.waitForFunction(
		() => document.title === 'Groepen en permissies | bezoekertool',
		null,
		{
			timeout: 10000,
		}
	);

	// Check permission is still checked
	const checkbox = await page
		.locator('.c-table__row', { hasText: 'Account: accountdropdown en notificaties' })
		.locator('.c-checkbox__input');
	await expect(checkbox).toBeChecked();

	// Uncheck the checkbox
	await checkbox.uncheck();

	// Click the save button
	await page.locator('.c-button', { hasText: 'Wijzigingen opslaan' }).first().click();

	// Check success toast
	await checkToastMessage(page, 'Gelukt');

	// Herlaad de pagina
	await page.reload();

	// Wait for title of page to be set
	await page.waitForFunction(
		() => document.title === 'Groepen en permissies | bezoekertool',
		null,
		{
			timeout: 10000,
		}
	);

	// Check permission is still checked
	const checkbox2 = await page
		.locator('.c-table__row', { hasText: 'Account: accountdropdown en notificaties' })
		.locator('.c-checkbox__input');
	await expect(checkbox2).toBeChecked({ checked: false });

	/**
	 * Navigation menu bars
	 */

	// Click the navigations in the sidebar
	await page.click('[class*="SidebarLayout_l-sidebar__navigation__"] [href="/admin/navigatie"]');

	// Check title
	await expect(
		await page.locator('[class*="AdminLayout_c-admin__page-title__"]', {
			hasText: 'Navigatie',
		})
	).toBeVisible();

	// Check both navigation bars are present
	const navBarFooterCenter = await page.locator('[href="/admin/navigatie/footer_center"]', {
		hasText: 'Footer Center',
	});
	const navBarHeaderLeft = await page.locator('[href="/admin/navigatie/header_left"]', {
		hasText: 'Header Left',
	});
	await expect(navBarFooterCenter).toBeVisible();
	await expect(navBarHeaderLeft).toBeVisible();

	// Click on footer center
	await navBarFooterCenter.click();

	// Check title
	await expect(
		await page.locator('[class*="AdminLayout_c-admin__page-title__"]', {
			hasText: 'Footer Center',
		})
	).toBeVisible();

	// Check Privacy nav item
	const navItemPrivacy = await page.locator('.c-admin__content tr', {
		hasText: 'Privacy',
	});
	await expect(navItemPrivacy).toBeVisible();

	// Delete the privacy item
	await navItemPrivacy.locator('[title="Verwijder dit navigatie item"]').click();

	// Confirm the modal
	await page.locator('.c-modal-context--visible .c-button', { hasText: 'Verwijder' }).click();

	// Check success toast
	await checkToastMessage(page, 'Gelukt');

	// Check privacy item is gone
	const navItemPrivacy2 = await page.locator('.c-admin__content tr', {
		hasText: 'Privacy',
	});
	await expect(navItemPrivacy2).not.toBeVisible(); // TODO does not work without a reload

	// Click the add an item button
	await page.locator('.c-button', { hasText: 'Voeg een item toe' }).click();

	// Wait for close to save the videos
	await context.close();
});
