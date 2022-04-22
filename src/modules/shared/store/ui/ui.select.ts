import { AppState } from '../store.types';

export const selectShowAuthModal = (state: AppState): boolean => state.ui.showAuthModal;
export const selectIsStickyLayout = (state: AppState): boolean => state.ui.isStickyLayout;
export const selectShowNavigationBorder = (state: AppState): boolean =>
	state.ui.showNavigationBorder;
export const selectShowFooter = (state: AppState): boolean => state.ui.showFooter;
export const selectShowNotificationsCenter = (state: AppState): boolean =>
	state.ui.showNotificationsCenter;
export const selectHasUnreadNotifications = (state: AppState): boolean =>
	state.ui.hasUnreadNotifications;
export const selectShowZendesk = (state: AppState): boolean => state.ui.showZendesk;
export const selectLockScrollRecord = (state: AppState): AppState['ui']['lockScroll'] =>
	state.ui.lockScroll;
export const selectIsScrollLocked = (state: AppState): boolean =>
	!!Object.values(state.ui.lockScroll || {}).find((val) => val === true);
