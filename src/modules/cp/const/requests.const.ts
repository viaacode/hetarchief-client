import { TabProps } from '@meemoo/react-components';
import { i18n } from 'next-i18next';
import { StringParam, withDefault } from 'use-query-params';

export const enum RequestStatus {
	all = 'all',
	open = 'open',
	approved = 'approved',
	denied = 'denied',
}

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

export const CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG = {
	status: withDefault(StringParam, RequestStatus.all),
	search: withDefault(StringParam, undefined),
};

export interface RequestTableRow extends Object {
	name: string;
	email: string;
	status: RequestStatus;
	created_at: Date;
}
