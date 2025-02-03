import { expect, type Page } from '@playwright/test';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';

import { getSiteTranslations } from './get-site-translations';

async function checkTotal(page: Page, total: number): Promise<void> {
	const SITE_TRANSLATIONS = await getSiteTranslations();
	const paginationLabelBetween =
		SITE_TRANSLATIONS.nl[
			'modules/shared/components/filter-table/filter-table___label-between-start-and-end-page-in-pagination-bar'
		];
	const paginationLabelOf =
		SITE_TRANSLATIONS.nl[
			'modules/shared/components/filter-table/filter-table___label-between-end-page-and-total-in-pagination-bar'
		];

	const paginationProgress = page.locator('.c-pagination-progress');
	if (total) {
		await expect(paginationProgress).toContainText(
			`1${paginationLabelBetween}${total}${paginationLabelOf}${total}`
		);
	} else {
		// If there are no entries, no table is shown and no footer with the total is present
		await expect(paginationProgress).not.toBeVisible();
	}
}

export async function checkVisitRequestStatuses(page: Page): Promise<{
	numberOfPending: number;
	numberOfApproved: number;
	numberOfDenied: number;
	totalNumberOfRequests: number;
}> {
	const SITE_TRANSLATIONS = await getSiteTranslations();

	// Check number of pending on the "all" tab
	const numberOfPending = await page
		.locator(moduleClassSelector('c-request-status-badge'), {
			hasText:
				SITE_TRANSLATIONS.nl[
					'modules/cp/components/request-status-chip/request-status-chip___open-aanvraag'
				],
		})
		.count();

	// Check number of approved on the "all" tab
	const numberOfApproved = await page.locator('.c-badge--success').count();

	// Check number of denied on the "all" tab
	const numberOfDenied = await page.locator('.c-badge--error').count();

	// Check the total number of visit requests on the "all" tab
	const totalNumberOfRequests = await page
		.locator(`${moduleClassSelector('l-sidebar__main')} .c-table__wrapper--body .c-table__row`)
		.count();

	// Check total number of requests
	await checkTotal(page, totalNumberOfRequests);

	// Check pending count
	const openLabel = SITE_TRANSLATIONS.nl['modules/cp/const/requests___open'];
	const approvedLabel = SITE_TRANSLATIONS.nl['modules/cp/const/requests___goedgekeurd'];
	const deniedLabel = SITE_TRANSLATIONS.nl['modules/cp/const/requests___geweigerd'];
	const allLabel = SITE_TRANSLATIONS.nl['modules/cp/const/requests___alle'];
	await page
		.locator('.c-tab__label', {
			hasText: openLabel,
		})
		.click();
	await checkTotal(page, numberOfPending);

	// Check approved count
	await page
		.locator('.c-tab__label', {
			hasText: approvedLabel,
		})
		.click();
	await checkTotal(page, numberOfApproved);

	// Check denied count
	await page.locator('.c-tab__label', { hasText: deniedLabel }).click();
	await checkTotal(page, numberOfDenied);

	// Go back to the "All" tab
	await page.locator('.c-tab__label', { hasText: allLabel }).click();

	return {
		numberOfPending,
		numberOfApproved,
		numberOfDenied,
		totalNumberOfRequests,
	};
}
