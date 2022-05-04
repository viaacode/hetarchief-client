import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { GetCollectionsResponse } from '@account/types';
import { GetMediaResponse } from '@shared/types';

import { MediaState } from './media.types';

const initialState: MediaState = {
	results: undefined,
	collections: undefined,
};

export const mediaSlice = createSlice({
	name: 'media',
	initialState,
	reducers: {
		setResults(state, action: PayloadAction<GetMediaResponse>) {
			state.results = action.payload;
		},
		setCollections(state, action: PayloadAction<GetCollectionsResponse>) {
			state.collections = action.payload;
		},
	},
});

export const { setResults, setCollections } = mediaSlice.actions;
