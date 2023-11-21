import { GetFoldersResponse } from '@account/types';
import { IeObjectSearchAggregations } from '@ie-objects/types';
import { GetIeObjectsResponse } from '@shared/types';

export interface IeObjectsState {
	results?: GetIeObjectsResponse;
	filterOptions?: IeObjectSearchAggregations;
	folders?: GetFoldersResponse;
}
