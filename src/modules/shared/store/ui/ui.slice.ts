import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UIState } from './ui.types';

const initialState: UIState = {
	showAuthModal: false,
};

export const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		setShowAuthModal(state, action: PayloadAction<boolean>) {
			state.showAuthModal = action.payload;
		},
	},
});

export const { setShowAuthModal } = uiSlice.actions;
