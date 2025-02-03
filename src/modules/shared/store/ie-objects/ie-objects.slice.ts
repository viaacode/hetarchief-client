import * as toolkitRaw from '@reduxjs/toolkit';

import type { Folder } from '@account/types';
import type { IeObjectSearchAggregations } from '@ie-objects/ie-objects.types';
import type { GetIeObjectsResponse } from '@shared/types/api';

import type { IeObjectsState } from './ie-objects.types';

const initialState: IeObjectsState = {
	results: undefined,
	filterOptions: undefined,
	folders: [],
};

export const IeObjectsSlice = toolkitRaw.createSlice({
	name: 'IeObjects',
	initialState,
	reducers: {
		setResults(state, action: toolkitRaw.PayloadAction<GetIeObjectsResponse>) {
			state.results = action.payload;
		},
		setFilterOptions(state, action: toolkitRaw.PayloadAction<IeObjectSearchAggregations>) {
			state.filterOptions = action.payload;
		},
		setFolders(state, action: toolkitRaw.PayloadAction<Folder[]>) {
			state.folders = action.payload;
		},
	},
});

export const { setResults, setFilterOptions, setFolders } = IeObjectsSlice.actions;
