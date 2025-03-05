import { type Schema, array, object, string } from 'yup';

import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { type FilterValue, Operator } from '../../types';

export const initialFilterValue = (operator?: Operator): FilterValue => ({
	field: IeObjectsSearchFilterField.QUERY,
	operator: operator || Operator.IS,
	multiValue: [''],
});

export const initialFilterValues = (
	field: IeObjectsSearchFilterField,
	initialValues?: FilterValue[],
	initialValuesFromQueryParams?: FilterValue[],
	operator?: Operator
): FilterValue[] => {
	if (initialValues?.length) {
		return initialValues;
	}
	if (initialValuesFromQueryParams?.length) {
		return initialValuesFromQueryParams;
	}
	return [
		{
			field: field,
			operator: operator || Operator.IS,
			multiValue: [],
		},
	];
};

export const FILTER_FORM_SCHEMA = (): Schema<FilterValue> =>
	object({
		field: string().oneOf(Object.values(IeObjectsSearchFilterField)).required(),
		operator: string().oneOf(Object.values(Operator)).required(),
		multiValue: array(string().required()).required(),
	}).required();
