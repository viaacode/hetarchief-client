import { IeObjectsSearchOperator } from '@shared/types/ie-objects';
import { mixed, object, type Schema, string } from 'yup';

import type { DateFilterFormState } from './DateFilterForm.types';

export const DATE_FILTER_FORM_SCHEMA = (): Schema<DateFilterFormState> =>
	object({
		operator: mixed<IeObjectsSearchOperator>()
			.required()
			.oneOf(Object.values(IeObjectsSearchOperator)),
		date: string().optional(),
	});
