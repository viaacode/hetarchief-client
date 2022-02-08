import { TabProps } from '@meemoo/react-components';
import { i18n } from 'next-i18next';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

export const enum requestStatusFilterIds {
	all,
	open,
	approved,
	denied,
}

export const requestStatusFilters: TabProps[] = [
	{
		id: requestStatusFilterIds.all,
		label: i18n?.t('modules/cp/const/requests___alle'),
	},
	{
		id: requestStatusFilterIds.open,
		label: i18n?.t('modules/cp/const/requests___open'),
	},
	{
		id: requestStatusFilterIds.approved,
		label: i18n?.t('modules/cp/const/requests___goedgekeurd'),
	},
	{
		id: requestStatusFilterIds.denied,
		label: i18n?.t('modules/cp/const/requests___geweigerd'),
	},
];

export const CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG = {
	search: withDefault(StringParam, undefined),
	status: withDefault(NumberParam, requestStatusFilterIds.all),
};
