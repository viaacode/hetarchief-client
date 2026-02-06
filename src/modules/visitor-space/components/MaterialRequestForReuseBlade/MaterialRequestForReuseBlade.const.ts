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
	MaterialRequestReuseFormKey,
	MaterialRequestTimeUsage,
} from '@material-requests/types';
import { tText } from '@shared/helpers/translate';
import { parseISO } from 'date-fns';
import { mixed, number, object, type Schema, string } from 'yup';

export const MATERIAL_REQUEST_REUSE_FORM_VALIDATION_SCHEMA =
	(): Schema<MaterialRequestReuseForm> => {
		return object<MaterialRequestReuseForm>().shape({
			[MaterialRequestReuseFormKey.representationId]: string().optional(),
			[MaterialRequestReuseFormKey.startTime]: number().when(
				MaterialRequestReuseFormKey.representationId,
				([representationId]) => {
					if (representationId) {
						return number().required(
							tText(
								'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___video-start-knippunt-error-verplicht'
							)
						);
					}
					return number().defined();
				}
			),
			[MaterialRequestReuseFormKey.endTime]: number().when(
				[MaterialRequestReuseFormKey.representationId, MaterialRequestReuseFormKey.startTime],
				([representationId, startTime]) => {
					if (representationId) {
						return number()
							.required(
								tText(
									'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___video-start-knippunt-error-verplicht'
								)
							)
							.moreThan(
								startTime,
								tText(
									'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___video-start-knippunt-error-eindtijd-gelijk-aan-of-voor-starttijd'
								)
							);
					}
					return number().optional();
				}
			),
			[MaterialRequestReuseFormKey.downloadQuality]: mixed<MaterialRequestDownloadQuality>()
				.oneOf(Object.values(MaterialRequestDownloadQuality))
				.required(
					tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___downloadkwaliteit-error-verplicht'
					)
				),
			[MaterialRequestReuseFormKey.intendedUsage]: mixed<MaterialRequestIntendedUsage>()
				.oneOf(Object.values(MaterialRequestIntendedUsage))
				.required(
					tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___bedoeld-gebruik-error-verplicht'
					)
				),
			[MaterialRequestReuseFormKey.intendedUsageDescription]: string()
				.required(
					tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___bedoeld-gebruik-beschrijving-error-verplicht'
					)
				)
				.max(300),
			[MaterialRequestReuseFormKey.distributionAccess]: mixed<MaterialRequestDistributionAccess>()
				.oneOf(Object.values(MaterialRequestDistributionAccess))
				.required(
					tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___ontsluiting-materiaal-error-verplicht'
					)
				),
			[MaterialRequestReuseFormKey.distributionType]: mixed<MaterialRequestDistributionType>()
				.oneOf(Object.values(MaterialRequestDistributionType))
				.required(
					tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___type-ontsluiting-error-verplicht'
					)
				),
			[MaterialRequestReuseFormKey.distributionTypeDigitalOnline]:
				mixed<MaterialRequestDistributionDigitalOnline>()
					.oneOf(Object.values(MaterialRequestDistributionDigitalOnline))
					.when(MaterialRequestReuseFormKey.distributionType, ([value]) => {
						if (value === MaterialRequestDistributionType.DIGITAL_ONLINE) {
							return mixed().required(
								tText(
									'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___type-ontsluiting-digitale-ontsluiting-via-netwerkverbinding-error-verplicht'
								)
							);
						}
						return mixed().optional();
					}),
			[MaterialRequestReuseFormKey.distributionTypeOtherExplanation]: string().when(
				MaterialRequestReuseFormKey.distributionType,
				([value]) => {
					if (value === MaterialRequestDistributionType.OTHER) {
						return string().required(
							tText(
								'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___type-ontsluiting-andere-error-verplicht'
							)
						);
					}
					return string().optional();
				}
			),
			[MaterialRequestReuseFormKey.materialEditing]: mixed<MaterialRequestEditing>()
				.oneOf(Object.values(MaterialRequestEditing))
				.required(
					tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___wijziging-materiaal-error-verplicht'
					)
				),
			[MaterialRequestReuseFormKey.geographicalUsage]: mixed<MaterialRequestGeographicalUsage>()
				.oneOf(Object.values(MaterialRequestGeographicalUsage))
				.required(
					tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___geografisch-gebruik-error-verplicht'
					)
				),
			[MaterialRequestReuseFormKey.geographicalUsageDescription]: string()
				.when(MaterialRequestReuseFormKey.geographicalUsage, ([_value]) => {
					// Wait for response Philip: https://studiohyperdrive.slack.com/archives/C027HPM6SCD/p1770137111507109
					// if (_value === MaterialRequestGeographicalUsage.NOT_COMPLETELY_LOCAL) {
					// 	return string().required(tText('geographisch-gebruik-berschrijving-error-verplicht'));
					// }
					return string().optional();
				})
				.required(),
			[MaterialRequestReuseFormKey.timeUsageType]: mixed<MaterialRequestTimeUsage>()
				.oneOf(Object.values(MaterialRequestTimeUsage))
				.required(
					tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___gebruik-in-de-tijd-error-verplicht'
					)
				),
			[MaterialRequestReuseFormKey.timeUsageFrom]: string().when(
				MaterialRequestReuseFormKey.timeUsageType,
				([value]) => {
					if (value === MaterialRequestTimeUsage.IN_TIME) {
						return string().required(
							tText(
								'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___gebruik-in-de-tijd-startdatum-error-verplicht'
							)
						);
					}
					return string().optional();
				}
			),
			[MaterialRequestReuseFormKey.timeUsageTo]: string().when(
				[MaterialRequestReuseFormKey.timeUsageType, MaterialRequestReuseFormKey.timeUsageFrom],
				([timeUsageType, timeUsageFrom]) => {
					if (timeUsageType !== MaterialRequestTimeUsage.IN_TIME) {
						return string().optional();
					}

					return string()
						.required(
							tText(
								'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___gebruik-in-de-tijd-einddatum-error-verplicht'
							)
						)
						.test(
							'to-date-after-start-date',
							tText(
								'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___gebruik-in-de-tijd-einddatum-error-einddatum-voor-startdatum'
							),
							(timeUsageTo) =>
								timeUsageFrom && timeUsageTo && parseISO(timeUsageFrom) < parseISO(timeUsageTo)
						);
				}
			),
			[MaterialRequestReuseFormKey.copyrightDisplay]: mixed<MaterialRequestCopyrightDisplay>()
				.oneOf(Object.values(MaterialRequestCopyrightDisplay))
				.required(
					tText(
						'modules/visitor-space/components/material-request-for-reuse-blade/material-request-for-reuse-blade___bronvermelding-error-verplicht'
					)
				),
		}) as Schema<MaterialRequestReuseForm>;
	};
