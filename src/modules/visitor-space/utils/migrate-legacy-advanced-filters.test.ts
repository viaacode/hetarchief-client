import { describe, expect, it, vi } from 'vitest';

vi.mock('@visitor-space/components/ConsultableMediaFilterForm/ConsultableMediaFilterForm', () => ({
	ConsultableMediaFilterForm: () => null,
}));
vi.mock(
	'@visitor-space/components/ConsultableOnlyOnLocationFilterForm/ConsultableOnlyOnLocationFilterForm',
	() => ({
		ConsultableOnlyOnLocationFilterForm: () => null,
	})
);
vi.mock('@visitor-space/components/ReleaseDateFilterForm', () => ({
	ReleaseDateFilterForm: () => null,
}));
vi.mock('@visitor-space/components/SinglePropertyFilterForm/SinglePropertyFilterForm', () => ({
	SinglePropertyFilterForm: () => null,
}));
vi.mock('@shared/config/public-runtime-config', () => ({
	default: () => ({
		publicRuntimeConfig: { ENABLE_RIGHTS_FILTERS_FOR_EVERYBODY: 'true' },
	}),
}));

import { FilterProperty, Operator, SearchFilterId } from '../types';
import { migrateLegacyAdvancedFilters } from './migrate-legacy-advanced-filters';

describe('migrateLegacyAdvancedFilters()', () => {
	it('changes nothing when the old parameter is absent', () => {
		expect(migrateLegacyAdvancedFilters(undefined)).toEqual({});
		expect(migrateLegacyAdvancedFilters([])).toEqual({});
	});

	it('turns a text property into a condition of the filter that replaced it', () => {
		const changes = migrateLegacyAdvancedFilters([
			{ renderKey: '1', prop: FilterProperty.TITLE, op: Operator.CONTAINS, val: 'concert' },
		]);

		expect(changes[SearchFilterId.Title]).toEqual([{ op: Operator.CONTAINS, val: 'concert' }]);
		expect(changes[SearchFilterId.Advanced]).toBeUndefined();
	});

	it('collapses "is niet" into "bevat niet", the only negative a text filter has', () => {
		const changes = migrateLegacyAdvancedFilters([
			{ renderKey: '1', prop: FilterProperty.TITLE, op: Operator.EQUALS_NOT, val: 'herhaling' },
		]);

		expect(changes[SearchFilterId.Title]).toEqual([
			{ op: Operator.CONTAINS_NOT, val: 'herhaling' },
		]);
	});

	it('turns a multiselect property into a value list', () => {
		const changes = migrateLegacyAdvancedFilters([
			{ renderKey: '1', prop: FilterProperty.GENRE, op: Operator.EQUALS, val: 'concert' },
			{ renderKey: '2', prop: FilterProperty.GENRE, op: Operator.EQUALS, val: 'dans' },
		]);

		expect(changes[SearchFilterId.Genre]).toEqual(['concert', 'dans']);
	});

	it('keeps a date property as it was, since that filter did not change', () => {
		const legacyFilter = {
			renderKey: '1',
			prop: FilterProperty.CREATED_AT,
			op: Operator.GREATER_THAN_OR_EQUAL,
			val: '2020-01-01',
		};

		expect(migrateLegacyAdvancedFilters([legacyFilter])[SearchFilterId.Created]).toEqual([
			legacyFilter,
		]);
	});

	it('skips an entry without a value', () => {
		expect(
			migrateLegacyAdvancedFilters([
				{ renderKey: '1', prop: FilterProperty.TITLE, op: Operator.CONTAINS, val: '' },
			])
		).toEqual({});
	});
});
