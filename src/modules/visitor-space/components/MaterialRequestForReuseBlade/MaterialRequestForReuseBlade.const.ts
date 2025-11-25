import {
	MaterialRequestCopyrightDisplay,
	MaterialRequestDistributionAccess,
	MaterialRequestDistributionDigitalOnline,
	MaterialRequestDistributionType,
	MaterialRequestDownloadQuality,
	MaterialRequestEditing,
	MaterialRequestExploitation,
	MaterialRequestGeographicalUsage,
	type MaterialRequestReuseForm,
	MaterialRequestTimeUsage,
} from '@material-requests/types';
import { tText } from '@shared/helpers/translate';
import { parseISO } from 'date-fns';
import { mixed, number, object, type Schema, string } from 'yup';

export type MaterialRequestReuseSettings = Pick<
	MaterialRequestReuseForm,
	| 'startTime'
	| 'endTime'
	| 'downloadQuality'
	| 'intendedUsage'
	| 'exploitation'
	| 'distributionAccess'
	| 'distributionType'
	| 'distributionTypeDigitalOnline'
	| 'distributionTypeOtherExplanation'
	| 'materialEditing'
	| 'geographicalUsage'
	| 'timeUsageType'
	| 'timeUsageFrom'
	| 'timeUsageTo'
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
			distributionTypeDigitalOnline: mixed<MaterialRequestDistributionDigitalOnline>()
				.oneOf(Object.values(MaterialRequestDistributionDigitalOnline))
				.when('distributionType', ([value]) => {
					if (value === MaterialRequestDistributionType.DIGITAL_ONLINE) {
						return mixed().required(
							tText('Duid aan of het over analoge of digitale verspreiding van het materiaal gaat.')
						);
					}
					return mixed().optional();
				}),
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
			timeUsageType: mixed<MaterialRequestTimeUsage>()
				.oneOf(Object.values(MaterialRequestTimeUsage))
				.required(tText('Geef het geplande gebruik doorheen de tijd aan.')),
			timeUsageFrom: string().when('timeUsageType', ([value]) => {
				if (value === MaterialRequestTimeUsage.IN_TIME) {
					return string().required(tText('Geef het geplande gebruik doorheen de tijd aan.'));
				}
				return string().optional();
			}),
			timeUsageTo: string().when(
				['timeUsageType', 'timeUsageFrom'],
				([timeUsageType, timeUsageFrom]) => {
					if (timeUsageType !== MaterialRequestTimeUsage.IN_TIME) {
						return string().optional();
					}

					return string()
						.required(tText('Geef het geplande gebruik doorheen de tijd aan.'))
						.test(
							'to-date-after-start-date',
							tText('De einddatum moet groter zijn dan de startdatum'),
							(timeUsageTo) =>
								timeUsageFrom && timeUsageTo && parseISO(timeUsageFrom) < parseISO(timeUsageTo)
						);
				}
			),
			copyrightDisplay: mixed<MaterialRequestCopyrightDisplay>()
				.oneOf(Object.values(MaterialRequestCopyrightDisplay))
				.required(tText('Geef op hoe je bronvermelding zal aanpakken.')),
		}) as Schema<MaterialRequestReuseSettings>;
	};
