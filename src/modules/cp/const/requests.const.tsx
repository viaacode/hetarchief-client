import { TabProps } from '@meemoo/react-components';
import { Column } from 'react-table';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { RequestStatusBadge } from '@cp/components';
import { RequestStatusAll } from '@cp/types';
import { CopyButton, Icon } from '@shared/components';
import { SEARCH_QUERY_KEY } from '@shared/const';
import { SortDirectionParam } from '@shared/helpers';
import { i18n } from '@shared/helpers/i18n';
import { Visit, VisitRow, VisitStatus } from '@shared/types';
import { asDate, formatDistanceToday, formatMediumDateWithTime } from '@shared/utils';

export const RequestTablePageSize = 20;

export const CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG = {
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
		{
			id: VisitStatus.CANCELLED_BY_VISITOR,
			label: i18n.t('modules/cp/const/requests___geannuleerd'),
		},
	];
};

export const RequestTableColumns = (): Column<Visit>[] => [
	{
		Header: i18n.t('modules/cp/const/requests___naam'),
		accessor: 'visitorName',
	},
	{
		Header: i18n.t('modules/cp/const/requests___emailadres'),
		accessor: 'visitorMail',
		Cell: ({ row }: VisitRow) => (
			<CopyButton
				className="u-color-neutral u-p-0 c-table__copy"
				icon={undefined}
				variants={['text', 'no-height']}
				text={row.original.visitorMail}
			>
				{row.original.visitorMail}
			</CopyButton>
		),
	},
	{
		Header: i18n.t('modules/cp/const/requests___tijdstip'),
		accessor: 'createdAt',
		Cell: ({ row }: VisitRow) => {
			return (
				<span
					className="u-color-neutral"
					title={formatMediumDateWithTime(asDate(row.original.createdAt))}
				>
					{formatDistanceToday(row.original.createdAt)}
				</span>
			);
		},
	},
	{
		Header: i18n.t('modules/cp/const/requests___status'),
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
