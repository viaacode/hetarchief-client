import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { GetMedia } from '@shared/types';

import { MediaState } from './media.types';

const initialState: MediaState = {
	results: undefined,
};

export const mediaSlice = createSlice({
	name: 'media',
	initialState,
	reducers: {
		setResults(state, action: PayloadAction<GetMedia>) {
			state.results = action.payload;
		},
	},
});

export const { setResults } = mediaSlice.actions;
