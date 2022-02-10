import { TabProps } from '@meemoo/react-components';
import { i18n } from 'next-i18next';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { SortDirectionParam } from '@shared/const';

export const enum RequestStatus {
	all = 'all',
	open = 'open',
	approved = 'approved',
	denied = 'denied',
}

export interface RequestTableRow extends Object {
	name: string;
	email: string;
	status: RequestStatus;
	created_at: Date;
}

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
