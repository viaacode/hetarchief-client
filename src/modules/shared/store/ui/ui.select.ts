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
