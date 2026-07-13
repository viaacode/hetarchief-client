import { tText } from '@shared/helpers/translate';
import { truncate } from 'es-toolkit/compat';

export const createPageTitle = (title?: string | null): string => {
	if (!title) {
		return tText('modules/shared/utils/seo/create-page-title/create-page-title___bezoekertool');
	}

	return `${truncate(title, {
		length: 50,
		omission: '...',
	})} | ${tText('modules/shared/utils/seo/create-page-title/create-page-title___bezoekertool')}`;
};
