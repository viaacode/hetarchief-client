import { IeObjectsSearchOperator } from '@shared/types/ie-objects';
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

import { SearchFilterId } from '../types';
import { migrateLegacyAdvancedFilters } from './migrate-legacy-advanced-filters';

describe('migrateLegacyAdvancedFilters()', () => {
	it('changes nothing when the old parameter is absent', () => {
		expect(migrateLegacyAdvancedFilters(undefined)).toEqual({});
		expect(migrateLegacyAdvancedFilters([])).toEqual({});
	});

	it('turns a text property into a condition of the filter that replaced it', () => {
		const changes = migrateLegacyAdvancedFilters([
			{
				renderKey: '1',
				prop: SearchFilterId.Title,
				op: IeObjectsSearchOperator.CONTAINS,
				val: 'concert',
			},
		]);

		expect(changes[SearchFilterId.Title]).toEqual([
			{ op: IeObjectsSearchOperator.CONTAINS, val: 'concert' },
		]);
		expect(changes[SearchFilterId.Advanced]).toBeUndefined();
	});

	it('keeps an operator the field still offers', () => {
		const changes = migrateLegacyAdvancedFilters([
			{
				renderKey: '1',
				prop: SearchFilterId.Title,
				op: IeObjectsSearchOperator.IS_NOT,
				val: 'herhaling',
			},
		]);

		expect(changes[SearchFilterId.Title]).toEqual([
			{ op: IeObjectsSearchOperator.IS_NOT, val: 'herhaling' },
		]);
	});

	it('collapses an operator the field does not offer onto one of the same polarity', () => {
		// "description" offers the contains pair only, so the legacy "is niet" has to land on
		// "bevat niet" rather than on an operator the field cannot send
		const changes = migrateLegacyAdvancedFilters([
			{
				renderKey: '1',
				prop: SearchFilterId.Description,
				op: IeObjectsSearchOperator.IS_NOT,
				val: 'herhaling',
			},
			{
				renderKey: '2',
				prop: SearchFilterId.Identifier,
				op: IeObjectsSearchOperator.CONTAINS,
				val: 'co15bf1dcfb943aee',
			},
		]);

		expect(changes[SearchFilterId.Description]).toEqual([
			{ op: IeObjectsSearchOperator.CONTAINS_NOT, val: 'herhaling' },
		]);
		// "identifier" offers the is pair only
		expect(changes[SearchFilterId.Identifier]).toEqual([
			{ op: IeObjectsSearchOperator.IS, val: 'co15bf1dcfb943aee' },
		]);
	});

	it('turns a multiselect property into a value list', () => {
		const changes = migrateLegacyAdvancedFilters([
			{
				renderKey: '1',
				prop: SearchFilterId.Genre,
				op: IeObjectsSearchOperator.IS,
				val: 'concert',
			},
			{ renderKey: '2', prop: SearchFilterId.Genre, op: IeObjectsSearchOperator.IS, val: 'dans' },
		]);

		expect(changes[SearchFilterId.Genre]).toEqual(['concert', 'dans']);
	});

	it('keeps a date property as it was, since that filter did not change', () => {
		const legacyFilter = {
			renderKey: '1',
			prop: SearchFilterId.Created,
			op: IeObjectsSearchOperator.GTE,
			val: '2020-01-01',
		};

		expect(migrateLegacyAdvancedFilters([legacyFilter])[SearchFilterId.Created]).toEqual([
			legacyFilter,
		]);
	});

	it('skips an entry without a value', () => {
		expect(
			migrateLegacyAdvancedFilters([
				{
					renderKey: '1',
					prop: SearchFilterId.Title,
					op: IeObjectsSearchOperator.CONTAINS,
					val: '',
				},
			])
		).toEqual({});
	});
});
