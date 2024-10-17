import { expect } from '@playwright/test';

import { type SearchTabCounts } from './get-search-tab-bar-counts';

export function compareSearchTabCountsLessThen(
	countsBeforeSearch: SearchTabCounts,
	countsAfterSearch: SearchTabCounts
): void {
	if (countsBeforeSearch.all > 0) {
		// Only check counts if there are at least a few items
		expect(countsBeforeSearch.all).toBeGreaterThan(countsAfterSearch.all);
		expect(countsBeforeSearch.video).toBeGreaterThanOrEqual(countsAfterSearch.video);
		expect(countsBeforeSearch.audio).toBeGreaterThanOrEqual(countsAfterSearch.audio);
		expect(countsBeforeSearch.newspaper).toBeGreaterThanOrEqual(countsAfterSearch.newspaper);
	}
}
