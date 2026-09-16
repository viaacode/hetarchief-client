import { Locale } from '@shared/utils/i18n';
import { ArrayParam } from 'use-query-params';
import { describe, expect, it } from 'vitest';
import { getThemeSearchPath } from './theme-search-path';

describe('getThemeSearchPath', () => {
	it('should build a search path the search page decodes back into a theme filter', () => {
		const path = getThemeSearchPath(Locale.nl, 'wereldoorlog i');

		expect(path).toBe(`/zoeken?page=1&theme=${encodeURIComponent('wereldoorlog i')}`);
		expect(ArrayParam.decode(new URL(path, 'https://x').searchParams.get('theme'))).toEqual([
			'wereldoorlog i',
		]);
	});

	it('should use the localised search route', () => {
		expect(getThemeSearchPath(Locale.en, 'wwi')).toBe('/search?page=1&theme=wwi');
	});
});
