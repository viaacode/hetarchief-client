import MaterialRequestDownloadButton from '@account/components/MaterialRequestDownloadButton/MaterialRequestDownloadButton';
import { MaterialRequestStatusPill } from '@account/components/MaterialRequestStatusPill';
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
import { asDate, formatMediumDate } from '@shared/utils/dates';
import type { Column } from 'react-table';
import { ArrayParam, NumberParam, StringParam, withDefault } from 'use-query-params';

export const ADMIN_MATERIAL_REQUESTS_TABLE_PAGE_SIZE = 20;

export const ADMIN_MATERIAL_REQUESTS_QUERY_PARAM_CONFIG = {
	[QUERY_PARAM_KEY.ORDER_PROP]: withDefault(StringParam, MaterialRequestKeys.requestedAt),
	[QUERY_PARAM_KEY.ORDER_DIRECTION]: withDefault(SortDirectionParam, undefined),
	[QUERY_PARAM_KEY.PAGE]: withDefault(NumberParam, 1),
	[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: withDefault(StringParam, ''),
	[QUERY_PARAM_KEY.TYPE]: withDefault(ArrayParam, []),
	[QUERY_PARAM_KEY.STATUS]: withDefault(ArrayParam, []),
	[QUERY_PARAM_KEY.HAS_DOWNLOAD_URL]: withDefault(ArrayParam, []),
	maintainerIds: withDefault(ArrayParam, []),
};

export const getAdminMaterialRequestTableColumns = (): Column<MaterialRequest>[] => [
	{
		Header: tText('modules/admin/const/material-requests___aanvrager'),
		accessor: MaterialRequestKeys.name,
		Cell: ({ row: { original } }: MaterialRequestRow) => (
			<span className="p-material-requests__table-titel-material">
				<span className="p-material-requests__table-titel-material__requester">
					{original.requesterFullName}
				</span>
				<CopyButton
					className="p-material-requests__table-titel-material__mail u-p-0 c-table__copy u-text-break"
					icon={undefined}
					variants="text"
					text={original.requesterMail}
				>
					{original.requesterMail}
				</CopyButton>
			</span>
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
		Header: tText('modules/admin/const/material-requests___titel-materiaal'),
		accessor: MaterialRequestKeys.material,
	},
	{
		Header: tText('modules/admin/const/material-requests___datum'),
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
		Header: tText('modules/admin/const/material-requests___type'),
		accessor: MaterialRequestKeys.type,
		Cell: ({ row: { original } }: MaterialRequestRow) => (
			<span className="u-color-neutral p-material-requests__table-type">
				{GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE()[original.type]}
			</span>
		),
	},
	{
		Header: tText('modules/admin/const/material-requests___status'),
		accessor: MaterialRequestKeys.status,
		Cell: ({ row: { original } }: MaterialRequestRow) => (
			<MaterialRequestStatusPill status={original.status} />
		),
	},
	{
		Header: tText('modules/admin/const/material-requests___download'),
		accessor: MaterialRequestKeys.downloadUrl,
		disableSortBy: true,
		Cell: ({ row: { original } }: MaterialRequestRow) => (
			<MaterialRequestDownloadButton materialRequest={original} />
		),
	} as Column<MaterialRequest>,
];

export const GET_ADMIN_MATERIAL_REQUEST_TYPE_FILTER_ARRAY = (): {
	id: string;
	label: string;
}[] => [
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
