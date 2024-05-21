import { Folder } from '@account/types';
import { IeObjectSearchAggregations } from '@ie-objects/types';
import { AppState } from '@shared/store';
import { GetIeObjectsResponse } from '@shared/types';

export const selectIeObjectsResults = (state: AppState): GetIeObjectsResponse | undefined =>
	state.IeObjects.results;
export const selectIeObjectsFilterOptions = (
	state: AppState
): IeObjectSearchAggregations | undefined => state.IeObjects.filterOptions;
export const selectFolders = (state: AppState): Folder[] => state.IeObjects.folders || [];
