import { GetFoldersResponse } from '@account/types';
import { GetIeObjectsResponse } from '@shared/types';

import { IeObjectSearchAggregations } from 'modules/ie-objects/types';

export interface MediaState {
	results?: GetIeObjectsResponse;
	filterOptions?: IeObjectSearchAggregations;
	folders?: GetFoldersResponse;
}
