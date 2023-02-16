import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { GetFoldersResponse } from '@account/types';
import { GetIeObjectsResponse } from '@shared/types';

import { MediaState } from './media.types';

import { IeObjectSearchAggregations } from 'modules/ie-objects/types';

const initialState: MediaState = {
	results: undefined,
	filterOptions: undefined,
	folders: undefined,
};

export const mediaSlice = createSlice({
	name: 'media',
	initialState,
	reducers: {
		setResults(state, action: PayloadAction<GetIeObjectsResponse>) {
			state.results = action.payload;
		},
		setFilterOptions(state, action: PayloadAction<IeObjectSearchAggregations>) {
			state.filterOptions = action.payload;
		},
		setFolders(state, action: PayloadAction<GetFoldersResponse>) {
			state.folders = action.payload;
		},
	},
});

export const { setResults, setFilterOptions, setFolders } = mediaSlice.actions;
