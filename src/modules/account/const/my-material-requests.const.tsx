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
	[QUERY_PARAM_KEY.TYPE]: withDefault(ArrayParam, []),
	[QUERY_PARAM_KEY.STATUS]: withDefault(ArrayParam, []),
	[QUERY_PARAM_KEY.HAS_DOWNLOAD_URL]: withDefault(ArrayParam, []),
	[QUERY_PARAM_KEY.ORDER_PROP]: withDefault(StringParam, MaterialRequestKeys.requestedAt),
	[QUERY_PARAM_KEY.ORDER_DIRECTION]: withDefault(SortDirectionParam, undefined),
	[QUERY_PARAM_KEY.PAGE]: withDefault(NumberParam, 1),
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

export const getAccountMaterialRequestTableColumns = (
	isKeyUser: boolean
): Column<MaterialRequest>[] => [
	...(isKeyUser
		? [
				{
					Header: tText('modules/cp/const/material-requests___materiaal'),
					accessor: MaterialRequestKeys.material,
					Cell: ({ row: { original } }: MaterialRequestRow) => (
						<span className="p-material-requests__table-titel-material">
							<span className="p-material-requests__table-titel-material__name">
								{original.objectSchemaName}
							</span>
							<span className="p-material-requests__table-titel-material__provider">
								{original.maintainerName}
							</span>
						</span>
					),
				},
			]
		: [
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
			]),
	{
		Header: tText('modules/cp/const/material-requests___aangevraagd-op'),
		accessor: MaterialRequestKeys.requestedAt,
		Cell: ({ row: { original } }: MaterialRequestRow) => {
			const date = formatMediumDate(asDate(original.requestedAt || original.createdAt));
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
	...(isKeyUser
		? [
				{
					Header: tText('modules/cp/const/material-requests___status'),
					accessor: MaterialRequestKeys.status,
					Cell: ({ row: { original } }: MaterialRequestRow) => (
						<MaterialRequestStatusPill status={original.status} />
					),
				},
				{
					Header: tText('modules/cp/const/material-requests___download'),
					accessor: MaterialRequestKeys.downloadUrl,
					disableSortBy: true,
					Cell: ({ row: { original } }: MaterialRequestRow) => (
						<MaterialRequestDownloadButton materialRequest={original} />
					),
				} as Column<MaterialRequest>,
				{
					Header: tText('modules/cp/const/material-requests___request-name'),
					accessor: MaterialRequestKeys.requestGroupName,
					Cell: ({ row: { original } }: MaterialRequestRow) => (
						<span className="u-color-neutral">{original.requestGroupName}</span>
					),
				},
			]
		: []),
];
