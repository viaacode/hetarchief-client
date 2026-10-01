import { ROUTES_BY_LOCALE } from '@shared/const/routes';
import { buildLink } from '@shared/helpers/build-link';
import type { Locale } from '@shared/utils/i18n';

/** A link to the search page with these query parameters set, escaped the same way everywhere. */
export const getSearchLink = (locale: Locale, searchParams: Record<string, string>): string =>
	buildLink(ROUTES_BY_LOCALE[locale].search, {}, searchParams);
