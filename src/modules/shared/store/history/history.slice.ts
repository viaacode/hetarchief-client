import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { HistoryState } from './history.types';

const initialState: HistoryState = {
	history: [],
};

export const historySlice = createSlice({
	name: 'history',
	initialState,
	reducers: {
		setHistory(state, action: PayloadAction<string[]>) {
			state.history = action.payload;
		},
	},
});

export const { setHistory } = historySlice.actions;
