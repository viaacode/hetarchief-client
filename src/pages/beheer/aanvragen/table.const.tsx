import { TFunction } from 'next-i18next';
import Link from 'next/link';
import { Column } from 'react-table';

import { RequestStatusBadge } from '@cp/components';
import { VisitInfo } from '@cp/types';
import { Icon } from '@shared/components';

import { RequestTableArgs } from './table.types';

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
