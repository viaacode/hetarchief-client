import MaterialRequestDownloadButton from '@account/components/MaterialRequestDownloadButton/MaterialRequestDownloadButton';
import { MaterialRequestStatusPill } from '@account/components/MaterialRequestStatusPill';
import { GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE } from '@material-requests/const';
import {
	type MaterialRequest,
	MaterialRequestKeys,
	MaterialRequestType,
} from '@material-requests/types';
import type { Column } from '@meemoo/react-components';
import { CopyButton } from '@shared/components/CopyButton';
import { UnreadMaterialRequestIndicator } from '@shared/components/UnreadMaterialRequestIndicator';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { SortDirectionParam } from '@shared/helpers';
import { tText } from '@shared/helpers/translate';
import { asDate, formatMediumDate } from '@shared/utils/dates';
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
	[QUERY_PARAM_KEY.IS_ARCHIVED]: withDefault(StringParam, 'false'),
	maintainerIds: withDefault(ArrayParam, []),
};

export const getAdminMaterialRequestTableColumns = (
	isTabletPortrait: boolean,
	unreadCountsByMaterialRequestId: Record<string, number> = {}
): Column<MaterialRequest>[] => [
	getRequesterColumn(isTabletPortrait),
	getUnreadCountColumn(unreadCountsByMaterialRequestId),
	...(isTabletPortrait
		? [getMaterialColumn()]
		: [getMaintainerColumn(), getTitleColumn(), getRequestedAtColumn()]),
	getTypeColumn(isTabletPortrait),
	getStatusColumn(isTabletPortrait),
	...(isTabletPortrait ? [] : [getDownloadColumn()]),
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

const getRequesterColumn = (disableSort: boolean): Column<MaterialRequest> =>
	({
		header: tText('modules/admin/const/material-requests___aanvrager'),
		accessorKey: MaterialRequestKeys.requesterFullName,
		enableSorting: !disableSort,
		cell: ({ row: { original } }) => (
			<span className="p-material-requests__table-titel-material">
				<span className="p-material-requests__table-titel-material__requester">
					{original.requesterFullName}
				</span>
				<CopyButton
					className="p-material-requests__table-titel-material__mail u-p-0 c-table__copy u-text-break"
					icon={undefined}
					variants="text"
					text={original.requesterMail}
					ariaLabel={tText(
						'modules/admin/const/material-requests___kopieer-het-email-adres-van-de-aanvrager-naar-je-klemboard'
					)}
				>
					{original.requesterMail}
				</CopyButton>
			</span>
		),
	}) as Column<MaterialRequest>;

const getUnreadCountColumn = (
	unreadCountsByMaterialRequestId: Record<string, number>
): Column<MaterialRequest> =>
	({
		accessorKey: MaterialRequestKeys.unreadStatus,
		header: '',
		enableSorting: false,
		cell: ({ row: { original } }) => {
			const count = unreadCountsByMaterialRequestId[original.id] || 0;
			if (!count) {
				return null;
			}
			return (
				<span
					title={tText('modules/admin/const/material-requests___count-ongelezen-berichten', {
						count,
					})}
				>
					<UnreadMaterialRequestIndicator count={count} />
				</span>
			);
		},
	}) as Column<MaterialRequest>;

const getMaterialColumn = (): Column<MaterialRequest> =>
	({
		header: tText('modules/admin/const/material-requests___materiaal'),
		accessorKey: MaterialRequestKeys.objectSchemaName,
		enableSorting: false,
		cell: ({ row: { original } }) => (
			<span className="p-material-requests__table-titel-material">
				<span className="p-material-requests__table-titel-material__name">
					{original.objectSchemaName}
				</span>
				<span className="p-material-requests__table-titel-material__provider">
					{original.maintainerName}
				</span>
			</span>
		),
	}) as Column<MaterialRequest>;

const getMaintainerColumn = (): Column<MaterialRequest> =>
	({
		header: tText('modules/admin/const/material-requests___aanbieder'),
		accessorKey: MaterialRequestKeys.maintainerName,
		cell: ({ row: { original } }) => (
			<span className="u-color-neutral">{original.maintainerName}</span>
		),
	}) as Column<MaterialRequest>;

const getTitleColumn = (): Column<MaterialRequest> =>
	({
		header: tText('modules/admin/const/material-requests___titel-materiaal'),
		accessorKey: MaterialRequestKeys.objectSchemaName,
	}) as Column<MaterialRequest>;

const getRequestedAtColumn = (): Column<MaterialRequest> =>
	({
		header: tText('modules/admin/const/material-requests___datum'),
		accessorKey: MaterialRequestKeys.requestedAt,
		cell: ({ row: { original } }) => {
			const date = formatMediumDate(asDate(original.requestedAt || original.createdAt));
			return (
				<span className="u-color-neutral" title={date}>
					{date}
				</span>
			);
		},
	}) as Column<MaterialRequest>;

const getTypeColumn = (disableSort: boolean): Column<MaterialRequest> =>
	({
		header: tText('modules/admin/const/material-requests___type'),
		accessorKey: MaterialRequestKeys.type,
		enableSorting: !disableSort,
		cell: ({ row: { original } }) => (
			<span className="u-color-neutral p-material-requests__table-type">
				{GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE()[original.type]}
			</span>
		),
	}) as Column<MaterialRequest>;

const getStatusColumn = (disableSort: boolean): Column<MaterialRequest> =>
	({
		header: tText('modules/admin/const/material-requests___status'),
		accessorKey: MaterialRequestKeys.status,
		enableSorting: !disableSort,
		cell: ({ row: { original } }) => (
			<MaterialRequestStatusPill status={original.status} includeStatusNone />
		),
	}) as Column<MaterialRequest>;

const getDownloadColumn = (): Column<MaterialRequest> =>
	({
		header: tText('modules/admin/const/material-requests___download'),
		accessorKey: MaterialRequestKeys.downloadStatus,
		enableSorting: false,
		cell: ({ row: { original } }) => <MaterialRequestDownloadButton materialRequest={original} />,
	}) as Column<MaterialRequest>;
