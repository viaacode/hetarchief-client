import { BooleanParam, StringParam, withDefault } from 'use-query-params';

export const HOME_QUERY_PARAM_CONFIG = {
	search: StringParam,
	showAuthModal: withDefault(BooleanParam, false),
};
