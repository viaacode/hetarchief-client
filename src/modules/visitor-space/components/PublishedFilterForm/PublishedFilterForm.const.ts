import { mixed, object, SchemaOf, string } from 'yup';

import { Operator } from '@shared/types';

import { AdvancedFilterArrayParam } from '../../const/query-params';
import { VisitorSpaceFilterId } from '../../types';

import { PublishedFilterFormState } from './PublishedFilterForm.types';

export const PUBLISHED_FILTER_FORM_SCHEMA = (): SchemaOf<PublishedFilterFormState> =>
	object({
		operator: mixed<Operator>().required().oneOf(Object.values(Operator)),
		published: string().optional(),
	});

export const PUBLISHED_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[VisitorSpaceFilterId.Published]: AdvancedFilterArrayParam,
};
