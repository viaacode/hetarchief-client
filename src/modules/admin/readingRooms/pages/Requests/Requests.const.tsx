import { TabProps } from '@meemoo/react-components';
import { i18n, TFunction } from 'next-i18next';
import { Column } from 'react-table';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { RequestStatusBadge } from '@cp/components';
import { RequestStatusAll } from '@cp/types';
import { requestCreatedAtFormatter } from '@cp/utils';
import { Icon } from '@shared/components';
import { SEARCH_QUERY_KEY } from '@shared/const';
import { SortDirectionParam } from '@shared/helpers';
import { Visit, VisitRow, VisitStatus } from '@shared/types';
import { asDate, formatWithLocale } from '@shared/utils';

export const RequestTablePageSize = 20;

export const ADMIN_REQUESTS_QUERY_PARAM_CONFIG = {
	status: withDefault(StringParam, RequestStatusAll.ALL),
	[SEARCH_QUERY_KEY]: withDefault(StringParam, undefined),
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
): Column<Visit>[] => [
	{
		Header: i18n.t('Leeszaal') || '',
		accessor: 'spaceName',
	},
	{
		Header: i18n.t('Naam') || '',
		accessor: 'visitorName',
		Cell: ({ row }: VisitRow) => {
			return (
				<span className="u-color-neutral" title={row.original.visitorName}>
					{row.original.visitorName}
				</span>
			);
		},
	},
	{
		Header: i18n.t('Emailadres') || '',
		accessor: 'visitorMail',
		Cell: ({ row }: VisitRow) => {
			return (
				<a
					className="u-color-neutral c-table__link"
					href={`mailto:${row.original.visitorMail}`}
					onClick={(e) => e.stopPropagation()}
				>
					{row.original.visitorMail}
				</a>
			);
		},
	},
	{
		Header: i18n.t('Tijdstip') || '',
		accessor: 'createdAt',
		Cell: ({ row }: VisitRow) => {
			return (
				<span
					className="u-color-neutral"
					title={formatWithLocale('PPpp', asDate(row.original.createdAt))}
				>
					{requestCreatedAtFormatter(row.original.createdAt)}
				</span>
			);
		},
	},
	{
		Header: i18n.t('Status') || '',
		accessor: 'status',
		Cell: ({ row }: VisitRow) => {
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
