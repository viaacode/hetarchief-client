import { Column } from 'react-table';

import { CopyButton } from '@shared/components';
import { tText } from '@shared/helpers/translate';
import { asDate, formatDistanceToday, formatMediumDateWithTime } from '@shared/utils';

import { MaterialRequest, MaterialRequestRow, MaterialRequestType } from '@material-requests/types';

export const MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE: Record<MaterialRequestType, string> = {
	[MaterialRequestType.MORE_INFO]: tText('modules/cp/const/material-requests___type-more-info'),
	[MaterialRequestType.REUSE]: tText('modules/cp/const/material-requests___type-reuse'),
	[MaterialRequestType.VIEW]: tText('modules/cp/const/material-requests___type-view'),
};

export const MaterialRequestTableColumns = (): Column<MaterialRequest>[] => [
	{
		Header: tText('modules/cp/const/material-requests___naam'),
		accessor: 'requesterName',
	},
	{
		Header: tText('modules/cp/const/material-requests___emailadres'),
		accessor: 'requesterEmail',
		Cell: ({ row }: MaterialRequestRow) => (
			<CopyButton
				className="u-color-neutral u-p-0 c-table__copy"
				icon={undefined}
				variants="text"
				text={row.original.requesterEmail}
			>
				{row.original.requesterEmail}
			</CopyButton>
		),
	},
	{
		Header: tText('modules/cp/const/material-requests___tijdstip'),
		accessor: 'createdAt',
		Cell: ({ row }: MaterialRequestRow) => (
			<span
				className="u-color-neutral"
				title={formatMediumDateWithTime(asDate(row.original.createdAt))}
			>
				{formatDistanceToday(row.original.createdAt)}
			</span>
		),
	},
	{
		Header: tText('modules/cp/const/material-requests___type'),
		accessor: 'type',
		Cell: ({ row }: MaterialRequestRow) => (
			<span className="u-color-neutral">
				{MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE[row.original.type]}
			</span>
		),
	},
];
