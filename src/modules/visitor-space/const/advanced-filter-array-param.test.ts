import { describe, expect, it } from 'vitest';

import { AdvancedFilterArrayParam } from './advanced-filter-array-param';
import { RightsLabel } from './rights-filter.const';
import { FilterProperty, Operator } from '../types';

describe('AdvancedFilterArrayParam', () => {
	it('should encode and decode rights filters', () => {
		const encoded = AdvancedFilterArrayParam.encode([
			{
				prop: FilterProperty.RIGHTS,
				op: Operator.EQUALS,
				val: RightsLabel.IN_COPYRIGHT,
				renderKey: 'rights-filter',
			},
		]);

		expect(encoded).toBe('rieqin-copyright');
		expect(AdvancedFilterArrayParam.decode(encoded)).toEqual([
			expect.objectContaining({
				prop: FilterProperty.RIGHTS,
				op: Operator.EQUALS,
				val: RightsLabel.IN_COPYRIGHT,
			}),
		]);
	});
});
