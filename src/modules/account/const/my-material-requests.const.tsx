import MaterialRequestDownloadButton from '@account/components/MaterialRequestDownloadButton/MaterialRequestDownloadButton';
import { MaterialRequestStatusPill } from '@account/components/MaterialRequestStatusPill';
import { GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE } from '@material-requests/const';
import {
	type MaterialRequest,
	MaterialRequestKeys,
	type MaterialRequestRow,
	MaterialRequestStatus,
	MaterialRequestType,
} from '@material-requests/types';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { SortDirectionParam } from '@shared/helpers';
import { tText } from '@shared/helpers/translate';
import { asDate, formatMediumDate } from '@shared/utils/dates';
import type { Column } from 'react-table';
import { ArrayParam, NumberParam, StringParam, withDefault } from 'use-query-params';

export const ACCOUNT_MATERIAL_REQUESTS_TABLE_PAGE_SIZE = 20;

export const ACCOUNT_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG = {
	[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: withDefault(StringParam, undefined),
	type: withDefault(ArrayParam, []),
	status: withDefault(ArrayParam, []),
	hasDownloadUrl: withDefault(ArrayParam, []),
	orderProp: withDefault(StringParam, MaterialRequestKeys.createdAt),
	orderDirection: withDefault(SortDirectionParam, undefined),
	page: withDefault(NumberParam, 1),
};

export const GET_MATERIAL_REQUEST_TYPE_FILTER_ARRAY = (): {
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

export const GET_MATERIAL_REQUEST_STATUS_FILTER_ARRAY = (): {
	id: MaterialRequestStatus;
	label: string;
}[] => [
	{
		id: MaterialRequestStatus.NEW,
		label: tText('modules/cp/const/material-requests___filter-status-new'),
	},
	{
		id: MaterialRequestStatus.PENDING,
		label: tText('modules/cp/const/material-requests___filter-status-pending'),
	},
	{
		id: MaterialRequestStatus.APPROVED,
		label: tText('modules/cp/const/material-requests___filter-status-approved'),
	},
	{
		id: MaterialRequestStatus.DENIED,
		label: tText('modules/cp/const/material-requests___filter-status-denied'),
	},
	{
		id: MaterialRequestStatus.CANCELLED,
		label: tText('modules/cp/const/material-requests___filter-status-cancelled'),
	},
	{
		id: MaterialRequestStatus.NONE,
		label: tText('modules/cp/const/material-requests___filter-status-none'),
	},
];

export const GET_MATERIAL_REQUEST_DOWNLOAD_FILTER_ARRAY = (): {
	id: string;
	label: string;
}[] => [
	{
		id: 'true',
		label: tText('modules/cp/const/material-requests___filter-download-url-yes'),
	},
	{
		id: 'false',
		label: tText('modules/cp/const/material-requests___filter-download-url-no'),
	},
];

export const getAccountMaterialRequestTableColumns = (): Column<MaterialRequest>[] => [
	{
		Header: tText('modules/cp/const/material-requests___materiaal'),
		accessor: MaterialRequestKeys.material,
		Cell: ({ row: { original } }: MaterialRequestRow) => (
			<span className="p-material-requests__table-titel-material">
				<span className="p-material-requests__table-titel-material-name">
					{original.objectSchemaName}
				</span>
				<span className="p-material-requests__table-titel-material-provider">
					{original.maintainerName}
				</span>
			</span>
		),
	},
	{
		Header: tText('modules/cp/const/material-requests___aangevraagd-op'),
		accessor: MaterialRequestKeys.createdAt,
		Cell: ({ row: { original } }: MaterialRequestRow) => {
			const date = formatMediumDate(asDate(original.createdAt));
			return (
				<span className="u-color-neutral" title={date}>
					{date}
				</span>
			);
		},
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
	{
		Header: tText('modules/cp/const/material-requests___status'),
		accessor: MaterialRequestKeys.status,
		Cell: ({ row: { original } }: MaterialRequestRow) => (
			<MaterialRequestStatusPill status={original.status} />
		),
	},
	{
		Header: tText('modules/cp/const/material-requests___download'),
		accessor: MaterialRequestKeys.download,
		Cell: ({ row: { original } }: MaterialRequestRow) => (
			<MaterialRequestDownloadButton materialRequest={original} />
		),
	},
	{
		Header: tText('modules/cp/const/material-requests___request-name'),
		accessor: MaterialRequestKeys.requestName,
		Cell: ({ row: { original } }: MaterialRequestRow) => (
			<span className="u-color-neutral">{original.requestName}</span>
		),
	},
];
