import { GetFoldersResponse } from '@account/types';
import { GetIeObjectsResponse } from '@shared/types';

import { AppState } from '../store.types';

import { IeObjectSearchAggregations } from 'modules/ie-objects/types';

export const selectMediaResults = (state: AppState): GetIeObjectsResponse | undefined =>
	state.media.results;
export const selectMediaFilterOptions = (state: AppState): IeObjectSearchAggregations | undefined =>
	state.media.filterOptions;
export const selectFolders = (state: AppState): GetFoldersResponse | undefined =>
	state.media.folders;
