import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { type Schema, mixed, object, string } from 'yup';
import { type FilterValue, Operator } from '../../types';

export const RELEASE_DATE_FILTER_FORM_SCHEMA = (): Schema<FilterValue> =>
	object({
		prop: mixed<IeObjectsSearchFilterField>()
			.required()
			.oneOf(Object.values(IeObjectsSearchFilterField)),
		op: mixed<Operator>().required().oneOf(Object.values(Operator)),
		val: string().optional(),
	});
