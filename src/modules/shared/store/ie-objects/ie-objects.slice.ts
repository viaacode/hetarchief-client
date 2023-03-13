import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { GetFoldersResponse } from '@account/types';
import { IeObjectSearchAggregations } from '@ie-objects/types';
import { GetIeObjectsResponse } from '@shared/types';

import { IeObjectsState } from './ie-objects.types';

const initialState: IeObjectsState = {
	results: undefined,
	filterOptions: undefined,
	folders: undefined,
};

export const IeObjectsSlice = createSlice({
	name: 'IeObjects',
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

export const { setResults, setFilterOptions, setFolders } = IeObjectsSlice.actions;
