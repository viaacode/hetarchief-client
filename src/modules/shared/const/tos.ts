import { StringParam, withDefault } from 'use-query-params';

import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';

import { ROUTES } from './routes';

export const TOS_INDEX_QUERY_PARAM_CONFIG = {
	[QUERY_PARAM_KEY.REDIRECT_TO_QUERY_KEY]: withDefault(StringParam, ROUTES.home),
};
