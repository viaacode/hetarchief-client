import { IeObjectsSearchFilterField, IeObjectsSearchOperator } from '@shared/types/ie-objects';
import type { SearchPageQueryParams } from '@visitor-space/const';
import { RightsLabel } from '@visitor-space/const/rights-filter.const';
import {
	FILTER_LABEL_VALUE_DELIMITER,
	FilterProperty,
	Operator,
	ReusabilityFilterOption,
	SearchFilterId,
} from '@visitor-space/types';
import { describe, expect, it } from 'vitest';

import { mapFiltersToElastic } from './elastic-filters';

describe('mapFiltersToElastic()', () => {
	it('should map reusability query params to the proxy filter contract', () => {
		const filters = mapFiltersToElastic({
			[SearchFilterId.Reusability]: [
				`${ReusabilityFilterOption.FREELY_REUSABLE}${FILTER_LABEL_VALUE_DELIMITER}Vrij herbruikbaar`,
				`${ReusabilityFilterOption.REUSABLE_WITH_CONDITIONS}${FILTER_LABEL_VALUE_DELIMITER}Herbruikbaar onder voorwaarden`,
				`${ReusabilityFilterOption.POSSIBLY_REUSABLE}${FILTER_LABEL_VALUE_DELIMITER}Misschien herbruikbaar`,
			],
		} as SearchPageQueryParams);

		expect(filters.find(({ field }) => field === IeObjectsSearchFilterField.REUSABILITY)).toEqual({
			field: IeObjectsSearchFilterField.REUSABILITY,
			operator: IeObjectsSearchOperator.IS,
			multiValue: [
				ReusabilityFilterOption.FREELY_REUSABLE,
				ReusabilityFilterOption.REUSABLE_WITH_CONDITIONS,
				ReusabilityFilterOption.POSSIBLY_REUSABLE,
			],
		});
	});

	it('should map an advanced theme filter to a theme filter carrying the slug', () => {
		const filters = mapFiltersToElastic({
			[SearchFilterId.Advanced]: [
				{
					prop: FilterProperty.THEME,
					op: Operator.EQUALS,
					val: 'education-learning',
					renderKey: 'theme-filter',
				},
			],
		} as SearchPageQueryParams);

		expect(filters.find(({ field }) => field === IeObjectsSearchFilterField.THEME)).toEqual({
			field: IeObjectsSearchFilterField.THEME,
			operator: IeObjectsSearchOperator.IS,
			value: 'education-learning',
		});
	});

	it('should map advanced rights labels to the proxy rights filter contract', () => {
		const filters = mapFiltersToElastic({
			[SearchFilterId.Advanced]: [
				{
					prop: FilterProperty.RIGHTS,
					op: Operator.EQUALS,
					val: RightsLabel.IN_COPYRIGHT,
					renderKey: 'rights-filter',
				},
			],
		} as SearchPageQueryParams);

		expect(filters.find(({ field }) => field === IeObjectsSearchFilterField.RIGHTS)).toEqual({
			field: IeObjectsSearchFilterField.RIGHTS,
			operator: IeObjectsSearchOperator.IS,
			value: RightsLabel.IN_COPYRIGHT,
		});
	});

	// The multiselect and text filters of ARC-3806
	it('sends every value of one multiselect filter as one multiValue clause', () => {
		const filters = mapFiltersToElastic({
			[SearchFilterId.Creator]: ['VRT', 'Amsab-ISG'],
		} as SearchPageQueryParams);

		expect(filters.find(({ field }) => field === IeObjectsSearchFilterField.CREATOR)).toEqual({
			field: IeObjectsSearchFilterField.CREATOR,
			operator: IeObjectsSearchOperator.IS,
			multiValue: ['VRT', 'Amsab-ISG'],
		});
	});

	it('strips the label half of a value that carries its own label', () => {
		const filters = mapFiltersToElastic({
			[SearchFilterId.Maintainers]: [
				`OR-1${FILTER_LABEL_VALUE_DELIMITER}VRT`,
				`OR-2${FILTER_LABEL_VALUE_DELIMITER}Amsab-ISG`,
			],
		} as SearchPageQueryParams);

		expect(
			filters.find(({ field }) => field === IeObjectsSearchFilterField.MAINTAINER_ID)?.multiValue
		).toEqual(['OR-1', 'OR-2']);
	});

	it('sends one clause per text filter condition, with its own operator', () => {
		const filters = mapFiltersToElastic({
			[SearchFilterId.Title]: [
				{ op: Operator.CONTAINS, val: 'concert' },
				{ op: Operator.CONTAINS_NOT, val: 'herhaling' },
			],
		} as SearchPageQueryParams);

		expect(filters.filter(({ field }) => field === IeObjectsSearchFilterField.NAME)).toEqual([
			{
				field: IeObjectsSearchFilterField.NAME,
				operator: IeObjectsSearchOperator.CONTAINS,
				value: 'concert',
			},
			{
				field: IeObjectsSearchFilterField.NAME,
				operator: IeObjectsSearchOperator.CONTAINS_NOT,
				value: 'herhaling',
			},
		]);
	});

	it('keeps the two filters of the FA example apart, so the proxy can and them', () => {
		const filters = mapFiltersToElastic({
			[SearchFilterId.NewspaperSeriesName]: ['Reeks A', 'Reeks B'],
			[SearchFilterId.Maintainers]: ['OR-1', 'OR-2'],
		} as SearchPageQueryParams);

		expect(
			filters.find(({ field }) => field === IeObjectsSearchFilterField.NEWSPAPER_SERIES_NAME)
				?.multiValue
		).toEqual(['Reeks A', 'Reeks B']);
		expect(
			filters.find(({ field }) => field === IeObjectsSearchFilterField.MAINTAINER_ID)?.multiValue
		).toEqual(['OR-1', 'OR-2']);
	});

	it('sends no clause for a filter without a value', () => {
		expect(mapFiltersToElastic({} as SearchPageQueryParams)).toEqual([]);
	});
});
