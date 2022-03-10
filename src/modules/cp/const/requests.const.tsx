import { TabProps } from '@meemoo/react-components';
import clsx from 'clsx';
import { format, isWithinInterval } from 'date-fns';
import { i18n, TFunction } from 'next-i18next';
import { Column } from 'react-table';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { RequestStatusBadge } from '@cp/components';
import { RequestStatusAll } from '@cp/types';
import { Icon, UnreadMarker } from '@shared/components';
import { SortDirectionParam } from '@shared/helpers';
import { VisitInfo, VisitInfoRow, VisitStatus } from '@shared/types';
import { VisitTimeframe } from '@visits/types';

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

export const RequestTableColumns = (
	i18n: { t: TFunction } = { t: (x: string) => x }
): Column<VisitInfo>[] => [
	{
		Header: i18n.t('modules/cp/const/requests___naam') || '',
		accessor: 'visitorName',
	},
	{
		Header: i18n.t('modules/cp/const/requests___emailadres') || '',
		accessor: 'visitorMail',
		Cell: ({ row }: VisitInfoRow) => {
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
		Header: i18n.t('modules/cp/const/requests___tijdstip') || '',
		accessor: 'createdAt',
		Cell: ({ row }: VisitInfoRow) => {
			return (
				<span className="u-color-neutral">
					{new Date(row.original.createdAt).toLocaleString('nl-be')}
				</span>
			);
		},
	},
	{
		Header: i18n.t('modules/cp/const/requests___status') || '',
		accessor: 'status',
		Cell: ({ row }: VisitInfoRow) => {
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

export const VisitsTableColumns = (
	i18n: { t: TFunction } = { t: (x: string) => x }
): Column<VisitInfo>[] => [
	{
		Header: i18n.t('modules/cp/const/requests___naam') || '',
		accessor: 'visitorName',
	},
	{
		Header: i18n.t('modules/cp/const/requests___emailadres') || '',
		accessor: 'visitorMail',
		Cell: ({ row }: VisitInfoRow) => {
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
		Header: i18n.t('modules/cp/const/requests___toegang') || '',
		accessor: 'startAt',
		Cell: ({ row }: VisitInfoRow) => {
			const active = isWithinInterval(new Date(), {
				start: new Date(row.original.startAt || ''),
				end: new Date(row.original.endAt || ''),
			});
			return (
				<span className={clsx('u-color-neutral', styles['p-visits__access'])}>
					<UnreadMarker active={active} />
					{format(new Date(row.original.startAt || ''), 'dd/MM/yyyy HH:mm') +
						' - ' +
						format(new Date(row.original.endAt || ''), 'dd/MM/yyyy HH:mm')}
				</span>
			);
		},
	},
	{
		Header: i18n.t('modules/cp/const/requests___goedgekeurd-door') || '',
		accessor: 'status',
		Cell: () => {
			return <span className="u-color-neutral">Noah Peeters</span>; // TODO Add column to database to track updatedBy
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
