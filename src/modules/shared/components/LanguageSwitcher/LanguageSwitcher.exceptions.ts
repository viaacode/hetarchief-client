import { ROUTE_PARTS_BY_LOCALE, RouteKey } from '@shared/const';

export function handleRouteExceptions(routeKey: RouteKey, newFullPath: string) {
	if (routeKey === RouteKey.accountMyFolders) {
		// If route contains the default "favorites" folder, strip it off, since it will be different in the other locale
		// and we have a redirect for each locale to redirect to the correct favorites translated route
		const favoritesInAllLanguages = Object.values(ROUTE_PARTS_BY_LOCALE).map(
			(routeParts) => routeParts.favorites
		);
		const favoritesFolder = newFullPath.split('/').pop() as string;
		if (favoritesInAllLanguages.includes(favoritesFolder)) {
			return newFullPath.substring(0, newFullPath.lastIndexOf('/'));
		}
	}

	return newFullPath;
}
