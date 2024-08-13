import { type Folder } from '@account/types';
import { type IeObjectSearchAggregations } from '@ie-objects/ie-objects.types';
import { type AppState } from '@shared/store';
import { type GetIeObjectsResponse } from '@shared/types/api';

export const selectIeObjectsResults = (state: AppState): GetIeObjectsResponse | undefined =>
	state.IeObjects.results;
export const selectIeObjectsFilterOptions = (
	state: AppState
): IeObjectSearchAggregations | undefined => state.IeObjects.filterOptions;
export const selectFolders = (state: AppState): Folder[] => state.IeObjects.folders || [];
