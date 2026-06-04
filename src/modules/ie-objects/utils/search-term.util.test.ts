import { describe, expect, it } from 'vitest';

import {
	isLiteralSearchTerm,
	normalizeText,
	resolveSearchTerm,
	stringifySearchTerms,
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
		expect(normalizeText('HeLLo')).toBe('hello');
		expect(normalizeText('café naïve')).toBe('cafe naive');
	});

	it('stringifySearchTerms', () => {
		expect(stringifySearchTerms('hello world')).toEqual(['hello', 'world']);
		expect(stringifySearchTerms('"aan de" stroom')).toEqual(['"aan de"', 'stroom']);
		expect(stringifySearchTerms('"foo bar" "baz qux"')).toEqual(['"foo bar"', '"baz qux"']);
		expect(stringifySearchTerms('"Café del Mar"')).toEqual(['"cafe del mar"']);
		expect(stringifySearchTerms('"" test')).toEqual(['test']);
		expect(stringifySearchTerms('"hello world')).toEqual([]);
		expect(stringifySearchTerms('  foo   "bar baz"   qux ')).toEqual(['foo', '"bar baz"', 'qux']);
		expect(stringifySearchTerms('   ')).toEqual([]);
		expect(stringifySearchTerms('"   "')).toEqual(['"   "']);
	});
});
