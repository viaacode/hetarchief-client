import { TFunction } from 'next-i18next';
import Link from 'next/link';
import { Column } from 'react-table';

import { RequestStatusBadge } from '@cp/components';
import { RequestTableRow } from '@cp/const/requests.const';
import { Icon } from '@shared/components';

import { RequestTableArgs } from './table.types';

export const RequestTableColumns = (t?: TFunction): Column<RequestTableRow>[] => [
	{
		Header: t?.('Naam') || '',
		accessor: 'name',
	},
	{
		Header: t?.('Emailadres') || '',
		accessor: 'email',
		Cell: ({ row }: RequestTableArgs) => {
			return (
				<Link href={`mailto:${row.original.email}`}>
					<a className="u-color-neutral p-cp-requests__link">{row.original.email}</a>
				</Link>
			);
		},
	},
	{
		Header: t?.('Tijdstip') || '',
		accessor: 'created_at',
		Cell: ({ row }: RequestTableArgs) => {
			return (
				<span className="u-color-neutral">
					{new Date(row.original.created_at).toLocaleString('nl-be')}
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
