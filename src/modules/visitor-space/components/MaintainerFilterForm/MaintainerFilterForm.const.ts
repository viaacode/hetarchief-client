import { ArrayParam } from 'use-query-params';
import { array, object, SchemaOf, string } from 'yup';

import { SearchFilterId } from '../../types';

import { MaintainerFilterFormState } from './MaintainerFilterForm.types';

export const MAINTAINER_FILTER_FORM_SCHEMA = (): SchemaOf<MaintainerFilterFormState> =>
	object({
		maintainers: array(string().required()),
	});

export const MAINTAINER_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[SearchFilterId.Maintainers]: ArrayParam,
};
