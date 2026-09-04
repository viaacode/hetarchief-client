import { ALL_SEARCH_FILTERS } from '@visitor-space/const/visitor-space-filters.const';
import {
	type AdvancedFilter,
	FilterModalType,
	FilterProperty,
	Operator,
	SearchFilterId,
	type TextFilterCondition,
} from '@visitor-space/types';

/**
 * Before ARC-3806 every advanced filter lived in one "advanced" query parameter, as a list of
 * property, operator and value triples. Now each filter has a parameter of its own. Shared and
 * bookmarked urls still carry the old parameter, so they are converted on load.
 */
const LEGACY_PROPERTY_TO_FILTER_ID: Partial<Record<FilterProperty, SearchFilterId>> = {
	[FilterProperty.TITLE]: SearchFilterId.Title,
	[FilterProperty.DESCRIPTION]: SearchFilterId.Description,
	[FilterProperty.CAST]: SearchFilterId.Cast,
	[FilterProperty.IDENTIFIER]: SearchFilterId.Identifier,
	[FilterProperty.SPACIAL_COVERAGE]: SearchFilterId.SpacialCoverage,
	[FilterProperty.OBJECT_TYPE]: SearchFilterId.ObjectType,
	[FilterProperty.TEMPORAL_COVERAGE]: SearchFilterId.TemporalCoverage,
	[FilterProperty.KEYWORDS]: SearchFilterId.Keywords,
	[FilterProperty.PUBLISHER]: SearchFilterId.Publisher,
	[FilterProperty.GENRE]: SearchFilterId.Genre,
	[FilterProperty.LANGUAGE]: SearchFilterId.Language,
	[FilterProperty.MEDIUM]: SearchFilterId.Medium,
	[FilterProperty.RIGHTS]: SearchFilterId.Rights,
	[FilterProperty.THEME]: SearchFilterId.Theme,
	[FilterProperty.CREATOR]: SearchFilterId.Creator,
	[FilterProperty.NEWSPAPER_SERIES_NAME]: SearchFilterId.NewspaperSeriesName,
	[FilterProperty.LOCATION_CREATED]: SearchFilterId.LocationCreated,
	[FilterProperty.MENTIONS]: SearchFilterId.Mentions,
	[FilterProperty.CREATED_AT]: SearchFilterId.Created,
	[FilterProperty.PUBLISHED_AT]: SearchFilterId.Published,
	[FilterProperty.RELEASE_DATE]: SearchFilterId.ReleaseDate,
	[FilterProperty.DURATION]: SearchFilterId.Duration,
};

/**
 * Converts the old combined parameter into the new per-filter parameters.
 * Returns the query changes to apply, "advanced" cleared included. An empty object means there
 * was nothing to convert.
 */
export const migrateLegacyAdvancedFilters = (
	legacyFilters: AdvancedFilter[] | undefined
): Record<string, unknown> => {
	if (!legacyFilters?.length) {
		return {};
	}

	const filtersById = new Map(ALL_SEARCH_FILTERS().map((filter) => [filter.id, filter]));
	const changes: Record<string, unknown> = {};

	for (const legacyFilter of legacyFilters) {
		const filterId = LEGACY_PROPERTY_TO_FILTER_ID[legacyFilter.prop as FilterProperty];
		const filter = filterId ? filtersById.get(filterId) : undefined;

		if (!filterId || !filter || !legacyFilter.val) {
			continue;
		}

		switch (filter.modalType) {
			case FilterModalType.Text:
				changes[filterId] = [
					...((changes[filterId] as TextFilterCondition[]) || []),
					{
						op:
							legacyFilter.op === Operator.CONTAINS_NOT || legacyFilter.op === Operator.EQUALS_NOT
								? Operator.CONTAINS_NOT
								: Operator.CONTAINS,
						val: legacyFilter.val,
					},
				];
				break;

			case FilterModalType.SearchableCheckbox:
			case FilterModalType.CheckboxList:
			case FilterModalType.Autocomplete:
				changes[filterId] = [...((changes[filterId] as string[]) || []), legacyFilter.val];
				break;

			default:
				changes[filterId] = [...((changes[filterId] as AdvancedFilter[]) || []), legacyFilter];
				break;
		}
	}

	if (Object.keys(changes).length === 0) {
		return {};
	}

	return { ...changes, [SearchFilterId.Advanced]: undefined };
};
