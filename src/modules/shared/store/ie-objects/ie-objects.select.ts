import { GetFoldersResponse } from '@account/types';
import { AppState } from '@shared/store';
import { FilterOptions, GetIeObjectsResponse } from '@shared/types';

export const selectIeObjectsResults = (state: AppState): GetIeObjectsResponse | undefined =>
	state.IeObjects.results;
export const selectIeObjectsFilterOptions = (state: AppState): FilterOptions =>
	state.IeObjects.filterOptions;
export const selectFolders = (state: AppState): GetFoldersResponse | undefined =>
	state.IeObjects.folders;
