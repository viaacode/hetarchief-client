import { TabProps } from '@meemoo/react-components';
import { differenceInDays, format, formatDistanceToNow } from 'date-fns';
import { i18n } from 'next-i18next';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { SortDirectionParam } from '@shared/const';
import { getLocaleFromi18nLanguage } from '@shared/utils';

export const enum RequestStatus {
	all = 'all',
	open = 'open',
	approved = 'approved',
	denied = 'denied',
}

export interface RequestTableRow extends Object {
	id: string | number;
	name: string;
	email: string;
	status: RequestStatus;
	created_at: Date;
	reason: string;
	time: string; // free-text indication of when
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

export const requestCreatedAtFormatter = (date: Date): string => {
	const locale = getLocaleFromi18nLanguage(i18n?.language || '');

	if (differenceInDays(new Date(), date) <= 5) {
		return formatDistanceToNow(date, {
			addSuffix: true,
			locale,
		});
	}

	return format(date, 'PPpp', {
		locale,
	});
};
