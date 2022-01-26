import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UIState } from './ui.types';

const initialState: UIState = {
	showAuthModal: false,
	isStickyLayout: true,
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
	},
});

export const { setShowAuthModal, setIsStickyLayout } = uiSlice.actions;
