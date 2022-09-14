import { truncate } from 'lodash-es';

import { i18n } from '@shared/helpers/i18n';

export const createPageTitle = (title?: string): string => {
	if (!title) {
		return i18n.t(
			'modules/shared/utils/seo/create-page-title/create-page-title___bezoekertool'
		);
	}

	return `${truncate(title, {
		length: 50,
		omission: '...',
	})} | ${i18n.t('modules/shared/utils/seo/create-page-title/create-page-title___bezoekertool')}`;
};
