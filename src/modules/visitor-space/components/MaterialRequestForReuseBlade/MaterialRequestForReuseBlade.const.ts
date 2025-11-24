import {
	type MaterialRequest,
	MaterialRequestCopyrightDisplay,
	MaterialRequestDistributionAccess,
	MaterialRequestDistributionType,
	MaterialRequestDownloadQuality,
	MaterialRequestEditing,
	MaterialRequestExploitation,
	MaterialRequestGeographicalUsage,
	MaterialRequestTimeUsage,
} from '@material-requests/types';
import { tText } from '@shared/helpers/translate';
import { mixed, number, object, type Schema, string } from 'yup';

export type MaterialRequestReuseSettings = Pick<
	MaterialRequest,
	| 'startTime'
	| 'endTime'
	| 'downloadQuality'
	| 'intendedUsage'
	| 'exploitation'
	| 'distributionAccess'
	| 'distributionType'
	| 'distributionTypeOtherExplanation'
	| 'materialEditing'
	| 'geographicalUsage'
	| 'timeUsage'
	| 'copyrightDisplay'
>;

export const MATERIAL_REQUEST_REUSE_FORM_VALIDATION_SCHEMA =
	(): Schema<MaterialRequestReuseSettings> => {
		return object({
			startTime: number().required(),
			endTime: number().required(),
			downloadQuality: mixed<MaterialRequestDownloadQuality>()
				.oneOf(Object.values(MaterialRequestDownloadQuality))
				.required(tText('Duid aan in welke kwaliteit je het materiaal wil ontvangen.')),
			intendedUsage: string()
				.required(tText('Beschrijf waarvoor je het materiaal wenst te gebruiken.'))
				.max(300),
			exploitation: mixed<MaterialRequestExploitation>()
				.oneOf(Object.values(MaterialRequestExploitation))
				.required(
					tText(
						'Duid aan welke eventuele commerciële exploitatie van het materiaal van toepassing is.'
					)
				),
			distributionAccess: mixed<MaterialRequestDistributionAccess>()
				.oneOf(Object.values(MaterialRequestDistributionAccess))
				.required(tText('Duid aan welke verspreiding van het materiaal van toepassing is.')),
			distributionType: mixed<MaterialRequestDistributionType>()
				.oneOf(Object.values(MaterialRequestDistributionType))
				.required(
					tText('Duid aan of het over analoge of digitale verspreiding van het materiaal gaat.')
				),
			distributionTypeOtherExplanation: string().when('distributionType', ([value]) => {
				if (value === MaterialRequestDistributionType.OTHER) {
					return string().required(
						tText('Duid aan of het over analoge of digitale verspreiding van het materiaal gaat.')
					);
				}
				return string().optional();
			}),
			materialEditing: mixed<MaterialRequestEditing>()
				.oneOf(Object.values(MaterialRequestEditing))
				.required(tText('Geef aan of je wijzigingen aan het materiaal zal maken.')),
			geographicalUsage: mixed<MaterialRequestGeographicalUsage>()
				.oneOf(Object.values(MaterialRequestGeographicalUsage))
				.required(tText('Duid aan wat het geografisch gebruik van het materiaal zal zijn.')),
			timeUsage: mixed<MaterialRequestTimeUsage>()
				.oneOf(Object.values(MaterialRequestTimeUsage))
				.required(tText('Geef het geplande gebruik doorheen de tijd aan.')),
			copyrightDisplay: mixed<MaterialRequestCopyrightDisplay>()
				.oneOf(Object.values(MaterialRequestCopyrightDisplay))
				.required(tText('Geef op hoe je bronvermelding zal aanpakken.')),
		}) as Schema<MaterialRequestReuseSettings>;
	};
