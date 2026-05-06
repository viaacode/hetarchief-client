import { MaterialRequestAdditionalConditionsType } from '@material-requests/types';
import type { CheckboxAccordionOption } from '@shared/components/CheckboxAccordion/CheckboxAccordion.types';
import { tText } from '@shared/helpers/translate';

export const MATERIAL_REQUEST_ADDITIONAL_CONDITIONS_OPTIONS =
	(): CheckboxAccordionOption<MaterialRequestAdditionalConditionsType>[] => {
		return [
			{
				label: tText('Toestemming rechthebbende'),
				value: MaterialRequestAdditionalConditionsType.PERMISSION_LICENSE_OWNER,
				description: tText(
					'Beschrijf hier welke toestemming de aanvrager moet verkrijgen van de rechthebbende.'
				),
				placeholder: tText('Beschrijf de voorwaarde...'),
				maxLength: 500,
			},
			{
				label: tText('Naamsvermelding'),
				value: MaterialRequestAdditionalConditionsType.ATTRIBUTION,
				description: tText('Beschrijf hier hoe de aanvrager de naamsvermelding moet uitvoeren.'),
				placeholder: tText('Beschrijf de voorwaarde...'),
				maxLength: 500,
			},
			{
				label: tText('Betaling'),
				value: MaterialRequestAdditionalConditionsType.PAYMENT,
				description: tText('Beschrijf hier welke betaling de aanvrager moet uitvoeren.'),
				placeholder: tText('Beschrijf de voorwaarde...'),
				maxLength: 500,
			},
			{
				label: tText('Extra gebruiksbeperking'),
				value: MaterialRequestAdditionalConditionsType.EXTRA_USE_LIMITATION,
				description: tText('Beschrijf hier welke extra gebruiksbeperkingen van toepassing zijn.'),
				placeholder: tText('Beschrijf de voorwaarde...'),
				maxLength: 500,
			},
		];
	};
