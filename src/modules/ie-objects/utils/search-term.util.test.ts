import { describe, expect, it } from 'vitest';

import {
	isLiteralSearchTerm,
	normalizeText,
	parseSearchTerms,
	resolveSearchTerm,
} from './search-term.util';

describe('search-term.util', () => {
	it('isLiteralSearchTerm', () => {
		expect(isLiteralSearchTerm('"hello"')).toBe(true);
		expect(isLiteralSearchTerm('hello')).toBe(false);
		expect(isLiteralSearchTerm('"hello')).toBe(false);
		expect(isLiteralSearchTerm('hello"')).toBe(false);
	});

	it('resolveSearchTerm', () => {
		expect(resolveSearchTerm('"hello"')).toBe('hello');
		expect(resolveSearchTerm('hello')).toBe('hello');
	});

	it('normalizeText', () => {
		expect(normalizeText(null)).toBe('');
		expect(normalizeText(undefined)).toBe('');
		expect(normalizeText('')).toBe('');
		expect(normalizeText('   ')).toBe('   ');
		expect(normalizeText('HeLLo')).toBe('hello');
		expect(normalizeText('café naïve')).toBe('cafe naive');
	});

	it('parseSearchTerms', () => {
		expect(parseSearchTerms('hello world')).toEqual(['hello', 'world']);
		expect(parseSearchTerms('"aan de" stroom')).toEqual(['"aan de"', 'stroom']);
		expect(parseSearchTerms('"foo bar" "baz qux"')).toEqual(['"foo bar"', '"baz qux"']);
		expect(parseSearchTerms('"Café del Mar"')).toEqual(['"cafe del mar"']);
		expect(parseSearchTerms('"" test')).toEqual(['test']);
		expect(parseSearchTerms('"hello world')).toEqual([]);
		expect(parseSearchTerms('  foo   "bar baz"   qux ')).toEqual(['foo', '"bar baz"', 'qux']);
		expect(parseSearchTerms('   ')).toEqual([]);
		expect(parseSearchTerms('"   "')).toEqual(['"   "']);
		expect(parseSearchTerms('"saturday 4th" "" celebration d-day " " some other word')).toEqual([
			'"saturday 4th"',
			'celebration',
			'd-day',
			'" "',
			'some',
			'other',
			'word',
		]);
	});
});
