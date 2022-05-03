import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { GetCollections } from '@account/types';
import { GetMedia } from '@shared/types';

import { MediaState } from './media.types';

const initialState: MediaState = {
	results: undefined,
	collections: undefined,
};

export const mediaSlice = createSlice({
	name: 'media',
	initialState,
	reducers: {
		setResults(state, action: PayloadAction<GetMedia>) {
			state.results = action.payload;
		},
		setCollections(state, action: PayloadAction<GetCollections>) {
			state.collections = action.payload;
		},
	},
});

export const { setResults, setCollections } = mediaSlice.actions;
