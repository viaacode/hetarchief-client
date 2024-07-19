import { mixed, object, type Schema, string } from 'yup';

import { Operator } from '@shared/types';

import { AdvancedFilterArrayParam } from '../../const/query-params';
import { SearchFilterId } from '../../types';

import { type CreatedFilterFormState } from './CreatedFilterForm.types';

export const CREATED_FILTER_FORM_SCHEMA = (): Schema<CreatedFilterFormState> =>
	object({
		operator: mixed<Operator>().required().oneOf(Object.values(Operator)),
		created: string().optional(),
	});

export const CREATED_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[SearchFilterId.Created]: AdvancedFilterArrayParam,
};
