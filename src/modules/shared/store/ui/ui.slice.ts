import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UIState } from './ui.types';

const initialState: UIState = {
	showAuthModal: false,
	isStickyLayout: false,
	showNavigationBorder: false,
	showFooter: true,
	showNotificationsCenter: false,
	hasUnreadNotifications: false,
	showZendesk: true,
	lockScroll: {},
	materialRequestCount: 0,
};

export const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		setShowAuthModal(state, action: PayloadAction<boolean>) {
			state.showAuthModal = action.payload;
		},
		setIsStickyLayout(state, action: PayloadAction<boolean>) {
			state.isStickyLayout = action.payload;
		},
		setShowNavigationBorder(state, action: PayloadAction<boolean>) {
			state.showNavigationBorder = action.payload;
		},
		setShowFooter(state, action: PayloadAction<boolean>) {
			state.showFooter = action.payload;
		},
		setShowNotificationsCenter(state, action: PayloadAction<boolean>) {
			state.showNotificationsCenter = action.payload;
		},
		setHasUnreadNotifications(state, action: PayloadAction<boolean>) {
			state.hasUnreadNotifications = action.payload;
		},
		setShowZendesk(state, action: PayloadAction<boolean>) {
			state.showZendesk = action.payload;
		},
		setLockScroll(state, action: PayloadAction<UIState['lockScroll']>) {
			const hasDifferent = Object.keys(action.payload).find(
				(key) => action.payload[key] !== state.lockScroll[key]
			);

			if (hasDifferent) {
				state.lockScroll = { ...state.lockScroll, ...action.payload };
			}
		},
		setMaterialRequestCount(state, action: PayloadAction<number>) {
			state.materialRequestCount = action.payload;
		},
	},
});

export const {
	setShowAuthModal,
	setIsStickyLayout,
	setShowNavigationBorder,
	setShowFooter,
	setShowNotificationsCenter,
	setHasUnreadNotifications,
	setShowZendesk,
	setLockScroll,
	setMaterialRequestCount,
} = uiSlice.actions;
