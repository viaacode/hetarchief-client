import { type ReactNode } from 'react';

import { type IeObject, IeObjectLicense } from '@ie-objects/ie-objects.types';
import Icon from '@shared/components/Icon/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tHtml, tText } from '@shared/helpers/translate';
import { type Locale } from '@shared/utils/i18n';

export function getIeObjectRightsStatusInfo(
	ieObject: IeObject,
	locale: Locale
): { label: string; moreInfo: ReactNode; icon: ReactNode; link: string } | null {
	if (ieObject.licenses.includes(IeObjectLicense.PUBLIC_DOMAIN)) {
		return {
			label: tText('Public domein'),
			moreInfo: tHtml('<a href="/rechten-status-content-page-publiek-domein">Meer info</a>'),
			icon: <Icon name={IconNamesLight.CopyrightPublicDomain} />,
			link: 'https://creativecommons.org/public-domain/',
		};
	}
	if (
		ieObject.licenses.includes(IeObjectLicense.COPYRIGHT_UNDETERMINED) &&
		ieObject.licenses.includes(IeObjectLicense.PUBLIEK_CONTENT)
	) {
		return {
			label: tText('Copyright undetermined'),
			moreInfo: tHtml(
				'<a href="/rechten-status-content-page-copyright-undetermined">Meer info</a>'
			),
			icon: <Icon name={IconNamesLight.CopyrightUndetermined} />,
			link: 'https://rightsstatements.org/page/UND/1.0/?language=' + locale,
		};
	}
	return null;
}
