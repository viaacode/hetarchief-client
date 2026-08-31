import {
	type IeObjectsSearchFilter,
	IeObjectsSearchFilterField,
	IeObjectsSearchOperator,
} from '@shared/types/ie-objects';
import { describe, expect, it } from 'vitest';
import { dropClausesForField } from './get-filter-options';

const clause = (field: IeObjectsSearchFilterField, value: string): IeObjectsSearchFilter => ({
	field,
	operator: IeObjectsSearchOperator.IS,
	value,
});

describe('dropClausesForField()', () => {
	// Bert's example in the FA of ARC-3806: searching amsab, vrt and "1 inch open reel audio",
	// then opening the maintainer filter, must offer the maintainers of that medium.
	const query: IeObjectsSearchFilter[] = [
		clause(IeObjectsSearchFilterField.MAINTAINER_ID, 'amsab'),
		clause(IeObjectsSearchFilterField.MAINTAINER_ID, 'vrt'),
		clause(IeObjectsSearchFilterField.MEDIUM, '1 inch open reel audio'),
		clause(IeObjectsSearchFilterField.QUERY, 'kat'),
	];

	it('drops every clause on the field of the open filter', () => {
		const remaining = dropClausesForField(query, IeObjectsSearchFilterField.MAINTAINER_ID);

		expect(remaining).toHaveLength(2);
		expect(remaining.map(({ field }) => field)).toEqual([
			IeObjectsSearchFilterField.MEDIUM,
			IeObjectsSearchFilterField.QUERY,
		]);
	});

	it('keeps the maintainer clauses when the medium filter is the one that opens', () => {
		const remaining = dropClausesForField(query, IeObjectsSearchFilterField.MEDIUM);

		expect(remaining.map(({ value }) => value)).toEqual(['amsab', 'vrt', 'kat']);
	});

	it('changes nothing when the filter has no field', () => {
		expect(dropClausesForField(query, undefined)).toEqual(query);
	});
});
