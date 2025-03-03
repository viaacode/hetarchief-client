import { type Schema, array, object, string } from 'yup';

import { type FilterValue, Operator, SearchFilterId } from '../../types';

export const initialFilterValue = (operator?: Operator): FilterValue => ({
	prop: SearchFilterId.Query,
	op: operator || Operator.CONTAINS,
	val: '',
});

export const initialFilterMultiValue = (operator?: Operator): FilterValue => ({
	prop: SearchFilterId.Query,
	op: operator || Operator.CONTAINS,
	multiValue: [],
});

export const ADVANCED_FILTERS_FORM_SCHEMA = (): Schema<FilterValue[]> =>
	array(FILTER_FORM_SCHEMA()).required();

export const FILTER_FORM_SCHEMA = (): Schema<FilterValue> =>
	object({
		prop: string().oneOf(Object.values(SearchFilterId)),
		op: string().oneOf(Object.values(Operator)),
		val: string(),
		multiValue: array(string().required()),
	}).required();
