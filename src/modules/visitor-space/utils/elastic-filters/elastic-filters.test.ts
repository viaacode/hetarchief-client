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
});
