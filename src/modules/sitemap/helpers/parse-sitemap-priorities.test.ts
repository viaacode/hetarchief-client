import { parseSitemapPriorities, stringifySitemapPriorities } from './parse-sitemap-priorities';
import {
	INVALID_SITEMAP_PRIORITIES,
	INVALID_SITEMAP_PRIORITIES_STRING,
	VALID_SITEMAP_PRIORITIES,
	VALID_SITEMAP_PRIORITIES_STRING,
	VALID_SITEMAP_PRIORITIES_STRING_FUZZY,
} from './parse-sitemap-priorities.mocks';

describe('Sitemap priorities', () => {
	describe('parse sitemap priorities', () => {
		it('should parse valid priorities string', () => {
			expect(parseSitemapPriorities(VALID_SITEMAP_PRIORITIES_STRING)).toEqual({
				status: 'success',
				error: null,
				sitemapPriorities: VALID_SITEMAP_PRIORITIES,
			});
		});

		it('should parse valid priorities string with extra spaces, tabs, new lines', () => {
			expect(parseSitemapPriorities(VALID_SITEMAP_PRIORITIES_STRING_FUZZY)).toEqual({
				status: 'success',
				error: null,
				sitemapPriorities: VALID_SITEMAP_PRIORITIES,
			});
		});

		it('should show which line has an error', () => {
			expect(parseSitemapPriorities(INVALID_SITEMAP_PRIORITIES_STRING)).toEqual({
				status: 'error',
				error: 'Error op regel 2\nError op regel 4',
				sitemapPriorities: INVALID_SITEMAP_PRIORITIES,
			});
		});
	});

	describe('stringify sitemap priorities', () => {
		it('should stringify valid priorities', () => {
			expect(stringifySitemapPriorities(VALID_SITEMAP_PRIORITIES)).toEqual(
				VALID_SITEMAP_PRIORITIES_STRING
			);
		});
	});
});
