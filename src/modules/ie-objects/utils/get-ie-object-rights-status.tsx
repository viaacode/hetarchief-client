import { type ReactNode } from 'react';

import { type IeObject, IeObjectLicense } from '@ie-objects/ie-objects.types';
import Icon from '@shared/components/Icon/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { type Locale } from '@shared/utils/i18n';

export function getIeObjectRightsStatusInfo(
	ieObject: IeObject,
	locale: Locale
): { label: string; icon: ReactNode; externalLink: string; internalLink: string } | null {
	if (ieObject.licenses.includes(IeObjectLicense.PUBLIC_DOMAIN)) {
		return {
			label: tText('modules/ie-objects/utils/get-ie-object-rights-status___public-domein'),
			icon: <Icon name={IconNamesLight.CopyrightPublicDomain} />,
			externalLink: tText(
				'modules/ie-objects/utils/get-ie-object-rights-status___https-creativecommons-org-public-domain',
				{
					languageCode: locale,
				}
			),
			internalLink: tText(
				'modules/ie-objects/utils/get-ie-object-rights-status___rechten-status-publiek-domain-meer-info-link'
			),
		};
	}
	if (
		ieObject.licenses.includes(IeObjectLicense.COPYRIGHT_UNDETERMINED) &&
		!ieObject.licenses.includes(IeObjectLicense.PUBLIEK_CONTENT)
	) {
		return {
			label: tText(
				'modules/ie-objects/utils/get-ie-object-rights-status___copyright-undetermined'
			),
			icon: <Icon name={IconNamesLight.CopyrightUndetermined} />,
			externalLink: tText(
				'modules/ie-objects/utils/get-ie-object-rights-status___https-rightsstatements-org-page-und-1-0-language-language-code',
				{
					languageCode: locale,
				}
			),
			internalLink: tText(
				'modules/ie-objects/utils/get-ie-object-rights-status___rechten-status-copyright-undetermined-meer-info-link'
			),
		};
	}
	return null;
}
