import type { SelectOption } from '@meemoo/react-components';
import { FILTER_LABEL_VALUE_DELIMITER } from '@visitor-space/types';
import { SearchPageMediaType } from '@shared/types/ie-objects';
import { tText } from '@shared/helpers/translate';
import { compact } from 'lodash-es';

export enum RightsLabel {
	PUBLIC_DOMAIN = 'public-domain',
	COPYRIGHT_UNDETERMINED = 'copyright-undetermined',
	CC0 = 'cc0',
	NO_COPYRIGHT_CONTRACTUAL_RESTRICTIONS = 'no-copyright-contractual-restrictions',
	CC_BY = 'cc-by',
	CC_BY_NC_ND = 'cc-by-nc-nd',
	CC_BY_SA = 'cc-by-sa',
	CC_BY_NC = 'cc-by-nc',
	IN_COPYRIGHT = 'in-copyright',
	COPYRIGHT_NOT_EVALUATED = 'copyright-not-evaluated',
	ORPHAN_WORK_EU = 'orphan-work-eu',
	RIGHTS_HOLDER_UNLOCATABLE = 'rights-holder-unlocatable',
}

export const RIGHTS_LABELS_FOR_NEWSPAPERS = [
	RightsLabel.PUBLIC_DOMAIN,
	RightsLabel.COPYRIGHT_UNDETERMINED,
];

export const RIGHTS_LABELS_BY_REUSABILITY: Record<string, RightsLabel[]> = {
	'freely-reusable': [RightsLabel.PUBLIC_DOMAIN, RightsLabel.CC0],
	'reusable-with-conditions': [
		RightsLabel.NO_COPYRIGHT_CONTRACTUAL_RESTRICTIONS,
		RightsLabel.CC_BY,
		RightsLabel.CC_BY_NC_ND,
		RightsLabel.CC_BY_SA,
		RightsLabel.CC_BY_NC,
	],
	'possibly-reusable': [
		RightsLabel.COPYRIGHT_UNDETERMINED,
		RightsLabel.IN_COPYRIGHT,
		RightsLabel.COPYRIGHT_NOT_EVALUATED,
		RightsLabel.ORPHAN_WORK_EU,
		RightsLabel.RIGHTS_HOLDER_UNLOCATABLE,
	],
};

export const RIGHTS_OPTIONS = (): SelectOption[] => [
	{
		label: tText('modules/visitor-space/const/rights-filter___publiek-domein'),
		value: RightsLabel.PUBLIC_DOMAIN,
	},
	{
		label: tText(
			'modules/visitor-space/const/rights-filter___auteursrechtelijke-bescherming-niet-bepaald'
		),
		value: RightsLabel.COPYRIGHT_UNDETERMINED,
	},
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

export const getRightsOptions = ({
	mediaType,
	reusabilityValues,
}: {
	mediaType?: string | null;
	reusabilityValues?: (string | null)[] | string | null;
} = {}): SelectOption[] => {
	const allOptions = RIGHTS_OPTIONS();
	const valuesArray = Array.isArray(reusabilityValues)
		? reusabilityValues
		: compact([reusabilityValues]);
	const allowedByReusability = compact(valuesArray).flatMap((value) => {
		const key = value.split(FILTER_LABEL_VALUE_DELIMITER)[0];
		return RIGHTS_LABELS_BY_REUSABILITY[key] || [];
	});
	const allowedByMediaType =
		mediaType === SearchPageMediaType.Newspaper ? RIGHTS_LABELS_FOR_NEWSPAPERS : [];

	return allOptions.filter((option) => {
		const value = option.value as RightsLabel;
		const matchesReusability =
			allowedByReusability.length === 0 || allowedByReusability.includes(value);
		const matchesMediaType = allowedByMediaType.length === 0 || allowedByMediaType.includes(value);
		return matchesReusability && matchesMediaType;
	});
};
