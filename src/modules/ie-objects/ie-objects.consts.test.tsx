import { ObjectDetailTabs } from '@ie-objects/ie-objects.types';
import { HetArchiefIeObjectType } from '@viaa/avo2-types';
import { describe, expect, it, vi } from 'vitest';

// Echo the key and variables back to assert on which label is picked
vi.mock('@shared/helpers/translate', () => ({
	tText: (key: string, vars?: Record<string, unknown>) =>
		vars ? `${key}:${JSON.stringify(vars)}` : key,
}));

import { OBJECT_DETAIL_TABS } from './ie-objects.consts';

const getTabIds = (relatedCount?: number) =>
	OBJECT_DETAIL_TABS(HetArchiefIeObjectType.VIDEO, undefined, true, true, relatedCount).map(
		(tab) => tab.id
	);

describe('OBJECT_DETAIL_TABS', () => {
	it('puts the ocr tab last, after the related tab', () => {
		expect(getTabIds(2)).toEqual([
			ObjectDetailTabs.Media,
			ObjectDetailTabs.Overview,
			ObjectDetailTabs.Metadata,
			ObjectDetailTabs.Related,
			ObjectDetailTabs.Ocr,
		]);
	});

	it('keeps the ocr tab last without related objects too', () => {
		expect(getTabIds().at(-1)).toBe(ObjectDetailTabs.Ocr);
	});

	it('omits the ocr tab when there is no ocr', () => {
		const tabIds = OBJECT_DETAIL_TABS(HetArchiefIeObjectType.VIDEO, undefined, true, false, 2).map(
			(tab) => tab.id
		);

		expect(tabIds).not.toContain(ObjectDetailTabs.Ocr);
		expect(tabIds.at(-1)).toBe(ObjectDetailTabs.Related);
	});

	it('omits the related tab without related objects', () => {
		expect(getTabIds()).not.toContain(ObjectDetailTabs.Related);
		expect(getTabIds(0)).not.toContain(ObjectDetailTabs.Related);
	});

	it('shows the related tab with the amount in its label', () => {
		const tabs = OBJECT_DETAIL_TABS(
			HetArchiefIeObjectType.VIDEO,
			ObjectDetailTabs.Related,
			true,
			true,
			3
		);
		const related = tabs.find((tab) => tab.id === ObjectDetailTabs.Related);

		expect(related?.label).toBe('modules/ie-objects/const/index___amount-gerelateerd:{"amount":3}');
		expect(related?.active).toBe(true);
	});
});
