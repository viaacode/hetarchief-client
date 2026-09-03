import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { ROUTE_PREFIXES_BY_LOCALE } from '@shared/const/routes';
import { isServerSideRendering } from '@shared/utils/is-browser/is-browser';
import { parse } from 'query-string';

/**
 * Whether the content page in the browser is being previewed rather than visited: either through
 * the preview query param, or inside the admin, where the content page editor and detail view
 * render the very same blocks as the public page does.
 *
 * Analytics events must not be triggered from either, or an editor checking their own work would
 * be counted as a visit or a play. The admin prefix is matched for every locale, since the locale
 * isn't known here and the check is cheap either way.
 */
export function isContentPagePreview(): boolean {
	if (isServerSideRendering()) {
		return false;
	}

	if (parse(window.location.search)[QUERY_PARAM_KEY.CONTENT_PAGE_PREVIEW]) {
		return true;
	}

	const firstPathPart = window.location.pathname.split('/')[1];

	return Object.values(ROUTE_PREFIXES_BY_LOCALE).some(
		(prefixes) => prefixes.admin === firstPathPart
	);
}
