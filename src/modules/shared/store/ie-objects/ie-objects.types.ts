import { type Folder } from '@account/types';
import { type IeObjectSearchAggregations } from '@ie-objects/ie-objects.types';
import { type GetIeObjectsResponse } from '@shared/types';

export interface IeObjectsState {
	results?: GetIeObjectsResponse;
	filterOptions?: IeObjectSearchAggregations;
	folders?: Folder[];
}
