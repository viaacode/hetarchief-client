import type { Column } from 'react-table';
import { ArrayParam, NumberParam, StringParam, withDefault } from 'use-query-params';

import { GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE } from '@material-requests/const';
import {
	type MaterialRequest,
	MaterialRequestKeys,
	type MaterialRequestRow,
	MaterialRequestType,
} from '@material-requests/types';
import { CopyButton } from '@shared/components/CopyButton';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { SortDirectionParam } from '@shared/helpers';
import { tText } from '@shared/helpers/translate';
import { asDate, formatDistanceToday, formatMediumDateWithTime } from '@shared/utils/dates';

export const CP_MATERIAL_REQUESTS_TABLE_PAGE_SIZE = 20;

export const CP_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG = {
	[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: withDefault(StringParam, undefined),
	type: withDefault(ArrayParam, []),
	orderProp: withDefault(StringParam, MaterialRequestKeys.updatedAt),
	orderDirection: withDefault(SortDirectionParam, undefined),
	page: withDefault(NumberParam, 1),
};

export const GET_CP_MATERIAL_REQUEST_TYPE_FILTER_ARRAY = (): {
	id: string;
	label: string;
}[] => [
	{
		id: MaterialRequestType.MORE_INFO,
		label: tText('modules/cp/const/material-requests___filter-type-more-info'),
	},
	{
		id: MaterialRequestType.REUSE,
		label: tText('modules/cp/const/material-requests___filter-type-reuse'),
	},
	{
		id: MaterialRequestType.VIEW,
		label: tText('modules/cp/const/material-requests___filter-type-view'),
	},
];

export const getMaterialRequestTableColumns = (): Column<MaterialRequest>[] => [
	{
		Header: tText('modules/cp/const/material-requests___naam'),
		accessor: MaterialRequestKeys.name,
	},
	{
		Header: tText('modules/cp/const/material-requests___emailadres'),
		accessor: MaterialRequestKeys.email,
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
		Header: tText('modules/cp/const/material-requests___datum-aangevraagd'),
		accessor: MaterialRequestKeys.updatedAt,
		Cell: ({ row: { original } }: MaterialRequestRow) => (
			<span
				className="u-color-neutral"
				title={formatMediumDateWithTime(asDate(original.updatedAt))}
			>
				{formatDistanceToday(original.updatedAt)}
			</span>
		),
	},
	{
		Header: tText('modules/cp/const/material-requests___type'),
		accessor: MaterialRequestKeys.type,
		Cell: ({ row: { original } }: MaterialRequestRow) => (
			<span className="u-color-neutral p-material-requests__table-type">
				{GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE()[original.type]}
			</span>
		),
	},
];
