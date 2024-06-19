import { StringParam } from 'use-query-params';
import { object, type SchemaOf, string } from 'yup';

import { SearchFilterId } from '@visitor-space/types';

import { type CreatorFilterFormState } from './CreatorFilterForm.types';

export const CREATOR_FILTER_FORM_SCHEMA = (): SchemaOf<CreatorFilterFormState> =>
	object({
		creator: string().required(),
	});

export const CREATOR_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[SearchFilterId.Creator]: StringParam,
};
