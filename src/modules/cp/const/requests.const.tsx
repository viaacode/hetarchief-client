import { Button, type Column, type TabProps } from '@meemoo/react-components';
import { CopyButton } from '@shared/components/CopyButton';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { RequestStatusBadge } from '@shared/components/RequestStatusBadge';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { SortDirectionParam } from '@shared/helpers';
import { tText } from '@shared/helpers/translate';
import { AccessType, type VisitRequest, VisitStatus } from '@shared/types/visit-request';
import { asDate, formatDistanceToday, formatMediumDateWithTime } from '@shared/utils/dates';
import { AvoSearchOrderDirection } from '@viaa/avo2-types';
import { RequestStatusAll } from '@visit-requests/types';
import { truncate } from 'es-toolkit/compat';
import React from 'react';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

export const RequestTablePageSize = 20;
export const VISIT_REQUEST_ID_QUERY_KEY = 'aanvraag';

export const CP_ADMIN_REQUESTS_QUERY_PARAM_CONFIG = {
	[VISIT_REQUEST_ID_QUERY_KEY]: withDefault(StringParam, undefined),
	status: withDefault(StringParam, RequestStatusAll.ALL),
	[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: withDefault(StringParam, undefined),
	page: withDefault(NumberParam, 1),
	orderProp: withDefault(StringParam, 'createdAt'),
	orderDirection: withDefault(SortDirectionParam, AvoSearchOrderDirection.DESC),
};

const GET_CP_ADMIN_REQUESTS_ACCESS_TYPE_TRANSLATION_KEYS = (): Record<AccessType, string> => ({
	[AccessType.FULL]: tText('modules/cp/const/requests___volledige-toegang'),
	[AccessType.FOLDERS]: tText('modules/cp/const/requests___gedeeltelijke-toegang'),
});

export const requestStatusFilters = (): TabProps[] => {
	return [
		{
			id: RequestStatusAll.ALL,
			label: tText('modules/cp/const/requests___alle'),
			ariaLabel: tText('modules/cp/const/requests___alle'),
		},
		{
			id: VisitStatus.PENDING,
			label: tText('modules/cp/const/requests___open'),
			ariaLabel: tText('modules/cp/const/requests___open'),
		},
		{
			id: VisitStatus.APPROVED,
			label: tText('modules/cp/const/requests___goedgekeurd'),
			ariaLabel: tText('modules/cp/const/requests___goedgekeurd'),
		},
		{
			id: VisitStatus.DENIED,
			label: tText('modules/cp/const/requests___geweigerd'),
			ariaLabel: tText('modules/cp/const/requests___geweigerd'),
		},
		{
			id: VisitStatus.CANCELLED_BY_VISITOR,
			label: tText('modules/cp/const/requests___geannuleerd'),
			ariaLabel: tText('modules/cp/const/requests___geannuleerd'),
		},
	];
};

export const RequestTableColumns = (): Column<VisitRequest>[] => [
	{
		header: tText('modules/cp/const/requests___naam'),
		accessorKey: 'visitorName',
	},
	{
		header: tText('modules/cp/const/requests___emailadres'),
		accessorKey: 'visitorMail',
		cell: ({ row }) => (
			<CopyButton
				className="u-color-neutral u-p-0 c-table__copy"
				icon={undefined}
				variants="text"
				text={row.original.visitorMail}
				title={row.original.visitorMail}
				ariaLabel={tText(
					'modules/cp/const/requests___kopieer-het-email-adres-van-de-bezoeker-naar-je-klemboard'
				)}
			>
				{truncate(row.original.visitorMail, { length: 30 })}
			</CopyButton>
		),
	},
	{
		header: tText('modules/cp/const/requests___tijdstip'),
		accessorKey: 'createdAt',
		cell: ({ row }) => {
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
		header: tText('modules/cp/const/requests___status'),
		accessorKey: 'status',
		cell: ({ row }) => {
			return <RequestStatusBadge status={row.original.status} />;
		},
	},
	{
		header: tText('modules/cp/const/requests___soort-toegang'),
		accessorKey: 'accessType',
		cell: ({ row }) => {
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
		header: '',
		id: 'cp-requests-table-edit',
		cell: () => {
			return (
				<Button
					className="p-cp-requests__edit"
					icon={<Icon name={IconNamesLight.Edit} aria-hidden />}
					ariaLabel={tText('modules/cp/const/requests___bewerken')}
					variants={['xxs', 'text']}
				/>
			);
		},
	},
];
