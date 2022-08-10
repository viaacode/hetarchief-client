import { expect, test } from '@playwright/test';
import { format } from 'date-fns';

import { addContentBlock } from './helpers/add-content-block';
import { checkActiveSidebarNavigationItem } from './helpers/check-active-sidebar-navigation-item';
import { checkSpaceVisibilityHomepage } from './helpers/check-space-visibility-homepage';
import { checkToastMessage } from './helpers/check-toast-message';
import { loginUserHetArchiefIdp } from './helpers/login-user-het-archief-idp';

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
	await loginUserHetArchiefIdp(
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

	// Wait for title of page to be set
	await page.waitForFunction(() => document.title === 'Alle organisaties | bezoekertool', null, {
		timeout: 10000,
	});

	// Check page title
	await expect(
		await page.locator('[class*="AdminLayout_c-admin__page-title__"]', {
			hasText: 'Alle organisaties',
		})
	).toBeVisible();

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
	await expect(amsabRow2.locator('.c-button', { hasText: 'activeren' }).first()).toBeVisible();
	await expect(amsabRow2.locator('.c-button', { hasText: 'deactiveren' }).last()).toBeVisible();

	// Click on activate
	await amsabRow2.locator('.c-button', { hasText: 'activeren' }).first().click();

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
		await page.locator('.c-checkbox-dropdown-modal__trigger', { hasText: 'Laatste toegang' })
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

	// Wait for title of page to be set
	await page.waitForFunction(
		() => document.title === 'Groepen en permissies | bezoekertool',
		null,
		{
			timeout: 10000,
		}
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
		await page.locator('.c-table__cell--header', { hasText: 'Gebruiker' }).last()
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
		.locator('.c-checkbox__check-icon')
		.first()
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
		.locator('.c-checkbox__check-icon')
		.first();
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
		.locator('.c-checkbox__check-icon')
		.first();
	await expect(checkbox2).toBeChecked({ checked: false });

	/**
	 * Navigation menu bars
	 */

	// Click the navigations in the sidebar
	await page.click('[class*="SidebarLayout_l-sidebar__navigation__"] [href="/admin/navigatie"]');

	// Wait for title of page to be set
	await page.waitForFunction(() => document.title === 'Navigatie | bezoekertool', null, {
		timeout: 10000,
	});

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
		await page.locator('.c-admin__page-title', {
			hasText: 'Navigatie balk:Footer Center',
		})
	).toBeVisible();

	// Check Privacy nav item
	const navItemPrivacy = await page.locator('.c-admin__content tr', {
		hasText: 'Privacy',
	});
	await expect(navItemPrivacy).toBeVisible();

	/**
	 * Delete a nav item
	 */

	// Delete the privacy item
	await navItemPrivacy.locator('[title="Verwijder dit navigatie item"]').click();

	// Confirm the modal
	await page
		.locator('.c-modal-context--visible button[class*="Button-module_c-button__"]', {
			hasText: 'Verwijder',
		})
		.click();

	// Check success toast
	await checkToastMessage(page, 'Gelukt');

	// Check privacy item is gone
	// const navItemPrivacy2 = await page.locator('.c-admin__content tr', {
	// 	hasText: 'Privacy',
	// });
	// await expect(navItemPrivacy2).not.toBeVisible(); // TODO does not work without a reload => waiting for https://github.com/viaacode/react-admin-core-module/pull/40

	// Go to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

	// Check page title is the home page
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});

	// Check privacy link in footer is not present
	await expect(
		await page.locator('[class*="Footer_c-footer__link__"]', { hasText: 'Privacy' })
	).not.toBeVisible();

	// Go back to the navigations footer center page
	await page.goBack();

	/**
	 * Add a nav item
	 */

	// Click the add an item button
	await page
		.locator('button[class*="Button-module_c-button__"]', { hasText: 'Voeg een item toe' })
		.click();

	// Check title
	await expect(
		await page.locator('.c-admin__page-title', {
			hasText: 'item Toevoegen',
		})
	).toBeVisible();

	// Set label to Privacy
	await page
		.locator('.c-admin__content .o-form-group', { hasText: 'Label' })
		.locator('.c-input')
		.fill('Privacy');

	// Set link type to external hyperlink
	const linkSection = await page.locator('.o-form-group', { hasText: 'Link' });
	const linkTypeSelect = await linkSection.locator('.c-select__single-value');
	await linkTypeSelect.click();
	await linkSection.locator('.c-select__option', { hasText: 'Externe Hyperlink' }).click();

	// Fill in the external link
	await linkSection
		.locator('[placeholder="https://"]')
		.fill('https://meemoo.be/nl/privacybeleid');

	// Set visible for:
	const visibleForSection = await page.locator('.o-form-group', { hasText: 'Zichtbaar voor' });
	await visibleForSection.locator('.c-tags-input__dropdown-indicator').first().click();
	await visibleForSection
		.locator('.c-tags-input__option', { hasText: 'Niet-ingelogde gebruikers' })
		.click();
	await visibleForSection.locator('.c-tags-input__dropdown-indicator').first().click();
	await visibleForSection
		.locator('.c-tags-input__option', { hasText: 'Ingelogde gebruikers' })
		.last()
		.click();

	// Click the save button
	await page.locator('button[class*="Button-module_c-button__"]', { hasText: 'Opslaan' }).click();

	// Check success toast
	await checkToastMessage(page, 'Gelukt');

	// Check Privacy nav item
	const navItemPrivacy2 = await page.locator('.c-admin__content tr', {
		hasText: 'Privacy',
	});
	await expect(navItemPrivacy2).toBeVisible();

	// Go to the hetarchief homepage
	await page.goto(process.env.TEST_CLIENT_ENDPOINT as string);

	// Check page title is the home page
	await page.waitForFunction(() => document.title === 'Home | bezoekertool', null, {
		timeout: 10000,
	});

	// Check privacy link in footer is not present
	await expect(
		await page.locator('[class*="Footer_c-footer__link__"]', { hasText: 'Privacy' })
	).toBeVisible();

	// Go back to the navigations footer center page
	await page.goBack();

	/**
	 * Translations
	 */

	// Click the translations in the sidebar
	await page.click(
		'[class*="SidebarLayout_l-sidebar__navigation__"] [href="/admin/vertalingen"]'
	);

	// Wait for title of page to be set
	await page.waitForFunction(() => document.title === 'Vertalingen | bezoekertool', null, {
		timeout: 10000,
	});

	// Check title
	await expect(
		await page.locator('[class*="AdminLayout_c-admin__page-title__"]', {
			hasText: 'Vertalingen',
		})
	).toBeVisible();

	// Check search field
	const translationsSearchField = await page.locator('.c-toolbar .c-input');
	await expect(translationsSearchField).toBeVisible();

	// Sidebar nav translations is active
	await checkActiveSidebarNavigationItem(page, 0, 'Vertalingen', '/admin/vertalingen');

	// Search for "active"
	await translationsSearchField.fill('Active');

	// Check each row contains 'active'
	const rows1 = await page.$$('.c-key-value-editor tbody tr');
	for (const row of rows1) {
		await expect((await row.innerHTML()).toLowerCase()).toContain('active');
	}

	// Change "activeren" into "publiceren"
	const activateRow = await page
		.locator('.c-key-value-editor tbody tr', { hasText: 'FRONTEND/modules/admin/const/spaces' })
		.first();
	await activateRow.locator('textarea').fill('Publiceren');

	// Click on save button
	await page.locator('.c-button', { hasText: 'Wijzigingen opslaan' }).click();

	// Check success toast
	await checkToastMessage(page, 'Gelukt');

	// Change "publiceren" into "activeren"
	const publishRow = await page
		.locator('.c-key-value-editor tbody tr', { hasText: 'FRONTEND/modules/admin/const/spaces' })
		.first();
	await publishRow.locator('textarea').fill('activeren');

	// Click on save button
	await page.locator('.c-button', { hasText: 'Wijzigingen opslaan' }).click();

	// Check success toast
	await checkToastMessage(page, 'Gelukt');

	/**
	 * Content pages
	 */

	// Click the content pages in the sidebar
	await page.click('[class*="SidebarLayout_l-sidebar__navigation__"] [href="/admin/content"]');

	// Wait for title of page to be set
	await page.waitForFunction(() => document.title === 'Contentpaginas | bezoekertool', null, {
		timeout: 10000,
	});

	// Check title
	await expect(
		await page.locator('[class*="AdminLayout_c-admin__page-title__"]', {
			hasText: 'Content overzicht',
		})
	).toBeVisible();

	// Sidebar nav content pages is active
	await checkActiveSidebarNavigationItem(page, 0, 'Contentpaginas', '/admin/content');

	// Check search field
	const contentPageSearchField = await page.locator(
		'.c-content-overview__table [placeholder="Zoeken op auteur, titel, rol ..."]'
	);
	await expect(contentPageSearchField).toBeVisible();

	// Check filters
	await expect(
		await page.locator('.c-dropdown__trigger', { hasText: 'Contenttype' })
	).toBeVisible();
	await expect(await page.locator('.c-dropdown__trigger', { hasText: 'Auteur' })).toBeVisible();
	await expect(
		await page.locator('.c-dropdown__trigger', { hasText: 'Gebruikersgroep' })
	).toBeVisible();
	await expect(
		await page.locator('.c-dropdown__trigger', { hasText: 'Aangemaakt' })
	).toBeVisible();
	await expect(
		await page.locator('.c-dropdown__trigger', { hasText: 'Bewerkt op' })
	).toBeVisible();
	await expect(await page.locator('.c-dropdown__trigger', { hasText: 'Publiek' })).toBeVisible();
	await expect(
		await page.locator('.c-dropdown__trigger', { hasText: 'Publicatie' })
	).toBeVisible();
	await expect(
		await page.locator('.c-dropdown__trigger', { hasText: 'Publiceer op' }).first()
	).toBeVisible();
	await expect(
		await page.locator('.c-dropdown__trigger', { hasText: 'Depubliceer op' })
	).toBeVisible();
	await expect(await page.locator('.c-dropdown__trigger', { hasText: 'Labels' })).toBeVisible();

	/**
	 * Content pagina toevoegen
	 */

	// Click on "add content page" button
	await page.locator('a[href="/admin/content/maak"]').click();

	// Check title
	await expect(
		await page.locator('.c-admin__page-title', {
			hasText: 'Content toevoegen',
		})
	).toBeVisible();

	// Sidebar nav content pages is active
	await checkActiveSidebarNavigationItem(page, 0, 'Contentpaginas', '/admin/content');

	// Check tabs and active tab
	await expect(
		page.locator('.c-navbar .c-tab-item__active', { hasText: 'Inhoud' })
	).toBeVisible();
	await expect(
		page.locator('.c-navbar .c-tab-item', { hasText: 'Publicatiedetails' })
	).toBeVisible();

	/**
	 * Content tab
	 */

	// Add a title block
	await addContentBlock(page, 'Titel');

	// Check title block config is added
	const contentBlockForm1 = await page.locator('.o-sidebar__content .c-content-block-form');
	await expect(
		await contentBlockForm1.locator('.c-accordion__header-title', {
			hasText: 'Titel (1/1)',
		})
	).toBeVisible();

	// Enter block title
	await contentBlockForm1
		.locator('.o-form-group')
		.first()
		.locator('.c-input')
		.fill('Automated test');

	// Check title is present in preview
	const previewContainer = await page.locator('.c-content-edit-view__preview');
	await expect(
		await previewContainer.locator('.c-h2', { hasText: 'Automated test' })
	).toBeVisible();

	// Add text block
	await addContentBlock(page, 'Tekst');

	// Check tekst block config is added
	const contentBlockForm2 = await page
		.locator('.o-sidebar__content .c-content-block-form')
		.nth(1);
	await expect(
		await contentBlockForm2.locator('.c-accordion__header-title', {
			hasText: 'Tekst (2/2)',
		})
	).toBeVisible();

	// Set text to "Automated test"
	const descriptionEditor = await contentBlockForm2.locator('.DraftEditor-editorContainer');
	await descriptionEditor.click();
	await descriptionEditor.type('Automated test');

	// Select the text
	await page.keyboard.press('Control+a');

	// Make text bold
	await contentBlockForm2.locator('.bfi-bold').click();

	/**
	 * Publication details tab
	 */

	// Go to the publication details tab
	await page.locator('.c-navbar .c-tab-item', { hasText: 'Publicatiedetails' }).click();

	// Check active tab is publication details
	await expect(
		page.locator('.c-navbar .c-tab-item__active', { hasText: 'Publicatiedetails' })
	).toBeVisible();

	// Check field are visible
	const contentEditContainer = page.locator('.c-content-edit-form');
	await expect(
		contentEditContainer.locator('button', { hasText: 'Hoofdafbeelding' })
	).toBeVisible();
	const pageTitleField = contentEditContainer.locator('.o-form-group', {
		hasText: 'Paginatitel',
	});
	await expect(pageTitleField).toBeVisible();
	await expect(
		contentEditContainer.locator('.o-form-group', {
			hasText: "Beschrijving voor overzichtspagina's",
		})
	).toBeVisible();

	// Fill in "Automated test" as the title
	const pageTitle = 'Automated test ' + Math.random().toString().substring(2, 9);
	await pageTitleField.locator('.c-input').fill(pageTitle);

	// Click on save
	await page.locator('button[class*="Button-module_c-button__"]', { hasText: 'Opslaan' }).click();

	// Check success toast
	await checkToastMessage(page, 'Gelukt');

	// Check buttons are visible
	await expect(
		page.locator('button[class*="Button-module_c-button__"]', {
			hasText: 'Publicatiestatus',
		})
	).toBeVisible();
	await expect(
		page.locator('button[class*="Button-module_c-button__"]', {
			hasText: 'Preview',
		})
	).toBeVisible();
	await expect(
		page.locator('button[class*="Button-module_c-button__"]', {
			hasText: 'Bewerken',
		})
	).toBeVisible();
	await expect(page.locator('.c-dropdown__trigger [title="Meer opties"] ')).toBeVisible();

	/**
	 * Verify created page exists
	 */
	// Click the content pages in the sidebar
	await page.click('[class*="SidebarLayout_l-sidebar__navigation__"] [href="/admin/content"]');

	// Check title
	await expect(
		await page.locator('[class*="AdminLayout_c-admin__page-title__"]', {
			hasText: 'Content overzicht',
		})
	).toBeVisible();

	// Sidebar nav content pages is active
	await checkActiveSidebarNavigationItem(page, 0, 'Contentpaginas', '/admin/content');

	// Check first row is the newly created content page
	const createdPageRow = await page.locator('.c-filter-table tbody tr', { hasText: pageTitle });
	await expect(createdPageRow).toBeVisible();

	// Click on created page row title
	await createdPageRow.locator('td').first().locator('a').click();

	/**
	 * Edit content page
	 */

	// Check title
	await expect(
		await page.locator('.c-admin__page-title', {
			hasText: pageTitle,
		})
	).toBeVisible();

	// Check buttons are visible
	await expect(
		page.locator('button[class*="Button-module_c-button__"]', {
			hasText: 'Publicatiestatus',
		})
	).toBeVisible();
	await expect(
		page.locator('button[class*="Button-module_c-button__"]', {
			hasText: 'Preview',
		})
	).toBeVisible();
	await expect(
		page.locator('button[class*="Button-module_c-button__"]', {
			hasText: 'Bewerken',
		})
	).toBeVisible();

	// Click on edit button
	await page
		.locator('button[class*="Button-module_c-button__"]', {
			hasText: 'Bewerken',
		})
		.click();

	// Check buttons are visible
	await expect(
		page.locator('.c-admin__actions button[class*="Button-module_c-button__"]', {
			hasText: 'Annuleer',
		})
	).toBeVisible();
	await expect(
		page.locator('.c-admin__actions button[class*="Button-module_c-button__"]', {
			hasText: 'Opslaan',
		})
	).toBeVisible();

	// Add text block
	await addContentBlock(page, 'Tekst');

	// Check tekst block config is added
	const contentBlockForm3 = await page
		.locator('.o-sidebar__content .c-content-block-form')
		.nth(2);
	await expect(
		await contentBlockForm3.locator('.c-accordion__header-title', {
			hasText: 'Tekst (3/3)',
		})
	).toBeVisible();

	// Enter the text "Automated test 2"
	const editor3 = await contentBlockForm3.locator('.DraftEditor-editorContainer');
	await editor3.click();
	await editor3.type('Automated test 2');

	// Select the text
	await page.keyboard.press('Control+a');

	// Make text bold
	await contentBlockForm3.locator('.bfi-italic').click();

	// Check tekst block is shown in the preview
	const previewContainer2 = await page.locator('.c-content-edit-view__preview');
	await expect(
		await previewContainer2.locator('.c-rich-text-block em', { hasText: 'Automated test 2' })
	).toBeVisible();

	// Click on save
	await page.locator('button[class*="Button-module_c-button__"]', { hasText: 'Opslaan' }).click();

	// Check success toast
	await checkToastMessage(page, 'Gelukt');

	// Check buttons are visible
	await expect(
		page.locator('button[class*="Button-module_c-button__"]', {
			hasText: 'Publicatiestatus',
		})
	).toBeVisible();
	await expect(
		page.locator('button[class*="Button-module_c-button__"]', {
			hasText: 'Preview',
		})
	).toBeVisible();
	await expect(
		page.locator('button[class*="Button-module_c-button__"]', {
			hasText: 'Bewerken',
		})
	).toBeVisible();

	/**
	 * Change publish status on the content page
	 */

	// Click the publication status button
	await page
		.locator('button[class*="Button-module_c-button__"]', {
			hasText: 'Publicatiestatus',
		})
		.click();

	// Check modal opens up
	const modal = await page.locator('.c-modal-context--visible', {
		hasText: 'Maak deze contentpagina publiek.',
	});
	await expect(modal).toBeVisible();

	// Select radio button "public"
	await modal.locator('.c-radio', { hasText: 'Publiek' }).click();

	// Click the save button in the modal
	await modal
		.locator('button[class*="Button-module_c-button__"]', { hasText: 'Opslaan' })
		.click();

	// Check success toast
	await checkToastMessage(page, 'Gelukt');

	// Check unlock icon in publish status button
	await expect(
		page
			.locator('[class*="Button-module_c-button__"]', { hasText: 'Publicatiestatus' })
			.locator('.o-svg-icon--unlock-3')
	).toBeVisible();

	/**
	 * Verify publication status in overview
	 */
	// Click the content pages in the sidebar
	await page.click('[class*="SidebarLayout_l-sidebar__navigation__"] [href="/admin/content"]');

	// Check title
	await expect(
		await page.locator('[class*="AdminLayout_c-admin__page-title__"]', {
			hasText: 'Content overzicht',
		})
	).toBeVisible();

	// Check first row is the newly created content page
	const createdPageRow2 = await page.locator('.c-filter-table tbody tr', { hasText: pageTitle });
	await expect(createdPageRow2).toBeVisible();

	// Check publish status
	await expect(createdPageRow2.locator('td').nth(5)).toContainText(
		format(new Date(), 'dd-MM-yyyy')
	);

	// Click delete button
	await createdPageRow2.locator('.o-svg-icon--delete').click();

	// Click delete to confirm
	await page
		.locator('.c-modal-context--visible button[class*="Button-module_c-button__"]', {
			hasText: 'Verwijder',
		})
		.click();

	// Check success toast
	await checkToastMessage(page, 'Gelukt');

	// Check the content page is no longer present in the table
	await expect(page.locator('text=' + pageTitle)).not.toBeVisible();

	// Wait for close to save the videos
	await context.close();
});
