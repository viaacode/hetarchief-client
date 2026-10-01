import { IeObjectsSearchOperator } from '@shared/types/ie-objects';
import { describe, expect, it, vi } from 'vitest';

// The labels come from the translations, so the key's last segment stands in for them here
vi.mock('@shared/helpers/translate', () => ({
	tText: (key: string) => key.split('___').pop()?.replaceAll('-', ' ') || '',
	tHtml: (key: string) => key.split('___').pop()?.replaceAll('-', ' ') || '',
}));

import { SearchFilterId } from '../types';
import { getTextFilterOperatorLabel, normalizeTextFilterOperator } from './operator-labels.const';

describe('normalizeTextFilterOperator()', () => {
	it('should leave an operator the field offers untouched', () => {
		// "title" offers all four, so none of them is rewritten
		expect(normalizeTextFilterOperator(IeObjectsSearchOperator.IS, SearchFilterId.Title)).toBe(
			IeObjectsSearchOperator.IS
		);
		expect(normalizeTextFilterOperator(IeObjectsSearchOperator.IS_NOT, SearchFilterId.Title)).toBe(
			IeObjectsSearchOperator.IS_NOT
		);
		expect(
			normalizeTextFilterOperator(IeObjectsSearchOperator.CONTAINS, SearchFilterId.Title)
		).toBe(IeObjectsSearchOperator.CONTAINS);
	});

	it('should repair an operator the field does not offer, keeping its polarity', () => {
		// The url from the original report: an "identifier" carrying "co"
		expect(
			normalizeTextFilterOperator(IeObjectsSearchOperator.CONTAINS, SearchFilterId.Identifier)
		).toBe(IeObjectsSearchOperator.IS);
		expect(
			normalizeTextFilterOperator(IeObjectsSearchOperator.CONTAINS_NOT, SearchFilterId.Identifier)
		).toBe(IeObjectsSearchOperator.IS_NOT);
	});

	it('should repair the other way round for a field that only contains', () => {
		expect(
			normalizeTextFilterOperator(IeObjectsSearchOperator.IS, SearchFilterId.Description)
		).toBe(IeObjectsSearchOperator.CONTAINS);
		expect(
			normalizeTextFilterOperator(IeObjectsSearchOperator.IS_NOT, SearchFilterId.Description)
		).toBe(IeObjectsSearchOperator.CONTAINS_NOT);
	});

	it('should return the operator unchanged for a filter with no operators of its own', () => {
		expect(
			normalizeTextFilterOperator(IeObjectsSearchOperator.CONTAINS, SearchFilterId.Maintainers)
		).toBe(IeObjectsSearchOperator.CONTAINS);
	});
});

describe('getTextFilterOperatorLabel()', () => {
	it('should label an operator the way its filter config does', () => {
		expect(getTextFilterOperatorLabel(IeObjectsSearchOperator.IS, SearchFilterId.Title)).toBe('is');
		expect(
			getTextFilterOperatorLabel(IeObjectsSearchOperator.CONTAINS_NOT, SearchFilterId.Title)
		).toBe('bevat niet');
	});

	it('should return an empty label for an operator the filter does not offer', () => {
		expect(
			getTextFilterOperatorLabel(IeObjectsSearchOperator.CONTAINS, SearchFilterId.Identifier)
		).toBe('');
	});
});
