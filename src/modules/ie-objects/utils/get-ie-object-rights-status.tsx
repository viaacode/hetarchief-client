import Icon from '@shared/components/Icon/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { type HetArchiefIeObject, HetArchiefIeObjectLicense } from '@viaa/avo2-types';
import type { ReactNode } from 'react';

export function getIeObjectRightsStatusInfo(ieObject: HetArchiefIeObject): {
	label: string;
	icon: ReactNode;
	externalLink: string;
	internalLink: string;
} | null {
	if (!ieObject.licenses.includes(HetArchiefIeObjectLicense.PUBLIEK_CONTENT)) {
		return null; // Only objects with the public content can have a rights label: https://meemoo.atlassian.net/browse/ARC-2975
	}
	if (ieObject.licenses.includes(HetArchiefIeObjectLicense.PUBLIC_DOMAIN)) {
		return {
			label: tText('modules/ie-objects/utils/get-ie-object-rights-status___public-domein'),
			icon: <Icon name={IconNamesLight.CopyrightPublicDomain} aria-hidden />,
			externalLink: tText(
				'modules/ie-objects/utils/get-ie-object-rights-status___public-domain-external-link'
			),
			internalLink: tText(
				'modules/ie-objects/utils/get-ie-object-rights-status___public-domain-internal-link'
			),
		};
	}
	if (
		ieObject.licenses.includes(HetArchiefIeObjectLicense.COPYRIGHT_UNDETERMINED) &&
		!ieObject.licenses.includes(HetArchiefIeObjectLicense.PUBLIC_DOMAIN)
	) {
		return {
			label: tText('modules/ie-objects/utils/get-ie-object-rights-status___copyright-undetermined'),
			icon: <Icon name={IconNamesLight.CopyrightUndetermined} aria-hidden />,
			externalLink: tText(
				'modules/ie-objects/utils/get-ie-object-rights-status___copyright-undetermined-external-link'
			),
			internalLink: tText(
				'modules/ie-objects/utils/get-ie-object-rights-status___copyright-undetermined-internal-link'
			),
		};
	}
	return null;
}
