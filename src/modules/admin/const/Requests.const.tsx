import { TabProps } from '@meemoo/react-components';
import { Column } from 'react-table';

import { CopyButton, Icon, RequestStatusBadge } from '@shared/components';
import { i18n } from '@shared/helpers/i18n';
import { Visit, VisitRow, VisitStatus } from '@shared/types';
import { asDate, formatDistanceToday, formatMediumDateWithTime } from '@shared/utils';
import { RequestStatusAll } from '@visits/types';

export const requestStatusFilters = (): TabProps[] => {
	return [
		{
			id: RequestStatusAll.ALL,
			label: i18n.t('modules/admin/const/requests___alle'),
		},
		{
			id: VisitStatus.PENDING,
			label: i18n.t('modules/admin/const/requests___open'),
		},
		{
			id: VisitStatus.APPROVED,
			label: i18n.t('modules/admin/const/requests___goedgekeurd'),
		},
		{
			id: VisitStatus.DENIED,
			label: i18n.t('modules/admin/const/requests___geweigerd'),
		},
	];
};

export const RequestTableColumns = (): Column<Visit>[] => [
	{
		Header: i18n.t('modules/admin/const/requests___leeszaal'),
		accessor: 'spaceName',
	},
	{
		Header: i18n.t('modules/admin/const/requests___naam'),
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
		Header: i18n.t('modules/admin/const/requests___emailadres'),
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
		Header: i18n.t('modules/admin/const/requests___tijdstip'),
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
		Header: i18n.t('modules/admin/const/requests___status'),
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
