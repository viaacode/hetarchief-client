import { tText } from '@shared/helpers/translate';

export const createPageTitle = (title?: string | null): string => {
	if (!title) {
		return tText('modules/shared/utils/seo/create-page-title/create-page-title___bezoekertool');
	}

	// Do not truncate the title: search engines cut it off themselves at whatever width they
	// currently use, and a hard coded "..." ends up in the search result as literal text.
	// https://meemoo.atlassian.net/browse/ARC-3363
	return `${title} | ${tText(
		'modules/shared/utils/seo/create-page-title/create-page-title___bezoekertool'
	)}`;
};
