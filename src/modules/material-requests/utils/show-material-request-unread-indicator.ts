import type { MaterialRequestUnreadSummary } from '@material-requests/types';
import { ROUTES_BY_LOCALE } from '@shared/const';
import type { Locale } from '@shared/utils/i18n';

/**
 * Matched against a nav item's own `href` (the route it links to) rather than its id -
 * routes are the single source of truth for "what page is this" elsewhere in navigation
 * (see isMyMaterialRequestsNavItem/isCpAdminMaterialRequestsNavItem in Navigation.consts.tsx),
 * so a nav item automatically gets the right dot as long as it links to the right place,
 * with nothing extra to remember to set. A parent item that has sublayers never gets a dot
 * itself - only the specific sublayer that actually has unread messages does. The dot only
 * lands on the parent when it has no sublayers to carry it instead.
 */
export function showMaterialRequestUnreadIndicator(
	href: string,
	hasChildren: boolean,
	unreadSummary: MaterialRequestUnreadSummary | undefined,
	locale: Locale
): boolean {
	if (hasChildren) {
		return false;
	}

	const routes = ROUTES_BY_LOCALE[locale];

	if (href === routes.accountMyMaterialRequests) {
		return !!unreadSummary?.hasUnreadOutgoingMessages;
	}
	if (href === routes.cpAdminMaterialRequests || href === routes.adminMaterialRequests) {
		return !!unreadSummary?.hasUnreadIncomingMessages;
	}
	return false;
}
