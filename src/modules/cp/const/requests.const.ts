import { TabProps } from '@meemoo/react-components';
import { i18n } from 'next-i18next';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { RequestStatus } from '@cp/types';
import { SortDirectionParam } from '@shared/helpers';

export const RequestTablePageSize = 20;

export const CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG = {
	status: withDefault(StringParam, RequestStatus.all),
	search: withDefault(StringParam, undefined),
	start: withDefault(NumberParam, 0),
	sort: withDefault(StringParam, undefined),
	order: withDefault(SortDirectionParam, undefined),
};

export const requestStatusFilters = (): TabProps[] => {
	return [
		{
			id: RequestStatus.all,
			label: i18n?.t('modules/cp/const/requests___alle'),
		},
		{
			id: RequestStatus.open,
			label: i18n?.t('modules/cp/const/requests___open'),
		},
		{
			id: RequestStatus.approved,
			label: i18n?.t('modules/cp/const/requests___goedgekeurd'),
		},
		{
			id: RequestStatus.denied,
			label: i18n?.t('modules/cp/const/requests___geweigerd'),
		},
	];
};
