import { AuthService } from '@auth/services/auth-service';
import type { ContentPageInfo } from '@meemoo/admin-core-ui/admin';
import { ContentPageService } from '@meemoo/admin-core-ui/client';
import { handleRouteExceptions } from '@shared/components/LanguageSwitcher/LanguageSwitcher.exceptions';
import { QUERY_KEYS, ROUTES_BY_LOCALE, type RouteKey } from '@shared/const';
import { isRootSlugRoute } from '@shared/helpers/is-root-slug-route';
import { Locale } from '@shared/utils/i18n';
import type { QueryClient } from '@tanstack/react-query';
import type { AvoUserCommonUser } from '@viaa/avo2-types';
import { reverse, sortBy, trimEnd } from 'lodash-es';
import type { NextRouter } from 'next/router';

/**
 * Update the application locale and redirect to the new path
 * @param oldLocale
 * @param newLocale
 * @param router used to change the current route
 * @param queryClient used to invalidate queries after changing the locale
 * @param commonUser
 */
export const changeApplicationLocale = async (
	oldLocale: Locale,
	newLocale: Locale,
	router: NextRouter,
	queryClient: QueryClient,
	commonUser: AvoUserCommonUser | null
): Promise<void> => {
	if (oldLocale === newLocale) {
		return; // Already viewing the correct language
	}
	let oldFullPath = trimEnd(router.asPath, '?');
	if (
		Object.values(Locale)
			.map((locale) => `/${locale}/`)
			.includes(oldFullPath.substring(0, '/en/'.length))
	) {
		// Remove the old locale from the path
		// eg: /en/search => /search
		oldFullPath = oldFullPath.substring('/en'.length);
	}
	const routeEntries = Object.entries(ROUTES_BY_LOCALE[oldLocale]);
	// We'll go in reverse order, so we'll match on the longest paths first
	const routeEntryInOldLocale = reverse(sortBy(routeEntries, (entry) => entry[1])).find(
		(routeEntry) => oldFullPath.startsWith(routeEntry[1])
	);
	const routeKey = (routeEntryInOldLocale?.[0] || 'home') as RouteKey;
	const oldPath = ROUTES_BY_LOCALE[oldLocale][routeKey] || ROUTES_BY_LOCALE[oldLocale].home;
	const newPath = ROUTES_BY_LOCALE[newLocale][routeKey] || ROUTES_BY_LOCALE[newLocale].home;

	// Replace the static first path of the full path with the localized path
	// eg:
	// - /account/mijn-mappen/map123
	// should become
	// - /account/my-folders/map123
	let newFullPath = oldFullPath.replace(oldPath, newPath);

	// exceptions for specific paths
	newFullPath = handleRouteExceptions(routeKey, newFullPath);

	// exception for content pages
	if (isRootSlugRoute(router.route)) {
		const contentPage = await ContentPageService.getContentPageByLanguageAndPath(
			oldLocale as any,
			newFullPath
		);
		const translatedContentPageInfo = (contentPage?.translatedPages || []).find(
			(translatedPage) =>
				(translatedPage.language as unknown as Locale) === newLocale && translatedPage.isPublic
		);
		newFullPath = translatedContentPageInfo?.path || ROUTES_BY_LOCALE[newLocale].home;
	}
	// Redirect to new path
	await router.replace(newFullPath, newFullPath, { locale: newLocale, shallow: false });

	// If user is passed, also update the language for the current user account in the database / Campaign Monitor
	if (commonUser) {
		await AuthService.updateLanguagePreference(newLocale);
	}

	await queryClient.invalidateQueries({
		queryKey: [QUERY_KEYS.getNavigationItems],
	});
};
