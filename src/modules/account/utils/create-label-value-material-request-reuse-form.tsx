import {
	GET_MATERIAL_REQUEST_TRANSLATIONS_BY_COPYRIGHT,
	GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DISTRIBUTION_ACCESS,
	GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DISTRIBUTION_DIGITAL_ONLINE,
	GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DISTRIBUTION_TYPE,
	GET_MATERIAL_REQUEST_TRANSLATIONS_BY_GEOGRAPHICAL_USAGE,
	GET_MATERIAL_REQUEST_TRANSLATIONS_BY_INTENDED_USAGE,
	GET_MATERIAL_REQUEST_TRANSLATIONS_BY_MATERIAL_EDITING,
	GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TIME_USAGE,
} from '@material-requests/const';
import {
	type MaterialRequestCopyrightDisplay,
	type MaterialRequestDistributionAccess,
	type MaterialRequestDistributionDigitalOnline,
	type MaterialRequestDistributionType,
	type MaterialRequestEditing,
	type MaterialRequestGeographicalUsage,
	type MaterialRequestIntendedUsage,
	type MaterialRequestReuseForm,
	MaterialRequestTimeUsage,
} from '@material-requests/types';
import { tText } from '@shared/helpers/translate';
import { asDate, formatMediumDate } from '@shared/utils/dates';
import type { ReactNode } from 'react';

/**
 * This wil map almost all properties from the reuse form to a label value pair
 * It will skip all video settings like cuepoint and download quality since this has specific rendering
 * @param reuseForm
 */
export function createLabelValuePairMaterialRequestReuseForm(
	reuseForm: MaterialRequestReuseForm | undefined
): {
	label: string;
	value: ReactNode | string;
}[] {
	const materialRequestEntries: {
		label: string;
		value: ReactNode | string;
	}[] = [];

	if (reuseForm) {
		materialRequestEntries.push({
			label: tText('Bedoeld gebruik'),
			value: (
				<>
					{
						GET_MATERIAL_REQUEST_TRANSLATIONS_BY_INTENDED_USAGE()[
							reuseForm.intendedUsage as MaterialRequestIntendedUsage
						]
					}
					<br /> {reuseForm.intendedUsageDescription}
				</>
			),
		});

		materialRequestEntries.push({
			label: tText('Ontsluiting materiaal'),
			value:
				GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DISTRIBUTION_ACCESS()[
					reuseForm.distributionAccess as MaterialRequestDistributionAccess
				],
		});

		materialRequestEntries.push({
			label: tText('Type ontsluiting'),
			value: (
				<>
					{
						GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DISTRIBUTION_TYPE()[
							reuseForm.distributionType as MaterialRequestDistributionType
						]
					}
					{reuseForm.distributionTypeDigitalOnline && (
						<>
							<br />
							{
								GET_MATERIAL_REQUEST_TRANSLATIONS_BY_DISTRIBUTION_DIGITAL_ONLINE()[
									reuseForm.distributionTypeDigitalOnline as MaterialRequestDistributionDigitalOnline
								]
							}
						</>
					)}
					{reuseForm.distributionTypeOtherExplanation && (
						<>
							<br />
							reuseForm.distributionTypeOtherExplanation;
						</>
					)}
				</>
			),
		});

		materialRequestEntries.push({
			label: tText('Wijzigingen'),
			value:
				GET_MATERIAL_REQUEST_TRANSLATIONS_BY_MATERIAL_EDITING()[
					reuseForm.materialEditing as MaterialRequestEditing
				],
		});

		materialRequestEntries.push({
			label: tText('Geografisch hergebruik'),
			value: (
				<>
					{
						GET_MATERIAL_REQUEST_TRANSLATIONS_BY_GEOGRAPHICAL_USAGE()[
							reuseForm.geographicalUsage as MaterialRequestGeographicalUsage
						]
					}
					{reuseForm.geographicalUsageDescription && (
						<>
							<br />
							{reuseForm.geographicalUsageDescription}
						</>
					)}
				</>
			),
		});

		materialRequestEntries.push({
			label: tText('Gebruik doorheen de tijd'),
			value: (
				<>
					{
						GET_MATERIAL_REQUEST_TRANSLATIONS_BY_TIME_USAGE()[
							reuseForm.timeUsageType as MaterialRequestTimeUsage
						]
					}
					{reuseForm.timeUsageType === MaterialRequestTimeUsage.IN_TIME && (
						<>
							{': '}
							{formatMediumDate(asDate(reuseForm.timeUsageFrom))}
							{' - '}
							{formatMediumDate(asDate(reuseForm.timeUsageTo))}
						</>
					)}
				</>
			),
		});

		materialRequestEntries.push({
			label: tText('Bronvermelding'),
			value:
				GET_MATERIAL_REQUEST_TRANSLATIONS_BY_COPYRIGHT()[
					reuseForm.copyrightDisplay as MaterialRequestCopyrightDisplay
				],
		});
	}

	return materialRequestEntries;
}
