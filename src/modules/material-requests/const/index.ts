import { type MaterialRequestReuseForm, MaterialRequestType } from '@material-requests/types';
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
