import { TabProps } from '@meemoo/react-components';
import clsx from 'clsx';
import { format, isWithinInterval, parseISO } from 'date-fns';
import { i18n, TFunction } from 'next-i18next';
import { Column } from 'react-table';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { RequestStatusBadge } from '@cp/components';
import { RequestStatusAll, RequestTableArgs, VisitInfo } from '@cp/types';
import { Icon, UnreadMarker } from '@shared/components';
import { SortDirectionParam } from '@shared/helpers';
import { formatAsBelgianDate } from '@shared/helpers/format-belgian-date';
import { VisitStatus, VisitTimeframe } from '@visits/types';

import styles from './requests.module.scss';

export const RequestTablePageSize = 20;

export const CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG = {
	status: withDefault(StringParam, RequestStatusAll.ALL),
	search: withDefault(StringParam, undefined),
	page: withDefault(NumberParam, 1),
	orderProp: withDefault(StringParam, undefined),
	orderDirection: withDefault(SortDirectionParam, undefined),
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

export const RequestTableColumns = (t?: TFunction): Column<VisitInfo>[] => [
	{
		Header: t?.('Naam') || '',
		accessor: 'visitorName',
	},
	{
		Header: t?.('Emailadres') || '',
		accessor: 'visitorMail',
		Cell: ({ row }: RequestTableArgs) => {
			return (
				<a
					className="u-color-neutral p-cp-requests__link"
					href={`mailto:${row.original.visitorMail}`}
					onClick={(e) => e.stopPropagation()}
				>
					{row.original.visitorMail}
				</a>
			);
		},
	},
	{
		Header: t?.('Tijdstip') || '',
		accessor: 'createdAt',
		Cell: ({ row }: RequestTableArgs) => {
			return (
				<span className="u-color-neutral">
					{new Date(row.original.createdAt).toLocaleString('nl-be')}
				</span>
			);
		},
	},
	{
		Header: t?.('Status') || '',
		accessor: 'status',
		Cell: ({ row }: RequestTableArgs) => {
			return <RequestStatusBadge status={row.original.status} />;
		},
	},
	{
		Header: '',
		id: 'cp-requests-table-actions',
		Cell: () => {
			return <Icon className="p-cp-requests__actions" name="dots-vertical" />;
		},
	},
];

export const CP_ADMIN_VISITS_QUERY_PARAM_CONFIG = {
	timeframe: withDefault(StringParam, RequestStatusAll.ALL),
	search: withDefault(StringParam, undefined),
	page: withDefault(NumberParam, 1),
	orderProp: withDefault(StringParam, undefined),
	orderDirection: withDefault(SortDirectionParam, undefined),
};

export const visitsStatusFilters = (): TabProps[] => {
	return [
		{
			id: RequestStatusAll.ALL,
			label: i18n?.t('modules/cp/const/requests___alle'),
		},
		{
			id: VisitTimeframe.ACTIVE,
			label: i18n?.t('modules/cp/const/requests___actief'),
		},
		{
			id: VisitTimeframe.PAST,
			label: i18n?.t('modules/cp/const/requests___historiek'),
		},
	];
};

export const VisitsTableColumns = (t?: TFunction): Column<VisitInfo>[] => [
	{
		Header: t?.('Naam') || '',
		accessor: 'visitorName',
	},
	{
		Header: t?.('Emailadres') || '',
		accessor: 'visitorMail',
		Cell: ({ row }: RequestTableArgs) => {
			return (
				<a
					className="u-color-neutral p-cp-visitors__link"
					href={`mailto:${row.original.visitorMail}`}
					onClick={(e) => e.stopPropagation()}
				>
					{row.original.visitorMail}
				</a>
			);
		},
	},
	{
		Header: t?.('Toegang') || '',
		accessor: 'startAt',
		Cell: ({ row }: RequestTableArgs) => {
			const active = isWithinInterval(new Date(), {
				start: parseISO(row.original.startAt),
				end: parseISO(row.original.endAt),
			});
			return (
				<span className={clsx('u-color-neutral', styles['p-visits__access'])}>
					<UnreadMarker active={active} />
					{formatAsBelgianDate(row.original.startAt) +
						' - ' +
						formatAsBelgianDate(row.original.endAt)}
				</span>
			);
		},
	},
	{
		Header: t?.('Goedgekeurd door') || '',
		accessor: 'status',
		Cell: ({ row }: RequestTableArgs) => {
			return <span className="u-color-neutral">{row.original.updatedByName}</span>;
		},
	},
	{
		Header: '',
		id: 'cp-visitors-histories-table-actions',
		Cell: () => {
			return <Icon className="p-cp-visitors-histories__actions" name="dots-vertical" />;
		},
	},
];
