import { GetCollections } from '@account/types';
import { GetMedia } from '@shared/types';

import { AppState } from '../store.types';

export const selectMediaResults = (state: AppState): GetMedia | undefined => state.media.results;
export const selectCollections = (state: AppState): GetCollections | undefined =>
	state.media.collections;
