import { BooleanParam, StringParam, withDefault } from 'use-query-params';

export const HOME_QUERY_PARAM_CONFIG = {
	returnToRequestAccess: BooleanParam,
	search: StringParam,
	showAuthModal: withDefault(BooleanParam, false),
};
