import type { MaterialRequestUnreadSummary } from '@material-requests/types';

/**
 * Plain unread-messages dot for a sidebar nav item, matched by the `*-outgoing` / `*-incoming`
 * id suffix convention already used in GET_ACCOUNT_NAVIGATION_LINKS / CP_ADMIN_NAVIGATION_LINKS /
 * ADMIN_NAVIGATION_LINKS (plus `material-requests-admin`, the meemoo-admin "all requests" screen -
 * that layout's equivalent of the incoming overview). A parent item that has sublayers never gets
 * a dot itself - only the specific sublayer that actually has unread messages does. The dot only
 * lands on the parent when it has no sublayers to carry it instead.
 */
export function showMaterialRequestUnreadIndicator(
	id: string,
	hasChildren: boolean,
	unreadSummary: MaterialRequestUnreadSummary | undefined
): boolean {
	if (hasChildren) {
		return false;
	}

	const hasUnreadOutgoing = !!unreadSummary?.hasUnreadOutgoingMessages;
	const hasUnreadIncoming = !!unreadSummary?.hasUnreadIncomingMessages;

	if (id.endsWith('-outgoing')) {
		return hasUnreadOutgoing;
	}
	if (id.endsWith('-incoming') || id === 'material-requests-admin') {
		return hasUnreadIncoming;
	}
	return false;
}
