export interface LastScrollPositionType {
	itemId: string;
	page: string;
}

export interface UIState {
	showAuthModal: boolean;
	isStickyLayout: boolean;
	showNavigationBorder: boolean;
	showMaterialRequestCenter: boolean;
	showFooter: boolean;
	showNotificationsCenter: boolean;
	hasUnreadNotifications: boolean;
	showZendesk: boolean;
	lockScroll: Record<string, boolean>;
	materialRequestCount: number;
	lastScrollPosition: LastScrollPositionType;
	selectedMaintainerSlug: string;
}
