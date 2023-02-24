import { Column } from 'react-table';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE } from '@material-requests/const';
import { MaterialRequest, MaterialRequestKeys, MaterialRequestRow } from '@material-requests/types';
import { SortDirectionParam } from '@shared/helpers';
import { tText } from '@shared/helpers/translate';
import { asDate, formatDistanceToday, formatMediumDateWithTime } from '@shared/utils';

export const ACCOUNT_MATERIAL_REQUESTS_TABLE_PAGE_SIZE = 20;

export const ACCOUNT_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG = {
	orderProp: withDefault(StringParam, MaterialRequestKeys.createdAt),
	orderDirection: withDefault(SortDirectionParam, undefined),
	page: withDefault(NumberParam, 1),
};

export const getAccountMaterialRequestTableColumns = (): Column<MaterialRequest>[] => [
	{
		Header: tText('modules/cp/const/material-requests___materiaal'),
		accessor: MaterialRequestKeys.material,
	},
	{
		Header: tText('modules/cp/const/material-requests___aanbieder'),
		accessor: MaterialRequestKeys.maintainer,
		Cell: ({ row: { original } }: MaterialRequestRow) => (
			<span className="u-color-neutral">{original.maintainerName}</span>
		),
	},
	{
		Header: tText('modules/cp/const/material-requests___aangevraagd-op'),
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
		Header: tText('modules/cp/const/material-requests___type'),
		accessor: MaterialRequestKeys.type,
		Cell: ({ row: { original } }: MaterialRequestRow) => (
			<span className="u-color-neutral p-material-requests__table-type">
				{MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE[original.type]}
			</span>
		),
	},
];
