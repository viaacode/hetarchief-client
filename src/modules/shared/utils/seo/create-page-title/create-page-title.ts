import { truncate } from 'lodash-es';

import { TranslationService } from '@shared/services/translation-service/translation-service';

export const createPageTitle = (title?: string): string => {
	if (!title) {
		return TranslationService.t(
			'modules/shared/utils/seo/create-page-title/create-page-title___bezoekertool'
		);
	}

	return `${truncate(title, {
		length: 50,
		omission: '...',
	})} | ${TranslationService.t(
		'modules/shared/utils/seo/create-page-title/create-page-title___bezoekertool'
	)}`;
};
