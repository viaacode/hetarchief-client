import { Column } from 'react-table';
import { ArrayParam, NumberParam, StringParam, withDefault } from 'use-query-params';

import { MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE } from '@material-requests/const';
import {
	MaterialRequest,
	MaterialRequestKeys,
	MaterialRequestRow,
	MaterialRequestType,
} from '@material-requests/types';
import { SortDirectionParam } from '@shared/helpers';
import { tText } from '@shared/helpers/translate';
import { asDate, formatDistanceToday, formatMediumDateWithTime } from '@shared/utils';

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

export const ADMIN_MATERIAL_REQUESTS_FILTER_ALL_ID = 'ALL';

export const ADMIN_MATERIAL_REQUEST_TYPE_FILTER_ARRAY = [
	{
		id: ADMIN_MATERIAL_REQUESTS_FILTER_ALL_ID,
		label: tText('modules/admin/const/material-requests___filter-type-all'),
	},
	{
		id: MaterialRequestType.MORE_INFO,
		label: tText('modules/admin/const/material-requests___filter-type-more-info'),
	},
	{
		id: MaterialRequestType.REUSE,
		label: tText('modules/admin/const/material-requests___filter-type-reuse'),
	},
	{
		id: MaterialRequestType.VIEW,
		label: tText('modules/admin/const/material-requests___filter-type-view'),
	},
];

export const ADMIN_MATERIAL_REQUEST_TYPE_FILTER_RECORD: Record<string, string> =
	ADMIN_MATERIAL_REQUEST_TYPE_FILTER_ARRAY.reduce(
		(
			acc: Record<string, string>,
			curr: { id: string | number; label: string }
		): Record<string, string> => ({ ...acc, [curr.id]: curr.label }),
		{}
	);
