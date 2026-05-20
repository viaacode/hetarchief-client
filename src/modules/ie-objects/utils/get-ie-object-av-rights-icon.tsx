import type { IeObjectRightsInfo } from '@ie-objects/ie-objects.types';
import Icon from '@shared/components/Icon/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { compact } from 'lodash-es';
import type { ReactNode } from 'react';

function normalizeRightsValue(value: string): string {
	return value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase();
}

function getRightsSearchText(rightsInfo: IeObjectRightsInfo): string {
	return normalizeRightsValue(
		compact([
			rightsInfo.reuseLabel,
			rightsInfo.reuseCategoryUrl,
			rightsInfo.reuseCategoryId,
			rightsInfo.reuseCategoryLabel,
			rightsInfo.reuseCategoryGroup,
		]).join(' ')
	);
}

export function getIeObjectAvRightsUrl(rightsInfo: IeObjectRightsInfo): string | undefined {
	if (getRightsSearchText(rightsInfo).includes('geen rechteninformatie')) {
		return undefined;
	}

	return rightsInfo.reuseCategoryUrl || rightsInfo.reuseCategoryId || undefined;
}

export function getIeObjectAvRightsLabel(rightsInfo: IeObjectRightsInfo): string {
	const rightsText = getRightsSearchText(rightsInfo);

	if (rightsText.includes('©') || rightsText.includes('(c)')) {
		return rightsInfo.reuseLabel;
	}

	if (rightsText.includes('cc0') || rightsText.includes('creativecommons.org/publicdomain')) {
		return tText('modules/visitor-space/const/rights-filter___cc0');
	}

	if (rightsText.includes('/cne/') || rightsText.includes('bescherming niet bepaald')) {
		return tText(
			'modules/visitor-space/const/rights-filter___auteursrechtelijke-bescherming-niet-bepaald'
		);
	}

	if (
		rightsText.includes('/inc-ruu/') ||
		rightsText.includes('rechthebbende niet vindbaar') ||
		rightsText.includes('niet lokaliseerbaar') ||
		rightsText.includes('niet identificeerbaar')
	) {
		return tText(
			'modules/visitor-space/const/rights-filter___rechthebbenden-niet-lokaliseerbaar-of-niet-identificeerbaar'
		);
	}

	if (
		rightsText.includes('/inc/') ||
		rightsText.includes('auteursrechtelijk beschermd') ||
		rightsText.includes('volledig overnemen uit kg') ||
		rightsText.includes('geindividualiseerde naamsvermelding') ||
		rightsText.includes('©') ||
		rightsText.includes('(c)')
	) {
		return tText('modules/visitor-space/const/rights-filter___auteursrechtelijk-beschermd');
	}

	return rightsInfo.reuseCategoryLabel || rightsInfo.reuseLabel;
}

export function getIeObjectAvRightsIcon(rightsInfo: IeObjectRightsInfo): ReactNode | null {
	const rightsText = getRightsSearchText(rightsInfo);

	if (!rightsText || rightsText.includes('geen rechteninformatie')) {
		return null;
	}

	if (rightsText.includes('cc0') || rightsText.includes('creativecommons.org/publicdomain')) {
		return <Icon name={IconNamesLight.CopyrightPublicDomain} aria-hidden />;
	}

	if (
		rightsText.includes('/cne/') ||
		rightsText.includes('/inc-ruu/') ||
		rightsText.includes('bescherming niet bepaald') ||
		rightsText.includes('rechthebbende niet vindbaar') ||
		rightsText.includes('niet lokaliseerbaar') ||
		rightsText.includes('niet identificeerbaar')
	) {
		return <Icon name={IconNamesLight.CopyrightUndetermined} aria-hidden />;
	}

	if (
		rightsText.includes('/inc/') ||
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
