import { GetFoldersResponse } from '@account/types';
import { FilterOptions, GetIeObjectsResponse } from '@shared/types';

export interface IeObjectsState {
	results?: GetIeObjectsResponse;
	filterOptions: FilterOptions;
	folders?: GetFoldersResponse;
}
