import { GetFoldersResponse } from '@account/types';
import { IeObjectSearchAggregations } from '@ie-objects/types';
import { GetIeObjectsResponse } from '@shared/types';

import { AppState } from '../store.types';

export const selectIeObjectsResults = (state: AppState): GetIeObjectsResponse | undefined =>
	state.IeObjects.results;
export const selectIeObjectsFilterOptions = (
	state: AppState
): IeObjectSearchAggregations | undefined => state.IeObjects.filterOptions;
export const selectFolders = (state: AppState): GetFoldersResponse | undefined =>
	state.IeObjects.folders;
