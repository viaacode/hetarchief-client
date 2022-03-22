import { GetMedia } from '@shared/types';

import { AppState } from '../store.types';

export const selectMediaResults = (state: AppState): GetMedia | undefined => state.media.results;
