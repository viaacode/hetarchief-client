import * as toolkitRaw from '@reduxjs/toolkit';

import { GetFoldersResponse } from '@account/types';
import { FilterOptions, GetIeObjectsResponse, IeObjectsSearchFilterField } from '@shared/types';

import { IeObjectsState } from './ie-objects.types';

const initialState: IeObjectsState = {
	results: undefined,
	filterOptions: {
		[IeObjectsSearchFilterField.OBJECT_TYPE]: [],
		[IeObjectsSearchFilterField.LANGUAGE]: [],
		[IeObjectsSearchFilterField.MEDIUM]: [],
		[IeObjectsSearchFilterField.GENRE]: [],
		[IeObjectsSearchFilterField.MAINTAINER_ID]: [],
	},
	folders: undefined,
};

export const IeObjectsSlice = toolkitRaw.createSlice({
	name: 'IeObjects',
	initialState,
	reducers: {
		setResults(state, action: toolkitRaw.PayloadAction<GetIeObjectsResponse>) {
			state.results = action.payload;
		},
		setFilterOptions(state, action: toolkitRaw.PayloadAction<FilterOptions>) {
			state.filterOptions = action.payload;
		},
		setFolders(state, action: toolkitRaw.PayloadAction<GetFoldersResponse>) {
			state.folders = action.payload;
		},
	},
});

export const { setResults, setFilterOptions, setFolders } = IeObjectsSlice.actions;
