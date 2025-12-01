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
	MaterialRequestTimeUsage,
} from '@material-requests/types';
import { tText } from '@shared/helpers/translate';
import { parseISO } from 'date-fns';
import { mixed, number, object, type Schema, string } from 'yup';

export type MaterialRequestReuseSettings = Pick<
	MaterialRequestReuseForm,
	| 'representationId'
	| 'startTime'
	| 'endTime'
	| 'downloadQuality'
	| 'intendedUsageDescription'
	| 'intendedUsage'
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
			startTime: number().when('representationId', ([representationId]) => {
				if (representationId) {
					return number().required(tText('Video start knippunt - error verplicht'));
				}
				return number().optional();
			}),
			endTime: number().when(['representationId', 'startTime'], ([representationId, startTime]) => {
				if (representationId) {
					return number()
						.required(tText('Video start knippunt - error verplicht'))
						.moreThan(
							startTime,
							tText('Video start knippunt - error eindtijd gelijk aan of voor starttijd')
						);
				}
				return number().optional();
			}),
			downloadQuality: mixed<MaterialRequestDownloadQuality>()
				.oneOf(Object.values(MaterialRequestDownloadQuality))
				.required(tText('Downloadkwaliteit - error verplicht')),
			intendedUsage: mixed<MaterialRequestIntendedUsage>()
				.oneOf(Object.values(MaterialRequestIntendedUsage))
				.required(tText('Bedoeld gebruik - error verplicht')),
			intendedUsageDescription: string()
				.required(tText('Bedoeld gebruik beschrijving - error verplicht'))
				.max(300),
			distributionAccess: mixed<MaterialRequestDistributionAccess>()
				.oneOf(Object.values(MaterialRequestDistributionAccess))
				.required(tText('Ontsluiting materiaal - error verplicht')),
			distributionType: mixed<MaterialRequestDistributionType>()
				.oneOf(Object.values(MaterialRequestDistributionType))
				.required(tText('Type ontsluiting - error verplicht')),
			distributionTypeDigitalOnline: mixed<MaterialRequestDistributionDigitalOnline>()
				.oneOf(Object.values(MaterialRequestDistributionDigitalOnline))
				.when('distributionType', ([value]) => {
					if (value === MaterialRequestDistributionType.DIGITAL_ONLINE) {
						return mixed().required(
							tText(
								'Type ontsluiting - Digitale ontsluiting via netwerkverbinding - error verplicht'
							)
						);
					}
					return mixed().optional();
				}),
			distributionTypeOtherExplanation: string().when('distributionType', ([value]) => {
				if (value === MaterialRequestDistributionType.OTHER) {
					return string().required(tText('Type ontsluiting - Andere - error verplicht'));
				}
				return string().optional();
			}),
			materialEditing: mixed<MaterialRequestEditing>()
				.oneOf(Object.values(MaterialRequestEditing))
				.required(tText('Wijziging materiaal - error verplicht')),
			geographicalUsage: mixed<MaterialRequestGeographicalUsage>()
				.oneOf(Object.values(MaterialRequestGeographicalUsage))
				.required(tText('Geografisch gebruik - error verplicht')),
			timeUsageType: mixed<MaterialRequestTimeUsage>()
				.oneOf(Object.values(MaterialRequestTimeUsage))
				.required(tText('Gebruik in de tijd - error verplicht')),
			timeUsageFrom: string().when('timeUsageType', ([value]) => {
				if (value === MaterialRequestTimeUsage.IN_TIME) {
					return string().required(tText('Gebruik in de tijd - startdatum - error verplicht'));
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
						.required(tText('Gebruik in de tijd - einddatum - error verplicht'))
						.test(
							'to-date-after-start-date',
							tText('Gebruik in de tijd - einddatum - error einddatum voor startdatum'),
							(timeUsageTo) =>
								timeUsageFrom && timeUsageTo && parseISO(timeUsageFrom) < parseISO(timeUsageTo)
						);
				}
			),
			copyrightDisplay: mixed<MaterialRequestCopyrightDisplay>()
				.oneOf(Object.values(MaterialRequestCopyrightDisplay))
				.required(tText('Bronvermelding - error verplicht')),
		}) as Schema<MaterialRequestReuseSettings>;
	};
