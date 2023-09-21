import { Button } from '@meemoo/react-components';
import { truncate } from 'lodash-es';
import React from 'react';
import { Column } from 'react-table';

import { CopyButton, Icon, IconNamesLight, RequestStatusBadge } from '@shared/components';
import { tText } from '@shared/helpers/translate';
import { Visit, VisitRow } from '@shared/types';
import { asDate, formatDistanceToday, formatMediumDateWithTime } from '@shared/utils';

export const RequestTableColumns = (): Column<Visit>[] => [
	{
		Header: tText('modules/admin/const/requests___bezoekersruimte'),
		accessor: 'spaceName',
	},
	{
		Header: tText('modules/admin/const/requests___naam'),
		accessor: 'visitorName',
		Cell: ({ row }: VisitRow) => {
			return (
				<span className="u-color-neutral" aria-label={row.original.visitorName}>
					{row.original.visitorName}
				</span>
			);
		},
	},
	{
		Header: tText('modules/admin/const/requests___emailadres'),
		accessor: 'visitorMail',
		Cell: ({ row }: VisitRow) => (
			<CopyButton
				className="u-color-neutral u-p-0 c-table__copy"
				icon={undefined}
				variants="text"
				text={row.original.visitorMail}
				title={row.original.visitorMail}
			>
				{truncate(row.original.visitorMail, { length: 35 })}
			</CopyButton>
		),
	},
	{
		Header: tText('modules/admin/const/requests___tijdstip'),
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
		Header: tText('modules/admin/const/requests___status'),
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
					icon={<Icon name={IconNamesLight.DotsVertical} aria-hidden />}
					aria-label={tText('modules/admin/const/requests___meer-acties')}
					variants={['xxs', 'text']}
				/>
			);
		},
	},
];
