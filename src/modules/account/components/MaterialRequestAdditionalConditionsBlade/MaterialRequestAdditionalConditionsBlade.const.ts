import { MaterialRequestAdditionalConditionsType } from '@material-requests/types';
import type { CheckboxAccordionOption } from '@shared/components/CheckboxAccordion/CheckboxAccordion.types';
import { tText } from '@shared/helpers/translate';

export const MATERIAL_REQUEST_ADDITIONAL_CONDITIONS_OPTIONS =
	(): CheckboxAccordionOption<MaterialRequestAdditionalConditionsType>[] => {
		return [
			{
				label: tText(
					'modules/account/components/material-request-additional-conditions-blade/material-request-additional-conditions-blade___toestemming-rechthebbende'
				),
				value: MaterialRequestAdditionalConditionsType.PERMISSION_LICENSE_OWNER,
				description: tText(
					'modules/account/components/material-request-additional-conditions-blade/material-request-additional-conditions-blade___beschrijf-hier-welke-toestemming-de-aanvrager-moet-verkrijgen-van-de-rechthebbende'
				),
				placeholder: tText(
					'modules/account/components/material-request-additional-conditions-blade/material-request-additional-conditions-blade___beschrijf-de-voorwaarde'
				),
				maxLength: 500,
			},
			{
				label: tText(
					'modules/account/components/material-request-additional-conditions-blade/material-request-additional-conditions-blade___naamsvermelding'
				),
				value: MaterialRequestAdditionalConditionsType.ATTRIBUTION,
				description: tText(
					'modules/account/components/material-request-additional-conditions-blade/material-request-additional-conditions-blade___beschrijf-hier-hoe-de-aanvrager-de-naamsvermelding-moet-uitvoeren'
				),
				placeholder: tText(
					'modules/account/components/material-request-additional-conditions-blade/material-request-additional-conditions-blade___beschrijf-de-voorwaarde'
				),
				maxLength: 500,
			},
			{
				label: tText(
					'modules/account/components/material-request-additional-conditions-blade/material-request-additional-conditions-blade___betaling'
				),
				value: MaterialRequestAdditionalConditionsType.PAYMENT,
				description: tText(
					'modules/account/components/material-request-additional-conditions-blade/material-request-additional-conditions-blade___beschrijf-hier-welke-betaling-de-aanvrager-moet-uitvoeren'
				),
				placeholder: tText(
					'modules/account/components/material-request-additional-conditions-blade/material-request-additional-conditions-blade___beschrijf-de-voorwaarde'
				),
				maxLength: 500,
			},
			{
				label: tText(
					'modules/account/components/material-request-additional-conditions-blade/material-request-additional-conditions-blade___extra-gebruiksbeperking'
				),
				value: MaterialRequestAdditionalConditionsType.EXTRA_USE_LIMITATION,
				description: tText(
					'modules/account/components/material-request-additional-conditions-blade/material-request-additional-conditions-blade___beschrijf-hier-welke-extra-gebruiksbeperkingen-van-toepassing-zijn'
				),
				placeholder: tText(
					'modules/account/components/material-request-additional-conditions-blade/material-request-additional-conditions-blade___beschrijf-de-voorwaarde'
				),
				maxLength: 500,
			},
		];
	};
