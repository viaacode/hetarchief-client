import { BooleanParam } from 'use-query-params';
import { boolean, object, SchemaOf } from 'yup';

import { VisitorSpaceFilterId } from '../../types';

import { RemoteFilterFormState } from './RemoteFilterForm.types';

export const REMOTE_FILTER_FORM_SCHEMA = (): SchemaOf<RemoteFilterFormState> =>
	object({
		isConsultableRemote: boolean().required(),
	});

export const REMOTE_FILTER_FORM_QUERY_PARAM_CONFIG = {
	[VisitorSpaceFilterId.Remote]: BooleanParam,
};
