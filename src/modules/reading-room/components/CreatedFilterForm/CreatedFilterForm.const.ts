import { mixed, object, SchemaOf, string } from 'yup';

import { AdvancedFilterArrayParam } from '@reading-room/const/query-params';
import { ReadingRoomFilterId } from '@reading-room/types';
import { Operator } from '@shared/types';

import { CreatedFilterFormState } from './CreatedFilterForm.types';

export const CREATED_FILTER_FORM_SCHEMA = (): SchemaOf<CreatedFilterFormState> =>
	object({
		operator: mixed<Operator>().required().oneOf(Object.values(Operator)),
		created: string().required(),
	});

export const CREATED_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[ReadingRoomFilterId.Created]: AdvancedFilterArrayParam,
};
