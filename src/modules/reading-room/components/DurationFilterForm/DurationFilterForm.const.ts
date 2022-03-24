import { mixed, object, SchemaOf, string } from 'yup';

import { AdvancedFilterArrayParam } from '@reading-room/const/query-params';
import { ReadingRoomFilterId } from '@reading-room/types';
import { Operator } from '@shared/types';

import { DurationFilterFormState } from './DurationFilterForm.types';

export const DURATION_FILTER_FORM_SCHEMA = (): SchemaOf<DurationFilterFormState> =>
	object({
		operator: mixed<Operator>().required().oneOf(Object.values(Operator)),
		duration: string().required(),
	});

export const DURATION_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[ReadingRoomFilterId.Duration]: AdvancedFilterArrayParam,
};
