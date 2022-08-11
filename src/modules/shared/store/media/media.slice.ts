import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { GetFoldersResponse } from '@account/types';
import { MediaSearchAggregations } from '@media/types';
import { GetMediaResponse } from '@shared/types';

import { MediaState } from './media.types';

const initialState: MediaState = {
	results: undefined,
	filterOptions: undefined,
	folders: undefined,
};

export const mediaSlice = createSlice({
	name: 'media',
	initialState,
	reducers: {
		setResults(state, action: PayloadAction<GetMediaResponse>) {
			state.results = action.payload;
		},
		setFilterOptions(state, action: PayloadAction<MediaSearchAggregations>) {
			state.filterOptions = action.payload;
		},
		setCollections(state, action: PayloadAction<GetFoldersResponse>) {
			state.folders = action.payload;
		},
	},
});

export const { setResults, setFilterOptions, setCollections } = mediaSlice.actions;
