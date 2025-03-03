import { type Schema, array, object, string } from 'yup';

import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { type FilterValue, Operator } from '../../types';

export const initialFilterValue = (operator?: Operator): FilterValue => ({
	field: IeObjectsSearchFilterField.QUERY,
	operator: operator || Operator.IS,
	val: '',
});

export const initialFilterMultiValue = (operator?: Operator): FilterValue => ({
	field: IeObjectsSearchFilterField.QUERY,
	operator: operator || Operator.IS,
	multiValue: [],
});

export const ADVANCED_FILTERS_FORM_SCHEMA = (): Schema<FilterValue[]> =>
	array(FILTER_FORM_SCHEMA()).required();

export const FILTER_FORM_SCHEMA = (): Schema<FilterValue> =>
	object({
		prop: string().oneOf(Object.values(IeObjectsSearchFilterField)),
		op: string().oneOf(Object.values(Operator)),
		val: string(),
		multiValue: array(string().required()),
	}).required();
