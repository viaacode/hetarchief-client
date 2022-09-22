import { truncate } from 'lodash-es';

import { tText } from '@shared/helpers/translate';

export const createPageTitle = (title?: string): string => {
	if (!title) {
		return tText('modules/shared/utils/seo/create-page-title/create-page-title___bezoekertool');
	}

	return `${truncate(title, {
		length: 50,
		omission: '...',
	})} | ${tText('modules/shared/utils/seo/create-page-title/create-page-title___bezoekertool')}`;
};
