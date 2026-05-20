import { IeObjectsSearchFilterField, IeObjectsSearchOperator } from '@shared/types/ie-objects';
import { getAdvancedProperties, getOperators } from '@visitor-space/utils/advanced-filters';
import { describe, expect, it } from 'vitest';

import { getMetadataSearchFilters } from './advanced-filters.consts';
import { FilterProperty, Operator } from '../types';

describe('advanced filters config', () => {
	it('should expose rights as an advanced filter with is and is-not operators', () => {
		expect(getAdvancedProperties().map(({ value }) => value)).toContain(FilterProperty.RIGHTS);
		expect(getOperators(FilterProperty.RIGHTS).map(({ value }) => value)).toEqual([
			Operator.EQUALS,
			Operator.EQUALS_NOT,
		]);
		expect(getMetadataSearchFilters(FilterProperty.RIGHTS, Operator.EQUALS)).toEqual([
			{
				field: IeObjectsSearchFilterField.RIGHTS,
				operator: IeObjectsSearchOperator.IS,
			},
		]);
		expect(getMetadataSearchFilters(FilterProperty.RIGHTS, Operator.EQUALS_NOT)).toEqual([
			{
				field: IeObjectsSearchFilterField.RIGHTS,
				operator: IeObjectsSearchOperator.IS_NOT,
			},
		]);
	});
});
