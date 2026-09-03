import { Locale } from '@shared/utils/i18n';
import { describe, expect, it } from 'vitest';
import { AdvancedFilterArrayParam } from '../const/advanced-filter-array-param';
import { FilterProperty, Operator } from '../types';
import { getThemeSearchPath } from './theme-search-path';

describe('getThemeSearchPath', () => {
	it('should build a search path the search page decodes back into a theme filter', () => {
		const path = getThemeSearchPath(Locale.nl, 'wereldoorlog i');

		expect(path).toBe(`/zoeken?advanced=theq${encodeURIComponent('wereldoorlog i')}&page=1`);
		expect(
			AdvancedFilterArrayParam.decode(new URL(path, 'https://x').searchParams.get('advanced'))
		).toEqual([
			expect.objectContaining({
				prop: FilterProperty.THEME,
				op: Operator.EQUALS,
				val: 'wereldoorlog i',
			}),
		]);
	});

	it('should use the localised search route', () => {
		expect(getThemeSearchPath(Locale.en, 'wwi')).toBe('/search?advanced=theqwwi&page=1');
	});
});
