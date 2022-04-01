import { mixed, object, SchemaOf, string } from 'yup';

import { AdvancedFilterArrayParam } from '@reading-room/const/query-params';
import { ReadingRoomFilterId } from '@reading-room/types';
import { Operator } from '@shared/types';

import { PublishedFilterFormState } from './PublishedFilterForm.types';

export const PUBLISHED_FILTER_FORM_SCHEMA = (): SchemaOf<PublishedFilterFormState> =>
	object({
		operator: mixed<Operator>().required().oneOf(Object.values(Operator)),
		published: string().required(),
	});

export const PUBLISHED_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[ReadingRoomFilterId.Published]: AdvancedFilterArrayParam,
};
