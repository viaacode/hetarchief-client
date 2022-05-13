import { GetCollectionsResponse } from '@account/types';
import { MediaSearchAggregations } from '@media/types';
import { GetMediaResponse } from '@shared/types';

export interface MediaState {
	results?: GetMediaResponse;
	filterOptions?: MediaSearchAggregations;
	collections?: GetCollectionsResponse;
}
