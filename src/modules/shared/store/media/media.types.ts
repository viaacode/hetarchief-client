import { GetCollections } from '@account/types';
import { GetMedia } from '@shared/types';

export interface MediaState {
	results?: GetMedia;
	collections?: GetCollections;
}
