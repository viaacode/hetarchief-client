import type { SelectOption } from '@meemoo/react-components';
import { tText } from '@shared/helpers/translate';
import { compact, uniqBy } from 'lodash-es';

export enum RightsLabel {
	PUBLIC_DOMAIN = 'https://creativecommons.org/publicdomain/mark/1.0/',
	COPYRIGHT_UNDETERMINED = 'https://rightsstatements.org/page/UND/1.0/',
	CC0 = 'https://creativecommons.org/publicdomain/zero/1.0/',
	NO_COPYRIGHT_CONTRACTUAL_RESTRICTIONS = 'https://rightsstatements.org/page/NoC-CR/1.0/',
	CC_BY = 'https://creativecommons.org/licenses/by/4.0/',
	CC_BY_NC_ND = 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
	CC_BY_SA = 'https://creativecommons.org/licenses/by-sa/4.0/',
	CC_BY_NC = 'https://creativecommons.org/licenses/by-nc/4.0/',
	IN_COPYRIGHT = 'https://rightsstatements.org/page/InC/1.0/',
	COPYRIGHT_NOT_EVALUATED = 'https://rightsstatements.org/page/CNE/1.0/',
	ORPHAN_WORK_EU = 'https://rightsstatements.org/page/InC-OW-EU/1.0/',
	RIGHTS_HOLDER_UNLOCATABLE = 'https://rightsstatements.org/page/InC-RUU/1.0/',
}

const RIGHTS_OPTIONS = (): SelectOption[] => [
	{
		// Public domain option that applies to both video/audio and newspapers
		label: tText('modules/visitor-space/const/rights-filter___publiek-domein'),
		value: RightsLabel.PUBLIC_DOMAIN,
	},
	{
		// Copyright undetermined option that applies to both video/audio and newspapers
		label: tText(
			'modules/visitor-space/const/rights-filter___auteursrechtelijke-bescherming-niet-bepaald'
		),
		value: RightsLabel.COPYRIGHT_UNDETERMINED,
	},

	// Other licenses only apply to audio and video objects, not to newspapers
	{
		label: tText('modules/visitor-space/const/rights-filter___cc0'),
		value: RightsLabel.CC0,
	},
	{
		label: tText(
			'modules/visitor-space/const/rights-filter___niet-auteursrechtelijk-beschermd-met-contractuele-voorwaarden'
		),
		value: RightsLabel.NO_COPYRIGHT_CONTRACTUAL_RESTRICTIONS,
	},
	{
		label: tText('modules/visitor-space/const/rights-filter___cc-by'),
		value: RightsLabel.CC_BY,
	},
	{
		label: tText('modules/visitor-space/const/rights-filter___cc-by-nc-nd'),
		value: RightsLabel.CC_BY_NC_ND,
	},
	{
		label: tText('modules/visitor-space/const/rights-filter___cc-by-sa'),
		value: RightsLabel.CC_BY_SA,
	},
	{
		label: tText('modules/visitor-space/const/rights-filter___cc-by-nc'),
		value: RightsLabel.CC_BY_NC,
	},
	{
		label: tText('modules/visitor-space/const/rights-filter___auteursrechtelijk-beschermd'),
		value: RightsLabel.IN_COPYRIGHT,
	},
	{
		label: tText(
			'modules/visitor-space/const/rights-filter___auteursrechtelijke-status-niet-geevalueerd'
		),
		value: RightsLabel.COPYRIGHT_NOT_EVALUATED,
	},
	{
		label: tText('modules/visitor-space/const/rights-filter___eu-verweesd-werk'),
		value: RightsLabel.ORPHAN_WORK_EU,
	},
	{
		label: tText(
			'modules/visitor-space/const/rights-filter___rechthebbenden-niet-lokaliseerbaar-of-niet-identificeerbaar'
		),
		value: RightsLabel.RIGHTS_HOLDER_UNLOCATABLE,
	},
];

export const getRightsLabel = (value: string | undefined): string | undefined => {
	return RIGHTS_OPTIONS().find((option) => option.value === value)?.label;
};

export const getRightsOptions = (
	selectedReusabilityValues: RightsLabel[],
	rightsOptionsFromElasticsearchAggregates: RightsLabel[]
): SelectOption[] => {
	const allOptions = RIGHTS_OPTIONS();

	const availableOptions = allOptions.filter((option) => {
		if (!option.value) {
			return false;
		}
		return rightsOptionsFromElasticsearchAggregates.includes(option.value as RightsLabel);
	});
	const selectedOptions = selectedReusabilityValues.map((value) => {
		return allOptions.find((option) => option.value === value);
	});
	return uniqBy(compact([...selectedOptions, ...availableOptions]), (option) => option.value);
};
