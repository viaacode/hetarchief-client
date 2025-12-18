import {
	MaterialRequestCopyrightDisplay,
	MaterialRequestDistributionAccess,
	MaterialRequestDistributionDigitalOnline,
	MaterialRequestDistributionType,
	MaterialRequestDownloadQuality,
	MaterialRequestEditing,
	MaterialRequestGeographicalUsage,
	MaterialRequestIntendedUsage,
	type MaterialRequestReuseForm,
	MaterialRequestStatus,
	MaterialRequestTimeUsage,
	MaterialRequestType,
} from '@material-requests/types';
import { tText } from '@shared/helpers/translate';

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
	[MaterialRequestStatus.NEW]: tText('status-new'),
	[MaterialRequestStatus.PENDING]: tText('status-pending'),
	[MaterialRequestStatus.APPROVED]: tText('status-approved'),
	[MaterialRequestStatus.DENIED]: tText('status-denied'),
	[MaterialRequestStatus.CANCELLED]: tText('status-cancelled'),
	[MaterialRequestStatus.NONE]: tText('status-none'),
});

export const GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DOWNLOAD_QUALITY = (): Record<
	MaterialRequestDownloadQuality,
	string
> => ({
	[MaterialRequestDownloadQuality.NORMAL]: tText('download-quality-normal'),
	[MaterialRequestDownloadQuality.HIGH]: tText('download-quality-high'),
});

export const GET_MATERIAL_REQUEST_TRANSLATIONS_BY_INTENDED_USAGE = (): Record<
	MaterialRequestIntendedUsage,
	string
> => ({
	[MaterialRequestIntendedUsage.INTERN]: tText('intended-usage-intern'),
	[MaterialRequestIntendedUsage.NON_COMMERCIAL]: tText('intended-usage-non-commercial'),
	[MaterialRequestIntendedUsage.COMMERCIAL]: tText('intended-usage-commercial'),
});

export const GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DISTRIBUTION_ACCESS = (): Record<
	MaterialRequestDistributionAccess,
	string
> => ({
	[MaterialRequestDistributionAccess.INTERN]: tText('distribution-access-intern'),
	[MaterialRequestDistributionAccess.INTERN_EXTERN]: tText('distribution-access-intern-extern'),
});

export const GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DISTRIBUTION_TYPE = (): Record<
	MaterialRequestDistributionType,
	string
> => ({
	[MaterialRequestDistributionType.DIGITAL_OFFLINE]: tText('distribution-type-digital-offline'),
	[MaterialRequestDistributionType.DIGITAL_ONLINE]: tText('distribution-type-digital-online'),
	[MaterialRequestDistributionType.OTHER]: tText('distribution-type-other'),
});

export const GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DISTRIBUTION_DIGITAL_ONLINE = (): Record<
	MaterialRequestDistributionDigitalOnline,
	string
> => ({
	[MaterialRequestDistributionDigitalOnline.INTERNAL]: tText(
		'distribution-digital-online-internal'
	),
	[MaterialRequestDistributionDigitalOnline.NO_AUTH]: tText('distribution-digital-online-no-auth'),
	[MaterialRequestDistributionDigitalOnline.WITH_AUTH]: tText(
		'distribution-digital-online-with-auth'
	),
});

export const GET_MATERIAL_REQUEST_TRANSLATIONS_BY_MATERIAL_EDITING = (): Record<
	MaterialRequestEditing,
	string
> => ({
	[MaterialRequestEditing.NONE]: tText('material-request-editing-none'),
	[MaterialRequestEditing.WITH_CHANGES]: tText('material-request-editing-with-changes'),
});

export const GET_MATERIAL_REQUEST_TRANSLATIONS_BY_GEOGRAPHICAL_USAGE = (): Record<
	MaterialRequestGeographicalUsage,
	string
> => ({
	[MaterialRequestGeographicalUsage.COMPLETELY_LOCAL]: tText('geographical-usage-completely-local'),
	[MaterialRequestGeographicalUsage.NOT_COMPLETELY_LOCAL]: tText(
		'geographical-usage-not-completely-local'
	),
});

export const GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TIME_USAGE = (): Record<
	MaterialRequestTimeUsage,
	string
> => ({
	[MaterialRequestTimeUsage.UNLIMITED]: tText('time-usage-unlimited'),
	[MaterialRequestTimeUsage.IN_TIME]: tText('time-usage-in-time'),
});

export const GET_MATERIAL_REQUEST_TRANSLATIONS_BY_COPYRIGHT = (): Record<
	MaterialRequestCopyrightDisplay,
	string
> => ({
	[MaterialRequestCopyrightDisplay.SAME_TIME_WITH_OBJECT]: tText(
		'copyright-display-same-time-with-object'
	),
	[MaterialRequestCopyrightDisplay.AROUND_OBJECT]: tText('copyright-display-around-object'),
	[MaterialRequestCopyrightDisplay.NONE]: tText('copyright-display-none'),
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
