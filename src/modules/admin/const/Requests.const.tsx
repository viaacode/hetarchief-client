import { Button, type Column } from '@meemoo/react-components';
import { CopyButton } from '@shared/components/CopyButton';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { RequestStatusBadge } from '@shared/components/RequestStatusBadge';
import { tText } from '@shared/helpers/translate';
import type { VisitRequest } from '@shared/types/visit-request';
import { asDate, formatDistanceToday, formatMediumDateWithTime } from '@shared/utils/dates';
import { truncate } from 'es-toolkit/compat';
import React from 'react';

export const RequestTableColumns = (): Column<VisitRequest>[] => [
	{
		header: tText('modules/admin/const/requests___bezoekersruimte'),
		accessorKey: 'spaceName',
	},
	{
		header: tText('modules/admin/const/requests___naam'),
		accessorKey: 'visitorName',
		cell: ({ row }) => {
			return (
				// biome-ignore lint/a11y/useAriaPropsSupportedByRole: it still works
				<span className="u-color-neutral" aria-label={row.original.visitorName}>
					{row.original.visitorName}
				</span>
			);
		},
	},
	{
		header: tText('modules/admin/const/requests___emailadres'),
		accessorKey: 'visitorMail',
		cell: ({ row }) => (
			<CopyButton
				className="u-color-neutral u-p-0 c-table__copy"
				icon={undefined}
				variants="text"
				text={row.original.visitorMail}
				title={row.original.visitorMail}
				ariaLabel={tText(
					'modules/admin/const/requests___kopieer-het-email-adres-van-de-bezoeker-naar-je-klemboard'
				)}
			>
				{truncate(row.original.visitorMail, { length: 35 })}
			</CopyButton>
		),
	},
	{
		header: tText('modules/admin/const/requests___tijdstip'),
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
		header: tText('modules/admin/const/requests___status'),
		accessorKey: 'status',
		cell: ({ row }) => {
			return <RequestStatusBadge status={row.original.status} />;
		},
	},
	{
		header: '',
		id: 'cp-requests-table-actions',
		cell: () => {
			return (
				<Button
					className="p-cp-requests__actions"
					icon={<Icon name={IconNamesLight.DotsVertical} aria-hidden />}
					ariaLabel={tText('modules/admin/const/requests___meer-acties')}
					variants={['xxs', 'text']}
				/>
			);
		},
	},
];
