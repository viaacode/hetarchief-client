import { Column } from 'react-table';
import { ArrayParam, NumberParam, StringParam, withDefault } from 'use-query-params';

import { SortDirectionParam } from '@shared/helpers';
import { tText } from '@shared/helpers/translate';
import { asDate, formatDistanceToday, formatMediumDateWithTime } from '@shared/utils';

import { MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE } from '@material-requests/const';
import { MaterialRequest, MaterialRequestKeys, MaterialRequestRow } from '@material-requests/types';

export const ADMIN_MATERIAL_REQUESTS_TABLE_PAGE_SIZE = 20;

export const ADMIN_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG = {
	orderProp: withDefault(StringParam, MaterialRequestKeys.createdAt),
	orderDirection: withDefault(SortDirectionParam, undefined),
	page: withDefault(NumberParam, 1),
	search: withDefault(StringParam, ''),
	type: withDefault(StringParam, ''),
	maintainerIds: withDefault(ArrayParam, []),
};

export const getAdminMaterialRequestTableColumns = (): Column<MaterialRequest>[] => [
	{
		Header: tText('modules/admin/const/material-requests___naam'),
		accessor: MaterialRequestKeys.name,
		Cell: ({ row: { original } }: MaterialRequestRow) => (
			<span className="u-color-neutral">{original.requesterFullName}</span>
		),
	},
	{
		Header: tText('modules/admin/const/material-requests___emailadres'),
		accessor: MaterialRequestKeys.email,
		Cell: ({ row: { original } }: MaterialRequestRow) => (
			<span className="u-color-neutral">{original.requesterMail}</span>
		),
	},
	{
		Header: tText('modules/admin/const/material-requests___aanbieder'),
		accessor: MaterialRequestKeys.maintainer,
		Cell: ({ row: { original } }: MaterialRequestRow) => (
			<span className="u-color-neutral">{original.maintainerName}</span>
		),
	},
	{
		Header: tText('modules/admin/const/material-requests___datum'),
		accessor: MaterialRequestKeys.createdAt,
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
		Header: tText('modules/admin/const/material-requests___type'),
		accessor: MaterialRequestKeys.type,
		Cell: ({ row: { original } }: MaterialRequestRow) => (
			<span className="u-color-neutral p-material-requests__table-type">
				{MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE[original.type]}
			</span>
		),
	},
];
