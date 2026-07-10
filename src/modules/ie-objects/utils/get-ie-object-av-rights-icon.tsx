import type { IeObjectRightsInfo } from '@ie-objects/ie-objects.types';
import Icon from '@shared/components/Icon/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { compact } from 'es-toolkit/compat';
import type { ReactNode } from 'react';

interface RightsCategoryConfig {
	labelValue: string;
	fallbackLabel: string;
	icon: IconNamesLight;
}

const GET_RIGHTS_CATEGORY_CONFIGS = (): Readonly<Record<string, RightsCategoryConfig>> => ({
	'creativecommons.org/publicdomain/zero': {
		labelValue: tText('modules/visitor-space/const/rights-filter___cc0'),
		fallbackLabel: 'CC0',
		icon: IconNamesLight.CopyrightPublicDomain,
	},
	'rightsstatements.org/page/cne': {
		labelValue: tText(
			'modules/visitor-space/const/rights-filter___auteursrechtelijke-bescherming-niet-bepaald'
		),
		fallbackLabel: 'Auteursrechtelijke bescherming niet bepaald',
		icon: IconNamesLight.CopyrightUndetermined,
	},
	'rightsstatements.org/page/inc-ruu': {
		labelValue: tText(
			'modules/visitor-space/const/rights-filter___rechthebbenden-niet-lokaliseerbaar-of-niet-identificeerbaar'
		),
		fallbackLabel: 'Rechthebbenden niet lokaliseerbaar of niet identificeerbaar',
		icon: IconNamesLight.CopyrightUndetermined,
	},
	'rightsstatements.org/page/inc': {
		labelValue: tText('modules/visitor-space/const/rights-filter___auteursrechtelijk-beschermd'),
		fallbackLabel: 'Auteursrechtelijk beschermd',
		icon: IconNamesLight.CopyrightProtected,
	},
});

function normalizeRightsValue(value: string): string {
	return value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();
}

function getRightsSearchText(rightsInfo?: IeObjectRightsInfo | null): string {
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
	rightsInfo?: IeObjectRightsInfo | null
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

function getRightsCategoryLabel(config: RightsCategoryConfig): string {
	return config.labelValue || config.fallbackLabel;
}

export function getIeObjectAvRightsUrl(rightsInfo?: IeObjectRightsInfo | null): string | undefined {
	if (getRightsSearchText(rightsInfo).includes('geen rechteninformatie')) {
		return undefined;
	}

	return rightsInfo?.reuseCategoryUrl || rightsInfo?.reuseCategoryId || undefined;
}

export function getIeObjectAvRightsLabel(rightsInfo?: IeObjectRightsInfo | null): string | null {
	const rightsText = getRightsSearchText(rightsInfo);
	const rightsCategoryConfig = getRightsCategoryConfig(rightsInfo);

	if (!rightsText) {
		return null;
	}

	if (rightsText.includes('©') || rightsText.includes('(c)')) {
		return rightsInfo?.reuseLabel || null;
	}

	if (rightsCategoryConfig) {
		return getRightsCategoryLabel(rightsCategoryConfig);
	}

	if (rightsText.includes('cc0') || rightsText.includes('creativecommons.org/publicdomain')) {
		return tText('modules/visitor-space/const/rights-filter___cc0');
	}

	if (rightsText.includes('bescherming niet bepaald')) {
		return tText(
			'modules/visitor-space/const/rights-filter___auteursrechtelijke-bescherming-niet-bepaald'
		);
	}

	if (
		rightsText.includes('rechthebbende niet vindbaar') ||
		rightsText.includes('niet lokaliseerbaar') ||
		rightsText.includes('niet identificeerbaar')
	) {
		return tText(
			'modules/visitor-space/const/rights-filter___rechthebbenden-niet-lokaliseerbaar-of-niet-identificeerbaar'
		);
	}

	if (
		rightsText.includes('auteursrechtelijk beschermd') ||
		rightsText.includes('volledig overnemen uit kg') ||
		rightsText.includes('geindividualiseerde naamsvermelding')
	) {
		return tText('modules/visitor-space/const/rights-filter___auteursrechtelijk-beschermd');
	}

	return rightsInfo?.reuseCategoryLabel || rightsInfo?.reuseLabel || null;
}

export function getIeObjectAvRightsIcon(rightsInfo?: IeObjectRightsInfo | null): ReactNode | null {
	const rightsText = getRightsSearchText(rightsInfo);
	const rightsCategoryConfig = getRightsCategoryConfig(rightsInfo);

	if (!rightsText || rightsText.includes('geen rechteninformatie')) {
		return null;
	}

	if (rightsCategoryConfig) {
		return <Icon name={rightsCategoryConfig.icon} aria-hidden />;
	}

	if (rightsText.includes('cc0') || rightsText.includes('creativecommons.org/publicdomain')) {
		return <Icon name={IconNamesLight.CopyrightPublicDomain} aria-hidden />;
	}

	if (
		rightsText.includes('bescherming niet bepaald') ||
		rightsText.includes('rechthebbende niet vindbaar') ||
		rightsText.includes('niet lokaliseerbaar') ||
		rightsText.includes('niet identificeerbaar')
	) {
		return <Icon name={IconNamesLight.CopyrightUndetermined} aria-hidden />;
	}

	if (
		rightsText.includes('auteursrechtelijk beschermd') ||
		rightsText.includes('volledig overnemen uit kg') ||
		rightsText.includes('geindividualiseerde naamsvermelding') ||
		rightsText.includes('©') ||
		rightsText.includes('(c)')
	) {
		return <Icon name={IconNamesLight.CopyrightProtected} aria-hidden />;
	}

	return null;
}
