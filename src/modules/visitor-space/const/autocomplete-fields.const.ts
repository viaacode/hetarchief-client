import { AutocompleteField } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import { SearchFilterId } from '@visitor-space/types';

/** Which autocomplete endpoint field backs an autocomplete filter. */
export const AUTOCOMPLETE_FIELD_BY_FILTER_ID: Partial<Record<SearchFilterId, AutocompleteField>> = {
	[SearchFilterId.Creator]: AutocompleteField.creator,
	[SearchFilterId.NewspaperSeriesName]: AutocompleteField.newspaperSeriesName,
	[SearchFilterId.Mentions]: AutocompleteField.mentions,
	[SearchFilterId.LocationCreated]: AutocompleteField.locationCreated,
};
