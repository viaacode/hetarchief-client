import { type Breadcrumb } from '@meemoo/react-components';

export interface LastScrollPositionType {
	itemId: string;
	page: string;
}

export interface UIState {
	showAuthModal: boolean;
	isStickyLayout: boolean;
	showMaterialRequestCenter: boolean;
	showLanguageSelectionDropdown: boolean;
	showNavigationHeaderRight: boolean;
	showFooter: boolean;
	showNotificationsCenter: boolean;
	hasUnreadNotifications: boolean;
	openNavigationDropdownId: string | null;
	showZendesk: boolean;
	lockScroll: Record<string, boolean>;
	materialRequestCount: number;
	lastScrollPosition: LastScrollPositionType | null;
	breadcrumbs: Breadcrumb[];
}
