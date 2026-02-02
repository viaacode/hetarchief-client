import {
	type MaterialRequest,
	MaterialRequestCopyrightDisplay,
	MaterialRequestDistributionAccess,
	MaterialRequestDistributionDigitalOnline,
	MaterialRequestDistributionType,
	MaterialRequestDownloadQuality,
	MaterialRequestEditing,
	MaterialRequestGeographicalUsage,
	MaterialRequestIntendedUsage,
	MaterialRequestKeys,
	type MaterialRequestReuseForm,
	MaterialRequestStatus,
	MaterialRequestTimeUsage,
	MaterialRequestType,
} from '@material-requests/types';
import { tText } from '@shared/helpers/translate';
import type { ColumnInstance, HeaderGroup, TableCellProps, TableHeaderProps } from 'react-table';

export const GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE = (): Record<
	MaterialRequestType,
	string
> => ({
	[MaterialRequestType.MORE_INFO]: tText(
		'modules/material-requests/const/material-requests___type-more-info'
	),
	[MaterialRequestType.REUSE]: tText(
		'modules/material-requests/const/material-requests___type-reuse'
	),
	[MaterialRequestType.VIEW]: tText(
		'modules/material-requests/const/material-requests___type-view'
	),
});

export const GET_MATERIAL_REQUEST_TRANSLATIONS_BY_STATUS = (): Record<
	MaterialRequestStatus,
	string
> => ({
	[MaterialRequestStatus.NEW]: tText('modules/material-requests/const/index___status-new'),
	[MaterialRequestStatus.PENDING]: tText('modules/material-requests/const/index___status-pending'),
	[MaterialRequestStatus.APPROVED]: tText(
		'modules/material-requests/const/index___status-approved'
	),
	[MaterialRequestStatus.DENIED]: tText('modules/material-requests/const/index___status-denied'),
	[MaterialRequestStatus.CANCELLED]: tText(
		'modules/material-requests/const/index___status-cancelled'
	),
	[MaterialRequestStatus.NONE]: tText('modules/material-requests/const/index___status-none'),
});

export const GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DOWNLOAD_QUALITY = (): Record<
	MaterialRequestDownloadQuality,
	string
> => ({
	[MaterialRequestDownloadQuality.NORMAL]: tText(
		'modules/material-requests/const/index___download-quality-normal'
	),
	[MaterialRequestDownloadQuality.HIGH]: tText(
		'modules/material-requests/const/index___download-quality-high'
	),
});

export const GET_MATERIAL_REQUEST_TRANSLATIONS_BY_INTENDED_USAGE = (): Record<
	MaterialRequestIntendedUsage,
	string
> => ({
	[MaterialRequestIntendedUsage.INTERN]: tText(
		'modules/material-requests/const/index___intended-usage-intern'
	),
	[MaterialRequestIntendedUsage.NON_COMMERCIAL]: tText(
		'modules/material-requests/const/index___intended-usage-non-commercial'
	),
	[MaterialRequestIntendedUsage.COMMERCIAL]: tText(
		'modules/material-requests/const/index___intended-usage-commercial'
	),
});

export const GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DISTRIBUTION_ACCESS = (): Record<
	MaterialRequestDistributionAccess,
	string
> => ({
	[MaterialRequestDistributionAccess.INTERN]: tText(
		'modules/material-requests/const/index___distribution-access-intern'
	),
	[MaterialRequestDistributionAccess.INTERN_EXTERN]: tText(
		'modules/material-requests/const/index___distribution-access-intern-extern'
	),
});

export const GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DISTRIBUTION_TYPE = (): Record<
	MaterialRequestDistributionType,
	string
> => ({
	[MaterialRequestDistributionType.DIGITAL_OFFLINE]: tText(
		'modules/material-requests/const/index___distribution-type-digital-offline'
	),
	[MaterialRequestDistributionType.DIGITAL_ONLINE]: tText(
		'modules/material-requests/const/index___distribution-type-digital-online'
	),
	[MaterialRequestDistributionType.OTHER]: tText(
		'modules/material-requests/const/index___distribution-type-other'
	),
});

export const GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DISTRIBUTION_DIGITAL_ONLINE = (): Record<
	MaterialRequestDistributionDigitalOnline,
	string
> => ({
	[MaterialRequestDistributionDigitalOnline.INTERNAL]: tText(
		'modules/material-requests/const/index___distribution-digital-online-internal'
	),
	[MaterialRequestDistributionDigitalOnline.NO_AUTH]: tText(
		'modules/material-requests/const/index___distribution-digital-online-no-auth'
	),
	[MaterialRequestDistributionDigitalOnline.WITH_AUTH]: tText(
		'modules/material-requests/const/index___distribution-digital-online-with-auth'
	),
});

export const GET_MATERIAL_REQUEST_TRANSLATIONS_BY_MATERIAL_EDITING = (): Record<
	MaterialRequestEditing,
	string
> => ({
	[MaterialRequestEditing.NONE]: tText(
		'modules/material-requests/const/index___material-request-editing-none'
	),
	[MaterialRequestEditing.WITH_CHANGES]: tText(
		'modules/material-requests/const/index___material-request-editing-with-changes'
	),
});

export const GET_MATERIAL_REQUEST_TRANSLATIONS_BY_GEOGRAPHICAL_USAGE = (): Record<
	MaterialRequestGeographicalUsage,
	string
> => ({
	[MaterialRequestGeographicalUsage.COMPLETELY_LOCAL]: tText(
		'modules/material-requests/const/index___geographical-usage-completely-local'
	),
	[MaterialRequestGeographicalUsage.NOT_COMPLETELY_LOCAL]: tText(
		'modules/material-requests/const/index___geographical-usage-not-completely-local'
	),
});

export const GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TIME_USAGE = (): Record<
	MaterialRequestTimeUsage,
	string
> => ({
	[MaterialRequestTimeUsage.UNLIMITED]: tText(
		'modules/material-requests/const/index___time-usage-unlimited'
	),
	[MaterialRequestTimeUsage.IN_TIME]: tText(
		'modules/material-requests/const/index___time-usage-in-time'
	),
});

export const GET_MATERIAL_REQUEST_TRANSLATIONS_BY_COPYRIGHT = (): Record<
	MaterialRequestCopyrightDisplay,
	string
> => ({
	[MaterialRequestCopyrightDisplay.SAME_TIME_WITH_OBJECT]: tText(
		'modules/material-requests/const/index___copyright-display-same-time-with-object'
	),
	[MaterialRequestCopyrightDisplay.AROUND_OBJECT]: tText(
		'modules/material-requests/const/index___copyright-display-around-object'
	),
	[MaterialRequestCopyrightDisplay.NONE]: tText(
		'modules/material-requests/const/index___copyright-display-none'
	),
});

export const GET_BLANK_MATERIAL_REQUEST_REUSE_FORM = (): MaterialRequestReuseForm => ({
	representationId: undefined,
	startTime: 0,
	endTime: undefined,
	downloadQuality: undefined,
	intendedUsageDescription: undefined,
	intendedUsage: undefined,
	distributionAccess: undefined,
	distributionType: undefined,
	distributionTypeDigitalOnline: undefined,
	distributionTypeOtherExplanation: undefined,
	materialEditing: undefined,
	geographicalUsage: undefined,
	geographicalUsageDescription: undefined,
	timeUsageType: undefined,
	timeUsageFrom: undefined,
	timeUsageTo: undefined,
	copyrightDisplay: undefined,
});

export const getAccountMaterialRequestTableColumnProps = (
	column: HeaderGroup<MaterialRequest> | ColumnInstance<MaterialRequest>
): Partial<TableHeaderProps> | Partial<TableCellProps> => {
	const columnWidth = COLUMN_WIDTH_LOOKUP[column.id as MaterialRequestKeys];

	if (columnWidth) {
		return {
			style: {
				width: columnWidth,
				minWidth: columnWidth,
				maxWidth: columnWidth,
			},
		};
	}

	return {};
};

const COLUMN_WIDTH_LOOKUP: Record<MaterialRequestKeys, string> = {
	[MaterialRequestKeys.requestedAt]: '15rem',
	[MaterialRequestKeys.type]: '20rem',
	[MaterialRequestKeys.status]: '10rem',
	[MaterialRequestKeys.downloadUrl]: '10rem',
	[MaterialRequestKeys.requestGroupName]: '25rem',
} as Record<MaterialRequestKeys, string>;
