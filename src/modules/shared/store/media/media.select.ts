import { GetCollectionsResponse } from '@account/types';
import { GetMediaResponse } from '@shared/types';

import { AppState } from '../store.types';

export const selectMediaResults = (state: AppState): GetMediaResponse | undefined =>
	state.media.results;
export const selectCollections = (state: AppState): GetCollectionsResponse | undefined =>
	state.media.collections;
