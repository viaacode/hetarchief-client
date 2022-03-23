import { ArrayParam } from 'use-query-params';
import { array, object, SchemaOf, string } from 'yup';

import { ReadingRoomFilterId } from '@reading-room/types';

import { MediumFilterFormState } from './MediumFilterForm.types';

export const MEDIUM_FILTER_FORM_SCHEMA = (): SchemaOf<MediumFilterFormState> =>
	object({
		mediums: array(string().required()),
	});

export const MEDIUM_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[ReadingRoomFilterId.Medium]: ArrayParam,
};
