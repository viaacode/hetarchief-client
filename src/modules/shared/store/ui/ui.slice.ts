import { Breadcrumb } from '@meemoo/react-components';
import * as toolkitRaw from '@reduxjs/toolkit';

import { LastScrollPositionType, UIState } from './ui.types';

const initialState: UIState = {
	showAuthModal: false,
	isStickyLayout: false,
	showNavigationHeaderRight: true,
	showFooter: true,
	showNotificationsCenter: false,
	showMaterialRequestCenter: false,
	showLanguageSelectionDropdown: false,
	openNavigationDropdownId: null,
	hasUnreadNotifications: false,
	showZendesk: true,
	lockScroll: {},
	materialRequestCount: 0,
	lastScrollPosition: null,
	breadcrumbs: [],
};

export const uiSlice = toolkitRaw.createSlice({
	name: 'ui',
	initialState,
	reducers: {
		setShowAuthModal(state, action: toolkitRaw.PayloadAction<boolean>) {
			state.showAuthModal = action.payload;
		},
		setIsStickyLayout(state, action: toolkitRaw.PayloadAction<boolean>) {
			state.isStickyLayout = action.payload;
		},
		setShowNavigationHeaderRight(state, action: toolkitRaw.PayloadAction<boolean>) {
			state.showNavigationHeaderRight = action.payload;
		},
		setShowFooter(state, action: toolkitRaw.PayloadAction<boolean>) {
			state.showFooter = action.payload;
		},
		setShowNotificationsCenter(state, action: toolkitRaw.PayloadAction<boolean>) {
			state.showNotificationsCenter = action.payload;
		},
		setShowMaterialRequestCenter(state, action: toolkitRaw.PayloadAction<boolean>) {
			state.showMaterialRequestCenter = action.payload;
		},
		setShowLanguageSelectionDropdown(state, action: toolkitRaw.PayloadAction<boolean>) {
			state.showLanguageSelectionDropdown = action.payload;
		},
		setOpenNavigationDropdownId(state, action: toolkitRaw.PayloadAction<string | null>) {
			state.openNavigationDropdownId = action.payload;
		},
		setHasUnreadNotifications(state, action: toolkitRaw.PayloadAction<boolean>) {
			state.hasUnreadNotifications = action.payload;
		},
		setShowZendesk(state, action: toolkitRaw.PayloadAction<boolean>) {
			state.showZendesk = action.payload;
		},
		setLockScroll(state, action: toolkitRaw.PayloadAction<UIState['lockScroll']>) {
			const hasDifferent = Object.keys(action.payload).find(
				(key) => action.payload[key] !== state.lockScroll[key]
			);

			if (hasDifferent) {
				state.lockScroll = { ...state.lockScroll, ...action.payload };
			}
		},
		setMaterialRequestCount(state, action: toolkitRaw.PayloadAction<number>) {
			state.materialRequestCount = action.payload;
		},
		setLastScrollPosition(
			state,
			action: toolkitRaw.PayloadAction<LastScrollPositionType | null>
		) {
			state.lastScrollPosition = action.payload;
		},
		setBreadcrumbs(state, action: toolkitRaw.PayloadAction<Breadcrumb[]>) {
			state.breadcrumbs = action.payload;
		},
	},
});

export const {
	setShowAuthModal,
	setIsStickyLayout,
	setShowNavigationHeaderRight,
	setShowFooter,
	setShowNotificationsCenter,
	setShowMaterialRequestCenter,
	setHasUnreadNotifications,
	setShowLanguageSelectionDropdown,
	setOpenNavigationDropdownId,
	setShowZendesk,
	setLockScroll,
	setMaterialRequestCount,
	setLastScrollPosition,
	setBreadcrumbs,
} = uiSlice.actions;
