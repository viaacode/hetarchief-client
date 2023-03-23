export interface UIState {
	showAuthModal: boolean;
	isStickyLayout: boolean;
	showNavigationBorder: boolean;
	showFooter: boolean;
	showNotificationsCenter: boolean;
	hasUnreadNotifications: boolean;
	showZendesk: boolean;
	lockScroll: Record<string, boolean>;
	materialRequestCount: number;
}
