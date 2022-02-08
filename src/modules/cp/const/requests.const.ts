import { TabProps } from '@meemoo/react-components';
import { i18n } from 'next-i18next';
import { NumberParam, withDefault } from 'use-query-params';

export const enum requestStatusFilterIds {
	all,
	open,
	approved,
	denied,
}

export const requestStatusFilters: TabProps[] = [
	{
		id: requestStatusFilterIds.all,
		label: i18n?.t('Alle'),
	},
	{
		id: requestStatusFilterIds.open,
		label: i18n?.t('Open'),
	},
	{
		id: requestStatusFilterIds.approved,
		label: i18n?.t('Goedgekeurd'),
	},
	{
		id: requestStatusFilterIds.denied,
		label: i18n?.t('Geweigerd'),
	},
];

export const CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG = {
	status: withDefault(NumberParam, requestStatusFilterIds.all),
};
