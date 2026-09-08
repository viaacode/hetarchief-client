import { IeObjectsSearchOperator } from '@shared/types/ie-objects';
import { describe, expect, it } from 'vitest';
import { TextFilterArrayParam } from './text-filter-array-param';

describe('TextFilterArrayParam', () => {
	it('survives a round trip through the url', () => {
		const conditions = [
			{ op: IeObjectsSearchOperator.CONTAINS, val: 'Magriet Hermans' },
			{ op: IeObjectsSearchOperator.CONTAINS_NOT, val: 'Luc Appermont' },
		];

		const encoded = TextFilterArrayParam.encode(conditions);

		expect(encoded).toEqual('coMagriet%20Hermans,ncLuc%20Appermont');
		expect(TextFilterArrayParam.decode(encoded)).toEqual(conditions);
	});

	it('keeps a value that holds a comma whole', () => {
		const conditions = [{ op: IeObjectsSearchOperator.CONTAINS, val: 'Olmen, Moll, Meerhout' }];

		const encoded = TextFilterArrayParam.encode(conditions);

		expect(TextFilterArrayParam.decode(encoded)).toEqual(conditions);
	});

	it('leaves out a condition without a value', () => {
		expect(
			TextFilterArrayParam.encode([
				{ op: IeObjectsSearchOperator.CONTAINS, val: '' },
				{ op: IeObjectsSearchOperator.CONTAINS, val: 'concert' },
			])
		).toEqual('coconcert');
	});

	it('gives undefined for an empty list', () => {
		expect(TextFilterArrayParam.encode([])).toBeUndefined();
		expect(TextFilterArrayParam.encode(undefined)).toBeUndefined();
		expect(TextFilterArrayParam.decode('')).toBeUndefined();
		expect(TextFilterArrayParam.decode(undefined)).toBeUndefined();
	});

	it('drops an unparseable condition rather than throwing on a hand-edited url', () => {
		expect(TextFilterArrayParam.decode('zzconcert,codans')).toEqual([
			{ op: IeObjectsSearchOperator.CONTAINS, val: 'dans' },
		]);
	});
});
