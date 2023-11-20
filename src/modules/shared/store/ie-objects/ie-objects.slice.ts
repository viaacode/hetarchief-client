import * as toolkitRaw from '@reduxjs/toolkit';

import { GetFoldersResponse } from '@account/types';
import { IeObjectSearchAggregations } from '@ie-objects/types';
import { GetIeObjectsResponse } from '@shared/types';

import { IeObjectsState } from './ie-objects.types';

const initialState: IeObjectsState = {
	results: undefined,
	filterOptions: undefined,
	folders: undefined,
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
		setFolders(state, action: toolkitRaw.PayloadAction<GetFoldersResponse>) {
			state.folders = action.payload;
		},
	},
});

export const { setResults, setFilterOptions, setFolders } = IeObjectsSlice.actions;
