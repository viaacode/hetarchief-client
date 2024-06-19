import { StringParam, withDefault } from 'use-query-params';

import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { type Locale } from '@shared/utils/i18n';

import { ROUTES_BY_LOCALE } from './routes';

export const GET_TOS_INDEX_QUERY_PARAM_CONFIG = (locale: Locale) => ({
	[QUERY_PARAM_KEY.REDIRECT_TO_QUERY_KEY]: withDefault(
		StringParam,
		ROUTES_BY_LOCALE[locale].home
	),
});
