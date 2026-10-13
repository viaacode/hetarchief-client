import { isAudioVideoType } from '@meemoo/admin-core-ui/admin';
import Icon from '@shared/components/Icon/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import {
	type HetArchiefIeObject,
	HetArchiefIeObjectLicense,
	type HetArchiefIeObjectRightsInfo,
} from '@viaa/avo2-types';
import { compact } from 'es-toolkit/compat';
import type { ReactNode } from 'react';

interface RightsCategoryConfig {
	labelValue: string;
	icon: IconNamesLight;
}

enum RightsText {
	NO_INFO = 'geen rechteninformatie',
	UNDETERMINED = 'bescherming niet bepaald',
	NOT_FOUND = 'rechthebbende niet vindbaar',
	UNLOCALISED = 'niet lokaliseerbaar',
	UNIDENTIFIED = 'niet identificeerbaar',
	PROTECTED = 'auteursrechtelijk beschermd',
	COMPLETE_FROM_KG = 'volledig overnemen uit kg',
	INDIVIDUAL_NAMED = 'geindividualiseerde naamsvermelding',
	COPYRIGHT_ICON = '©',
	COPYRIGHT_ICON_TEXT = '(c)',
	CC0 = 'cc0',
	CREATIVE_COMMONS = 'creativecommons.org/publicdomain',
}

// Objects with at least their metadata published get a rights label, even without a usage label
const METADATA_LICENSES: ReadonlySet<HetArchiefIeObjectLicense> = new Set([
	HetArchiefIeObjectLicense.PUBLIEK_METADATA_ALL,
	HetArchiefIeObjectLicense.PUBLIEK_METADATA_LTD,
	HetArchiefIeObjectLicense.INTRA_CP_METADATA_ALL,
]);

const GET_RIGHTS_CATEGORY_CONFIGS = (): Readonly<Record<string, RightsCategoryConfig>> => ({
	'creativecommons.org/publicdomain/zero': {
		labelValue: tText('modules/visitor-space/const/rights-filter___cc0'),
		icon: IconNamesLight.CopyrightPublicDomain,
	},
	'rightsstatements.org/page/cne': {
		labelValue: tText(
			'modules/visitor-space/const/rights-filter___auteursrechtelijke-bescherming-niet-bepaald'
		),
		icon: IconNamesLight.CopyrightUndetermined,
	},
	'rightsstatements.org/page/inc-ruu': {
		labelValue: tText(
			'modules/visitor-space/const/rights-filter___rechthebbenden-niet-lokaliseerbaar-of-niet-identificeerbaar'
		),
		icon: IconNamesLight.CopyrightUndetermined,
	},
	'rightsstatements.org/page/inc': {
		labelValue: tText('modules/visitor-space/const/rights-filter___auteursrechtelijk-beschermd'),
		icon: IconNamesLight.CopyrightProtected,
	},
});

function normalizeRightsValue(value: string): string {
	return value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();
}

function getRightsSearchText(rightsInfo?: HetArchiefIeObjectRightsInfo | null): string {
	return normalizeRightsValue(
		compact([
			rightsInfo?.reuseLabel,
			rightsInfo?.reuseCategoryUrl,
			rightsInfo?.reuseCategoryId,
			rightsInfo?.reuseCategoryLabel,
			rightsInfo?.reuseCategoryGroup,
		]).join(' ')
	);
}

function getRightsCategoryConfig(
	rightsInfo?: HetArchiefIeObjectRightsInfo | null
): RightsCategoryConfig | null {
	const rightsUrl = normalizeRightsValue(
		rightsInfo?.reuseCategoryUrl || rightsInfo?.reuseCategoryId || ''
	);

	return (
		Object.entries(GET_RIGHTS_CATEGORY_CONFIGS()).find(([urlPart]) =>
			rightsUrl.includes(urlPart)
		)?.[1] || null
	);
}

export function getIeObjectAvRightsUrl(
	rightsInfo?: HetArchiefIeObjectRightsInfo | null
): string | undefined {
	if (getRightsSearchText(rightsInfo).includes(RightsText.NO_INFO)) {
		return undefined;
	}

	return rightsInfo?.reuseCategoryUrl || rightsInfo?.reuseCategoryId || undefined;
}

export function getIeObjectAvRightsLabel(
	rightsInfo?: HetArchiefIeObjectRightsInfo | null
): string | null {
	const rightsText = getRightsSearchText(rightsInfo);
	const rightsCategoryConfig = getRightsCategoryConfig(rightsInfo);

	if (!rightsText) {
		return null;
	}

	if (
		rightsText.includes(RightsText.COPYRIGHT_ICON) ||
		rightsText.includes(RightsText.COPYRIGHT_ICON_TEXT)
	) {
		return rightsInfo?.reuseLabel || null;
	}

	if (rightsCategoryConfig) {
		return rightsCategoryConfig.labelValue;
	}

	if (rightsText.includes(RightsText.CC0) || rightsText.includes(RightsText.CREATIVE_COMMONS)) {
		return tText('modules/visitor-space/const/rights-filter___cc0');
	}

	if (rightsText.includes(RightsText.UNDETERMINED)) {
		return tText(
			'modules/visitor-space/const/rights-filter___auteursrechtelijke-bescherming-niet-bepaald'
		);
	}

	if (
		rightsText.includes(RightsText.NOT_FOUND) ||
		rightsText.includes(RightsText.UNLOCALISED) ||
		rightsText.includes(RightsText.UNIDENTIFIED)
	) {
		return tText(
			'modules/visitor-space/const/rights-filter___rechthebbenden-niet-lokaliseerbaar-of-niet-identificeerbaar'
		);
	}

	if (
		rightsText.includes(RightsText.PROTECTED) ||
		rightsText.includes(RightsText.COMPLETE_FROM_KG) ||
		rightsText.includes(RightsText.INDIVIDUAL_NAMED)
	) {
		return tText('modules/visitor-space/const/rights-filter___auteursrechtelijk-beschermd');
	}

	return rightsInfo?.reuseCategoryLabel || rightsInfo?.reuseLabel || null;
}

export function getIeObjectAvRightsIcon(
	rightsInfo?: HetArchiefIeObjectRightsInfo | null
): ReactNode | null {
	const rightsText = getRightsSearchText(rightsInfo);
	const rightsCategoryConfig = getRightsCategoryConfig(rightsInfo);

	if (!rightsText || rightsText.includes(RightsText.NO_INFO)) {
		return null;
	}

	if (rightsCategoryConfig) {
		return <Icon name={rightsCategoryConfig.icon} aria-hidden />;
	}

	if (rightsText.includes(RightsText.CC0) || rightsText.includes(RightsText.CREATIVE_COMMONS)) {
		return <Icon name={IconNamesLight.CopyrightPublicDomain} aria-hidden />;
	}

	if (
		rightsText.includes(RightsText.UNDETERMINED) ||
		rightsText.includes(RightsText.NOT_FOUND) ||
		rightsText.includes(RightsText.UNLOCALISED) ||
		rightsText.includes(RightsText.UNIDENTIFIED)
	) {
		return <Icon name={IconNamesLight.CopyrightUndetermined} aria-hidden />;
	}

	if (
		rightsText.includes(RightsText.PROTECTED) ||
		rightsText.includes(RightsText.COMPLETE_FROM_KG) ||
		rightsText.includes(RightsText.INDIVIDUAL_NAMED) ||
		rightsText.includes(RightsText.COPYRIGHT_ICON) ||
		rightsText.includes(RightsText.COPYRIGHT_ICON_TEXT)
	) {
		return <Icon name={IconNamesLight.CopyrightProtected} aria-hidden />;
	}

	return null;
}

export function getIeObjectAvRights(
	ieObject: HetArchiefIeObject
): { label: string; icon: ReactNode | null; url?: string } | null {
	if (!isAudioVideoType(ieObject.dctermsFormat)) {
		return null;
	}

	const rightsInfo = ieObject.rightsInfo || null;
	const label = getIeObjectAvRightsLabel(rightsInfo);

	if (label) {
		return {
			label,
			icon: getIeObjectAvRightsIcon(rightsInfo),
			url: getIeObjectAvRightsUrl(rightsInfo),
		};
	}

	if (ieObject.licenses.some((license) => METADATA_LICENSES.has(license))) {
		// Placeholder label: neither a link nor an icon
		return { label: tText('deze informatie wordt verder verzameld'), icon: null };
	}

	return null;
}
