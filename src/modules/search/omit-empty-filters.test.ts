import { SearchFilterId } from '@visitor-space/types';
import { describe, expect, it } from 'vitest';
import { omitEmptyFilters } from './omit-empty-filters';

describe('omitEmptyFilters', () => {
	it('keeps only the filters that have a value', () => {
		expect(
			omitEmptyFilters({
				[SearchFilterId.Mentions]: ['Jan'],
				[SearchFilterId.MentionPerson]: ['a', 'b'],
				[SearchFilterId.MentionPlace]: [],
				[SearchFilterId.MentionOrganisation]: null,
				[SearchFilterId.Maintainer]: undefined,
			})
		).toEqual({
			[SearchFilterId.Mentions]: ['Jan'],
			[SearchFilterId.MentionPerson]: ['a', 'b'],
		});
	});

	it('keeps a non-empty string and drops an empty one', () => {
		expect(omitEmptyFilters({ a: 'x', b: '' })).toEqual({ a: 'x' });
	});

	it('drops empty and null entries inside arrays, and the key when nothing is left', () => {
		expect(omitEmptyFilters({ a: [''], b: [null], c: ['x', null, ''] })).toEqual({ c: ['x'] });
	});

	it('returns an empty object when nothing is set', () => {
		expect(omitEmptyFilters({})).toEqual({});
	});
});
