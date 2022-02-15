import { TabProps } from '@meemoo/react-components';
import { i18n, TFunction } from 'next-i18next';
import Link from 'next/link';
import { Column } from 'react-table';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { RequestStatusBadge } from '@cp/components';
import { RequestStatusAll, RequestTableArgs, VisitInfo } from '@cp/types';
import { Icon } from '@shared/components';
import { SortDirectionParam } from '@shared/helpers';
import { VisitStatus } from '@visits/types';

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
				<Link href={`mailto:${row.original.visitorMail}`}>
					<a className="u-color-neutral p-cp-requests__link">
						{row.original.visitorMail}
					</a>
				</Link>
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
