import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UIState } from './ui.types';

const initialState: UIState = {
	// TODO: replace this with actual state
	randomBoolean: false,
};

export const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		// TODO: replace this with actual actions
		setRandomBoolean(state, action: PayloadAction<boolean>) {
			state.randomBoolean = action.payload;
		},
	},
});

export const { setRandomBoolean } = uiSlice.actions;
