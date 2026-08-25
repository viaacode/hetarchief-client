import { describe, expect, it } from 'vitest';
import { FilterProperty, Operator } from '../types';
import { AdvancedFilterArrayParam } from './advanced-filter-array-param';
import { RightsLabel } from './rights-filter.const';

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

		expect(encoded).toBe(`rieq${encodeURIComponent('https://rightsstatements.org/page/InC/1.0/')}`);
		expect(AdvancedFilterArrayParam.decode(encoded)).toEqual([
			expect.objectContaining({
				prop: FilterProperty.RIGHTS,
				op: Operator.EQUALS,
				val: RightsLabel.IN_COPYRIGHT,
			}),
		]);
	});

	it('should encode and decode theme filters using the theme slug', () => {
		const encoded = AdvancedFilterArrayParam.encode([
			{
				prop: FilterProperty.THEME,
				op: Operator.EQUALS,
				val: 'education-learning',
				renderKey: 'theme-filter',
			},
		]);

		expect(encoded).toBe('theqeducation-learning');
		expect(AdvancedFilterArrayParam.decode(encoded)).toEqual([
			expect.objectContaining({
				prop: FilterProperty.THEME,
				op: Operator.EQUALS,
				val: 'education-learning',
			}),
		]);
	});
});
