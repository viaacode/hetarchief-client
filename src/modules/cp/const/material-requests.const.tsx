import { Column } from 'react-table';
import { NumberParam, StringParam, withDefault } from 'use-query-params';

import { CopyButton } from '@shared/components';
import { SEARCH_QUERY_KEY } from '@shared/const';
import { SortDirectionParam } from '@shared/helpers';
import { tText } from '@shared/helpers/translate';
import { asDate, formatDistanceToday, formatMediumDateWithTime } from '@shared/utils';

import { MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE } from '@material-requests/const';
import {
	MaterialRequest,
	MaterialRequestKeys,
	MaterialRequestRow,
	MaterialRequestType,
} from '@material-requests/types';

export const CP_MATERIAL_REQUESTS_TABLE_PAGE_SIZE = 20;

export const CP_MATERIAL_REQUESTS_FILTER_ALL_ID = 'ALL';

export const CP_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG = {
	[SEARCH_QUERY_KEY]: withDefault(StringParam, undefined),
	type: withDefault(StringParam, undefined),
	orderProp: withDefault(StringParam, MaterialRequestKeys.createdAt),
	orderDirection: withDefault(SortDirectionParam, undefined),
	page: withDefault(NumberParam, 1),
};

export const CP_MATERIAL_REQUEST_TYPE_FITLER_ARRAY = [
	{
		id: 'ALL',
		label: tText('modules/cp/const/material-requests___filter-type-more-all'),
	},
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

export const CP_MATERIAL_REQUEST_TYPE_FITLER_RECORD: Record<string, string> =
	CP_MATERIAL_REQUEST_TYPE_FITLER_ARRAY.reduce(
		(
			acc: Record<string, string>,
			curr: { id: string | number; label: string }
		): Record<string, string> => ({ ...acc, [curr.id]: curr.label }),
		{}
	);

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
			<span className="u-color-neutral p-cp-material-requests__table-type">
				{MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE[original.type]}
			</span>
		),
	},
];