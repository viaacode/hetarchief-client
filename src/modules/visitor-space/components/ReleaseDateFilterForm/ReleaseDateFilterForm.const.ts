import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { type Schema, mixed, object, string } from 'yup';
import { type FilterValue, Operator } from '../../types';

export const RELEASE_DATE_FILTER_FORM_SCHEMA = (): Schema<FilterValue> =>
	object({
		field: mixed<IeObjectsSearchFilterField>()
			.required()
			.oneOf(Object.values(IeObjectsSearchFilterField)),
		operator: mixed<Operator>().required().oneOf(Object.values(Operator)),
		val: string().optional(),
	});
