import { TabProps } from '@meemoo/react-components';
import { differenceInDays, format, formatDistanceToNow } from 'date-fns';
import { i18n } from 'next-i18next';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { SortDirectionParam } from '@shared/const';
import { getLocaleFromi18nLanguage } from '@shared/utils';
import { VisitStatus } from '@visits/types';

export enum RequestStatusAll {
	ALL = 'ALL',
}

export type RequestStatus = VisitStatus & RequestStatusAll;

export const RequestTablePageSize = 20;

export const CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG = {
	status: withDefault(StringParam, RequestStatusAll.ALL),
	search: withDefault(StringParam, undefined),
	page: withDefault(NumberParam, 0),
	sort: withDefault(StringParam, undefined),
	order: withDefault(SortDirectionParam, undefined),
};

export const requestStatusFilters = (): TabProps[] => {
	return [
		{
			id: RequestStatusAll.ALL,
			label: i18n?.t('modules/cp/const/requests___alle'),
		},
		{
			id: VisitStatus.PENDING,
			label: i18n?.t('modules/cp/const/requests___open'),
		},
		{
			id: VisitStatus.APPROVED,
			label: i18n?.t('modules/cp/const/requests___goedgekeurd'),
		},
		{
			id: VisitStatus.DENIED,
			label: i18n?.t('modules/cp/const/requests___geweigerd'),
		},
	];
};

export const requestCreatedAtFormatter = (input: Date | string): string => {
	const locale = getLocaleFromi18nLanguage(i18n?.language || '');

	let date: Date;
	if (typeof input === 'string') {
		date = new Date(input);
	} else {
		date = input;
	}

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
