import { mixed, object, type Schema, string } from 'yup';

import { Operator } from '@shared/types';

import { AdvancedFilterArrayParam } from '../../const/query-params';
import { SearchFilterId } from '../../types';

import { type ReleaseDateFilterFormState } from './ReleaseDateFilterForm.types';

export const RELEASE_DATE_FILTER_FORM_SCHEMA = (): Schema<ReleaseDateFilterFormState> =>
	object({
		operator: mixed<Operator>().required().oneOf(Object.values(Operator)),
		releaseDate: string().optional(),
	});

export const RELEASE_DATE_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[SearchFilterId.ReleaseDate]: AdvancedFilterArrayParam,
};
