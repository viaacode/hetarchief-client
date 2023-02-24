import { MaterialRequestType } from '@material-requests/types';
import { tText } from '@shared/helpers/translate';

export const MATERIAL_REQUEST_TRANSLATIONS_BY_TYPE: Record<MaterialRequestType, string> = {
	[MaterialRequestType.MORE_INFO]: tText(
		'modules/material-requests/const/material-requests___type-more-info'
	),
	[MaterialRequestType.REUSE]: tText(
		'modules/material-requests/const/material-requests___type-reuse'
	),
	[MaterialRequestType.VIEW]: tText(
		'modules/material-requests/const/material-requests___type-view'
	),
};
