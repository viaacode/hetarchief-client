import { TabProps } from '@meemoo/react-components';
import { i18n } from 'next-i18next';
import { StringParam, withDefault } from 'use-query-params';

export const enum RequestStatusFilterIds {
	all = 'all',
	open = 'open',
	approved = 'approved',
	denied = 'denied',
}

export const requestStatusFilters = (): TabProps[] => {
	return [
		{
			id: RequestStatusFilterIds.all,
			label: i18n?.t('Alle'),
		},
		{
			id: RequestStatusFilterIds.open,
			label: i18n?.t('Open'),
		},
		{
			id: RequestStatusFilterIds.approved,
			label: i18n?.t('Goedgekeurd'),
		},
		{
			id: RequestStatusFilterIds.denied,
			label: i18n?.t('Geweigerd'),
		},
	];
};

export const CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG = {
	status: withDefault(StringParam, RequestStatusFilterIds.all),
};
