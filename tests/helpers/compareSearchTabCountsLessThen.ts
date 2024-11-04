import { expect } from '@playwright/test';

import { type SearchTabCounts } from './get-search-tab-bar-counts';

export function compareSearchTabCountsLessThen(
	countsBeforeSearch: SearchTabCounts,
	countsAfterSearch: SearchTabCounts
): void {
	if (countsBeforeSearch.all > 0) {
		// Only check counts if there are at least a few items

		// The all count should always be lower, but VRT visitor space only contains one item, so for now we only check the greater or equals
		expect(countsBeforeSearch.all).toBeGreaterThanOrEqual(countsAfterSearch.all);
		expect(countsBeforeSearch.video).toBeGreaterThanOrEqual(countsAfterSearch.video);
		expect(countsBeforeSearch.audio).toBeGreaterThanOrEqual(countsAfterSearch.audio);
		expect(countsBeforeSearch.newspaper).toBeGreaterThanOrEqual(countsAfterSearch.newspaper);
	}
}
