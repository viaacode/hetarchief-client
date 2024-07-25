import { mixed, object, type Schema, string } from 'yup';

import { Operator } from '@shared/types';

import { AdvancedFilterArrayParam } from '../../const/query-params';
import { SearchFilterId } from '../../types';

import { type PublishedFilterFormState } from './PublishedFilterForm.types';

export const PUBLISHED_FILTER_FORM_SCHEMA = (): Schema<PublishedFilterFormState> =>
	object({
		operator: mixed<Operator>().required().oneOf(Object.values(Operator)),
		published: string().optional(),
	});

export const PUBLISHED_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[SearchFilterId.Published]: AdvancedFilterArrayParam,
};
