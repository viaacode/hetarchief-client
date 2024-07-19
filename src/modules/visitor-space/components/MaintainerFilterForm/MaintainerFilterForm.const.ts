import { ArrayParam } from 'use-query-params';
import { array, object, type Schema, string } from 'yup';

import { SearchFilterId } from '../../types';

import { type MaintainerFilterFormState } from './MaintainerFilterForm.types';

export const MAINTAINER_FILTER_FORM_SCHEMA = (): Schema<MaintainerFilterFormState> =>
	object({
		maintainers: array(string().required()).required(),
	});

export const MAINTAINER_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[SearchFilterId.Maintainers]: ArrayParam,
};
