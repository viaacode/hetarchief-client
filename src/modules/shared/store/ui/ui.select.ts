import { Breadcrumb } from '@meemoo/react-components';

import { AppState } from '@shared/store';

import { LastScrollPositionType } from './ui.types';

export const selectShowAuthModal = (state: AppState): boolean => state.ui.showAuthModal;
export const selectIsStickyLayout = (state: AppState): boolean => state.ui.isStickyLayout;
export const selectShowNavigationHeaderRight = (state: AppState): boolean =>
	state.ui.showNavigationHeaderRight;
export const selectShowFooter = (state: AppState): boolean => state.ui.showFooter;
export const selectShowNotificationsCenter = (state: AppState): boolean =>
	state.ui.showNotificationsCenter;
export const selectShowMaterialRequestCenter = (state: AppState): boolean =>
	state.ui.showMaterialRequestCenter;
export const selectOpenNavigationDropdownId = (state: AppState): string | null =>
	state.ui.openNavigationDropdownId;
export const selectHasUnreadNotifications = (state: AppState): boolean =>
	state.ui.hasUnreadNotifications;
export const selectShowZendesk = (state: AppState): boolean => state.ui.showZendesk;
export const selectLockScrollRecord = (state: AppState): AppState['ui']['lockScroll'] =>
	state.ui.lockScroll;
export const selectIsScrollLocked = (state: AppState): boolean =>
	!!Object.values(state.ui.lockScroll || {}).find((val) => val === true);
export const selectMaterialRequestCount = (state: AppState): number =>
	state.ui.materialRequestCount;
export const selectLastScrollPosition = (state: AppState): LastScrollPositionType | null =>
	state.ui.lastScrollPosition;
export const selectBreadcrumbs = (state: AppState): Breadcrumb[] => state.ui.breadcrumbs;
