import { GetCollectionsResponse } from '@account/types';
import { GetMediaResponse } from '@shared/types';

export interface MediaState {
	results?: GetMediaResponse;
	collections?: GetCollectionsResponse;
}
