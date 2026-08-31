import { describe, expect, it } from 'vitest';
import { Operator } from '../types';
import { TextFilterArrayParam } from './text-filter-array-param';

describe('TextFilterArrayParam', () => {
	it('survives a round trip through the url', () => {
		const conditions = [
			{ op: Operator.CONTAINS, val: 'Magriet Hermans' },
			{ op: Operator.CONTAINS_NOT, val: 'Luc Appermont' },
		];

		const encoded = TextFilterArrayParam.encode(conditions);

		expect(encoded).toEqual('coMagriet%20Hermans,ncLuc%20Appermont');
		expect(TextFilterArrayParam.decode(encoded)).toEqual(conditions);
	});

	it('keeps a value that holds a comma whole', () => {
		const conditions = [{ op: Operator.CONTAINS, val: 'Olmen, Moll, Meerhout' }];

		const encoded = TextFilterArrayParam.encode(conditions);

		expect(TextFilterArrayParam.decode(encoded)).toEqual(conditions);
	});

	it('leaves out a condition without a value', () => {
		expect(
			TextFilterArrayParam.encode([
				{ op: Operator.CONTAINS, val: '' },
				{ op: Operator.CONTAINS, val: 'concert' },
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
			{ op: Operator.CONTAINS, val: 'dans' },
		]);
	});
});
