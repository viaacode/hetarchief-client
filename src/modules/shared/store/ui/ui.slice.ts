import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UIState } from './ui.types';

const initialState: UIState = {
	showAuthModal: false,
	isStickyLayout: false,
	showNavigationBorder: false,
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
		setShowNavigationbBorder(state, action: PayloadAction<boolean>) {
			state.showNavigationBorder = action.payload;
		},
	},
});

export const { setShowAuthModal, setIsStickyLayout, setShowNavigationbBorder } = uiSlice.actions;
