import type { IeObjectsSearchOperator } from '@shared/types/ie-objects';
import { normalizeTextFilterOperator } from '@visitor-space/const/operator-labels.const';
import { ALL_SEARCH_FILTERS } from '@visitor-space/const/visitor-space-filters.const';
import {
	type AdvancedFilter,
	FilterModalType,
	SearchFilterId,
	type TextFilterCondition,
} from '@visitor-space/types';

/**
 * Before ARC-3806 every advanced filter lived in one "advanced" query parameter, as a list of
 * property, operator and value triples. Now each filter has a parameter of its own. Shared and
 * bookmarked urls still carry the old parameter, so they are converted on load.
 *
 * The property of a legacy filter decodes to a SearchFilterId already, so only the value needs
 * reshaping, into whichever form the filter's modal type stores.
 *
 * TODO ARC-3806: delete this file in September 2027, a year after the redesign shipped.
 */

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
		const filterId = legacyFilter.prop;
		const filter = filterId ? filtersById.get(filterId) : undefined;

		if (!filterId || !filter || !legacyFilter.val) {
			continue;
		}

		switch (filter.modalType) {
			case FilterModalType.Text:
				changes[filterId] = [
					...((changes[filterId] as TextFilterCondition[]) || []),
					{
						// The legacy form let a field send an operator it no longer offers
						op: normalizeTextFilterOperator(legacyFilter.op as IeObjectsSearchOperator, filterId),
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
