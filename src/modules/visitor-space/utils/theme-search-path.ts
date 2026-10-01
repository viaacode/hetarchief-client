import { getSearchLink } from '@shared/helpers/get-search-link';
import type { Locale } from '@shared/utils/i18n';
import { SearchFilterId } from '@visitor-space/types';

/**
 * Path of the search page with the "Thema" filter applied on a single theme.
 *
 * Elasticsearch indexes themes by slug, so the slug is what the url carries. See ARC-3797.
 */
export const getThemeSearchPath = (locale: Locale, themeSlug: string): string =>
	getSearchLink(locale, { [SearchFilterId.Theme]: themeSlug, page: '1' });
