import { mixed, object, type Schema, string } from 'yup';

import { AdvancedFilterArrayParam } from '../../const/advanced-filter-array-param';
import { Operator, SearchFilterId } from '../../types';

import type { ReleaseDateFilterFormState } from './ReleaseDateFilterForm.types';

export const RELEASE_DATE_FILTER_FORM_SCHEMA = (): Schema<ReleaseDateFilterFormState> =>
	object({
		operator: mixed<Operator>().required().oneOf(Object.values(Operator)),
		releaseDate: string().optional(),
	});

export const RELEASE_DATE_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[SearchFilterId.ReleaseDate]: AdvancedFilterArrayParam,
};
