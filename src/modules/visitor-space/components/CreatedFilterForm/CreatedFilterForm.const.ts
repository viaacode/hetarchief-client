import { mixed, object, SchemaOf, string } from 'yup';

import { Operator } from '@shared/types';

import { AdvancedFilterArrayParam } from '../../const/query-params';
import { VisitorSpaceFilterId } from '../../types';

import { CreatedFilterFormState } from './CreatedFilterForm.types';

export const CREATED_FILTER_FORM_SCHEMA = (): SchemaOf<CreatedFilterFormState> =>
	object({
		operator: mixed<Operator>().required().oneOf(Object.values(Operator)),
		created: string().optional(),
	});

export const CREATED_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[VisitorSpaceFilterId.Created]: AdvancedFilterArrayParam,
};
