import { type IeObjectSearchAggregations } from '@ie-objects/ie-objects.types';
import { type AppState } from '@shared/store';

export const selectIeObjectsFilterOptions = (
	state: AppState
): IeObjectSearchAggregations | undefined => state.IeObjects.filterOptions;
