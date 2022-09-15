import { Button, TabProps } from '@meemoo/react-components';
import React from 'react';
import { Column } from 'react-table';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { CopyButton, Icon, RequestStatusBadge } from '@shared/components';
import { SEARCH_QUERY_KEY } from '@shared/const';
import { SortDirectionParam } from '@shared/helpers';
import { tText } from '@shared/helpers/translate';
import { OrderDirection, Visit, VisitRow, VisitStatus } from '@shared/types';
import { asDate, formatDistanceToday, formatMediumDateWithTime } from '@shared/utils';
import { RequestStatusAll } from '@visits/types';

export const RequestTablePageSize = 20;
export const VISIT_REQUEST_ID_QUERY_KEY = 'aanvraag';

export const CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG = {
	[VISIT_REQUEST_ID_QUERY_KEY]: withDefault(StringParam, undefined),
	status: withDefault(StringParam, RequestStatusAll.ALL),
	[SEARCH_QUERY_KEY]: withDefault(StringParam, undefined),
	page: withDefault(NumberParam, 1),
	orderProp: withDefault(StringParam, 'createdAt'),
	orderDirection: withDefault(SortDirectionParam, OrderDirection.desc),
};

export const requestStatusFilters = (): TabProps[] => {
	return [
		{
			id: RequestStatusAll.ALL,
			label: tText('modules/cp/const/requests___alle'),
		},
		{
			id: VisitStatus.PENDING,
			label: tText('modules/cp/const/requests___open'),
		},
		{
			id: VisitStatus.APPROVED,
			label: tText('modules/cp/const/requests___goedgekeurd'),
		},
		{
			id: VisitStatus.DENIED,
			label: tText('modules/cp/const/requests___geweigerd'),
		},
		{
			id: VisitStatus.CANCELLED_BY_VISITOR,
			label: tText('modules/cp/const/requests___geannuleerd'),
		},
	];
};

export const RequestTableColumns = (): Column<Visit>[] => [
	{
		Header: tText('modules/cp/const/requests___naam'),
		accessor: 'visitorName',
	},
	{
		Header: tText('modules/cp/const/requests___emailadres'),
		accessor: 'visitorMail',
		Cell: ({ row }: VisitRow) => (
			<CopyButton
				className="u-color-neutral u-p-0 c-table__copy"
				icon={undefined}
				variants="text"
				text={row.original.visitorMail}
			>
				{row.original.visitorMail}
			</CopyButton>
		),
	},
	{
		Header: tText('modules/cp/const/requests___tijdstip'),
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
		Header: tText('modules/cp/const/requests___status'),
		accessor: 'status',
		Cell: ({ row }: VisitRow) => {
			return <RequestStatusBadge status={row.original.status} />;
		},
	},
	{
		Header: '',
		id: 'cp-requests-table-actions',
		Cell: () => {
			return (
				<Button
					className="p-cp-requests__actions"
					icon={<Icon name="dots-vertical" aria-hidden />}
					aria-label={tText('modules/cp/const/requests___meer-acties')}
					variants={['xxs', 'text']}
				/>
			);
		},
	},
];
