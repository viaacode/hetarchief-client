import { MediaSearchAggregation } from '@media/types';
import { GetMedia, MediaTypes } from '@shared/types';

import { AppState } from '../store.types';

export const selectMediaResults = (state: AppState): GetMedia | undefined => state.media.results;
export const selectMediaFormatAggregates = (
	state: AppState
): MediaSearchAggregation<MediaTypes> | undefined =>
	state.media.results?.aggregations.dcterms_format;
