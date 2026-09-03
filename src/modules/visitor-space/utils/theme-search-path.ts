import { ROUTES_BY_LOCALE } from '@shared/const';
import type { Locale } from '@shared/utils/i18n';
import {
	filterNameToAcronym,
	operatorToAcronym,
} from '@visitor-space/const/advanced-filter-array-param';
import { FilterProperty, Operator } from '@visitor-space/types';

/**
 * Path of the search page with the "Thema" advanced filter applied on a single theme.
 *
 * Elasticsearch indexes themes by slug, so the slug is what the url carries. See ARC-3797.
 */
export const getThemeSearchPath = (locale: Locale, themeSlug: string): string =>
	`${ROUTES_BY_LOCALE[locale].search}?advanced=${filterNameToAcronym(
		FilterProperty.THEME
	)}${operatorToAcronym(Operator.EQUALS)}${encodeURIComponent(themeSlug)}&page=1`;
