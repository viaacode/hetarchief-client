import type { TextLine } from '@iiif-viewer/IiifViewer.types';
import { describe, expect, it } from 'vitest';
import { filterAltoBySearchTerms } from './filter-alto-by-search-terms';

function line(text: string) {
	return { text, x: 0, y: 0, width: 10, height: 10 };
}

const ALTO_SAMPLE = [
	line('the'),
	line('quick'),
	line('brown'),
	line('fox'),
	line('jumps'),
	line('over'),
	line('the'),
	line('lazy'),
	line('dog'),
];

describe('filterAltoBySearchTerms (strict)', () => {
	it('returns [] when searchTerms is undefined', () => {
		const result = filterAltoBySearchTerms(ALTO_SAMPLE, undefined as unknown as string[]);
		expect(result).toEqual([]);
	});

	it('returns [] when altoItems is undefined', () => {
		const result = filterAltoBySearchTerms(undefined as unknown as TextLine[], ['word']);
		expect(result).toEqual([]);
	});

	it('literal single-token search returns exactly fox', () => {
		const result = filterAltoBySearchTerms(ALTO_SAMPLE, ['"fox"']);

		expect(result.length).toBe(1);
		expect(result).toEqual([
			{
				text: line('fox'),
				tabbable: true,
			},
		]);
	});

	it('non-literal search returns exactly happy and unhappy in order', () => {
		const items = [line('unhappy'), line('happy'), line('happiness')];

		const result = filterAltoBySearchTerms(items, ['happy']);

		expect(result.length).toBe(2);
		expect(result).toEqual([
			{
				text: line('unhappy'),
				tabbable: true,
			},
			{
				text: line('happy'),
				tabbable: true,
			},
		]);
	});

	it('literal phrase "hello world" returns exactly hello then world', () => {
		const items = [line('hello'), line('world'), line('other')];

		const result = filterAltoBySearchTerms(items, ['"hello world"']);

		expect(result.length).toBe(2);
		expect(result).toEqual([
			{
				text: line('hello'),
				tabbable: true,
			},
			{
				text: line('world'),
				tabbable: false,
			},
		]);
	});

	it('broken sequence returns empty array', () => {
		const items = [line('hello'), line('mars'), line('world')];

		const result = filterAltoBySearchTerms(items, ['"hello world"']);

		expect(result).toEqual([]);
	});

	it('multiple search terms return exactly alpha and gamma', () => {
		const items = [line('alpha'), line('beta'), line('gamma')];

		const result = filterAltoBySearchTerms(items, ['alpha', 'gamma']);

		expect(result.length).toBe(2);
		expect(result).toEqual([
			{
				text: line('alpha'),
				tabbable: true,
			},
			{
				text: line('gamma'),
				tabbable: true,
			},
		]);
	});

	it('duplicate search terms return exactly one repeat entry', () => {
		const items = [line('repeat')];

		const result = filterAltoBySearchTerms(items, ['repeat']);

		expect(result.length).toBe(1);

		expect(result).toEqual([
			{
				text: line('repeat'),
				tabbable: true,
			},
		]);
	});

	it('literal phrase b c produces exact tabbable structure', () => {
		const items = [line('a'), line('b'), line('c'), line('d')];

		const result = filterAltoBySearchTerms(items, ['"b c"']);

		expect(result.length).toBe(2);

		expect(result).toEqual([
			{
				text: line('b'),
				tabbable: true,
			},
			{
				text: line('c'),
				tabbable: false,
			},
		]);
	});
});
