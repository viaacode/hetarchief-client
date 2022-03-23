import { ArrayParam } from 'use-query-params';
import { array, object, SchemaOf, string } from 'yup';

import { ReadingRoomFilterId } from '@reading-room/types';

import { CreatorFilterFormState } from './CreatorFilterForm.types';

export const CREATOR_FILTER_FORM_SCHEMA = (): SchemaOf<CreatorFilterFormState> =>
	object({
		creators: array(string().required()),
	});

export const CREATOR_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[ReadingRoomFilterId.Creator]: ArrayParam,
};
