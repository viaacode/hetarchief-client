import { Button, OrderDirection, type TabProps } from '@meemoo/react-components';
import { truncate } from 'lodash-es';
import React from 'react';
import type { Column } from 'react-table';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { CopyButton } from '@shared/components/CopyButton';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { RequestStatusBadge } from '@shared/components/RequestStatusBadge';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { SortDirectionParam } from '@shared/helpers';
import { tText } from '@shared/helpers/translate';
import {
	AccessType,
	type VisitRequest,
	type VisitRow,
	VisitStatus,
} from '@shared/types/visit-request';
import { asDate, formatDistanceToday, formatMediumDateWithTime } from '@shared/utils/dates';
import { RequestStatusAll } from '@visit-requests/types';

export const RequestTablePageSize = 20;
export const VISIT_REQUEST_ID_QUERY_KEY = 'aanvraag';

export const CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG = {
	[VISIT_REQUEST_ID_QUERY_KEY]: withDefault(StringParam, undefined),
	status: withDefault(StringParam, RequestStatusAll.ALL),
	[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: withDefault(StringParam, undefined),
	page: withDefault(NumberParam, 1),
	orderProp: withDefault(StringParam, 'createdAt'),
	orderDirection: withDefault(SortDirectionParam, OrderDirection.desc),
};

export const GET_CP_ADMIN_REQUESTS_ACCESS_TYPE_TRANSLATION_KEYS = (): Record<
	AccessType,
	string
> => ({
	[AccessType.FULL]: tText('modules/cp/const/requests___volledige-toegang'),
	[AccessType.FOLDERS]: tText('modules/cp/const/requests___gedeeltelijke-toegang'),
});

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

export const RequestTableColumns = (): Column<VisitRequest>[] => [
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
				title={row.original.visitorMail}
			>
				{truncate(row.original.visitorMail, { length: 30 })}
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
		Header: tText('modules/cp/const/requests___soort-toegang'),
		accessor: 'accessType',
		Cell: ({ row }: VisitRow) => {
			return (
				<span className="u-color-neutral">
					{row.original.status === VisitStatus.PENDING
						? '-'
						: GET_CP_ADMIN_REQUESTS_ACCESS_TYPE_TRANSLATION_KEYS()[row.original.accessType]}
				</span>
			);
		},
	},
	{
		Header: '',
		id: 'cp-requests-table-edit',
		Cell: () => {
			return (
				<Button
					className="p-cp-requests__edit"
					icon={<Icon name={IconNamesLight.Edit} aria-hidden />}
					aria-label={tText('modules/cp/const/requests___bewerken')}
					variants={['xxs', 'text']}
				/>
			);
		},
	},
];
