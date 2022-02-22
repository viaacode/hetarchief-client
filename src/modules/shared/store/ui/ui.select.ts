import { AppState } from '../store.types';

export const selectShowAuthModal = (state: AppState): boolean => state.ui.showAuthModal;
export const selectIsStickyLayout = (state: AppState): boolean => state.ui.isStickyLayout;
export const selectShowNavigationBorder = (state: AppState): boolean =>
	state.ui.showNavigationBorder;
