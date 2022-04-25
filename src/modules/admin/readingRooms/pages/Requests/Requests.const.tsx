import { TabProps } from '@meemoo/react-components';
import { Column } from 'react-table';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { RequestStatusBadge } from '@cp/components';
import { RequestStatusAll } from '@cp/types';
import { requestCreatedAtFormatter } from '@cp/utils';
import { Icon } from '@shared/components';
import { SEARCH_QUERY_KEY } from '@shared/const';
import { SortDirectionParam } from '@shared/helpers';
import { i18n } from '@shared/helpers/i18n';
import { Visit, VisitRow, VisitStatus } from '@shared/types';
import { asDate, formatMediumDateWithTime } from '@shared/utils';

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
			label: i18n.t('modules/cp/const/requests___alle'),
		},
		{
			id: VisitStatus.PENDING,
			label: i18n.t('modules/cp/const/requests___open'),
		},
		{
			id: VisitStatus.APPROVED,
			label: i18n.t('modules/cp/const/requests___goedgekeurd'),
		},
		{
			id: VisitStatus.DENIED,
			label: i18n.t('modules/cp/const/requests___geweigerd'),
		},
	];
};

export const RequestTableColumns = (): Column<Visit>[] => [
	{
		Header: i18n.t('modules/admin/reading-rooms/pages/requests/requests___leeszaal'),
		accessor: 'spaceName',
	},
	{
		Header: i18n.t('modules/admin/reading-rooms/pages/requests/requests___naam'),
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
		Header: i18n.t('modules/admin/reading-rooms/pages/requests/requests___emailadres'),
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
		Header: i18n.t('modules/admin/reading-rooms/pages/requests/requests___tijdstip'),
		accessor: 'createdAt',
		Cell: ({ row }: VisitRow) => {
			return (
				<span
					className="u-color-neutral"
					title={formatMediumDateWithTime(asDate(row.original.createdAt))}
				>
					{requestCreatedAtFormatter(row.original.createdAt)}
				</span>
			);
		},
	},
	{
		Header: i18n.t('modules/admin/reading-rooms/pages/requests/requests___status'),
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
