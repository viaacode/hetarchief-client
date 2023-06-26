import { StringParam } from 'use-query-params';
import { object, SchemaOf, string } from 'yup';

import { VisitorSpaceFilterId } from '@visitor-space/types';

import { CreatorFilterFormState } from './CreatorFilterForm.types';

export const CREATOR_FILTER_FORM_SCHEMA = (): SchemaOf<CreatorFilterFormState> =>
	object({
		creator: string().required(),
	});

export const CREATOR_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[VisitorSpaceFilterId.Creator]: StringParam,
};
