import { Column } from 'react-table';

import { CopyButton } from '@shared/components';
import { tText } from '@shared/helpers/translate';
import { asDate, formatDistanceToday, formatMediumDateWithTime } from '@shared/utils';

import { MaterialRequest, MaterialRequestRow, MaterialRequestType } from '@material-requests/types';

export const MATERIAL_REQUESTS_TABLE_PAGE_SIZE = 20;

export const MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE: Record<MaterialRequestType, string> = {
	[MaterialRequestType.MORE_INFO]: tText('modules/cp/const/material-requests___type-more-info'),
	[MaterialRequestType.REUSE]: tText('modules/cp/const/material-requests___type-reuse'),
	[MaterialRequestType.VIEW]: tText('modules/cp/const/material-requests___type-view'),
};

export const MaterialRequestTableColumns = (): Column<MaterialRequest>[] => [
	{
		Header: tText('modules/cp/const/material-requests___naam'),
		accessor: 'requesterFullName',
	},
	{
		Header: tText('modules/cp/const/material-requests___emailadres'),
		accessor: 'requesterMail',
		Cell: ({ row: { original } }: MaterialRequestRow) => (
			<CopyButton
				className="u-color-neutral u-p-0 c-table__copy"
				icon={undefined}
				variants="text"
				text={original.requesterMail}
			>
				{original.requesterMail}
			</CopyButton>
		),
	},
	{
		Header: tText('modules/cp/const/material-requests___tijdstip'),
		accessor: 'createdAt',
		Cell: ({ row: { original } }: MaterialRequestRow) => (
			<span
				className="u-color-neutral"
				title={formatMediumDateWithTime(asDate(original.createdAt))}
			>
				{formatDistanceToday(original.createdAt)}
			</span>
		),
	},
	{
		Header: tText('modules/cp/const/material-requests___type'),
		accessor: 'type',
		Cell: ({ row: { original } }: MaterialRequestRow) => (
			<span className="u-color-neutral p-cp-material-requests__table-type">
				{MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE[original.type]}
			</span>
		),
	},
];
