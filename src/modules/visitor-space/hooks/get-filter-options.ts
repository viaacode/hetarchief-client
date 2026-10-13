import type { IeObjectSearchAggregations } from '@ie-objects/ie-objects.types';
import { IeObjectsService } from '@ie-objects/services';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { useQuery } from '@tanstack/react-query';
import type { FilterMenuFilterOption } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import {
	LANGUAGES,
	type LanguageCode,
} from '@visitor-space/components/LanguageFilterForm/languages';
import { SEARCH_PAGE_QUERY_PARAM_CONFIG } from '@visitor-space/const';
import { getRightsOptions, type RightsLabel } from '@visitor-space/const/rights-filter.const';
import { useGetContentPartners } from '@visitor-space/hooks/get-content-partner';
import { useSearchQueryFilters } from '@visitor-space/hooks/get-search-query-filters';
import { useGetThemeFilterOptions } from '@visitor-space/hooks/use-get-theme-filter-options';
import { ElasticsearchFieldNames, FILTER_LABEL_VALUE_DELIMITER } from '@visitor-space/types';
import { compact, keyBy, mapValues, uniqBy } from 'es-toolkit/compat';
import { useMemo } from 'react';
import { useQueryParams } from 'use-query-params';

export interface FilterOption {
	label: string;
	/** What the query parameter holds. Not always the same as the label. */
	value: string;
}

/** Which aggregation the buckets of a field arrive under. */
const AGGREGATION_KEY_BY_FIELD: Partial<
	Record<IeObjectsSearchFilterField, ElasticsearchFieldNames>
> = {
	[IeObjectsSearchFilterField.MAINTAINER_ID]: ElasticsearchFieldNames.Maintainer,
	[IeObjectsSearchFilterField.MEDIUM]: ElasticsearchFieldNames.Medium,
	[IeObjectsSearchFilterField.THEME]: ElasticsearchFieldNames.Theme,
	[IeObjectsSearchFilterField.GENRE]: ElasticsearchFieldNames.Genre,
	[IeObjectsSearchFilterField.LANGUAGE]: ElasticsearchFieldNames.Language,
	[IeObjectsSearchFilterField.LOCATION_CREATED]: ElasticsearchFieldNames.LocationCreated,
};

/** The values a filter may offer, given the filters that are active. */
export const useGetFilterOptions = (
	filter: FilterMenuFilterOption,
	enabled: boolean
): { options: FilterOption[]; isLoading: boolean } => {
	const locale = useLocale();
	const searchFilters = useSearchQueryFilters();
	const [query] = useQueryParams(SEARCH_PAGE_QUERY_PARAM_CONFIG);
	const field = filter.field;

	// The buckets of the theme aggregation hold slugs, and the names come from the themes endpoint.
	// The aggregation is what limits the list to the themes of the active tab. ARC-3797
	const isThemeFilter = field === IeObjectsSearchFilterField.THEME;
	const { options: themeOptions, isLoading: isLoadingThemes } = useGetThemeFilterOptions(
		enabled && isThemeFilter
	);

	const { data: aggregations, isLoading } = useQuery({
		queryKey: [QUERY_KEYS.getIeObjectFilterOptions, field, searchFilters],
		queryFn: async (): Promise<IeObjectSearchAggregations | undefined> => {
			const results = await IeObjectsService.getSearchResults(searchFilters, 1, 1, undefined, [
				field as IeObjectsSearchFilterField,
			]);
			return results.aggregations;
		},
		enabled: enabled && !!field,
	});

	// Maintainer buckets hold ids, so the readable names come from somewhere else
	const { data: maintainers } = useGetContentPartners(
		{},
		enabled && field === IeObjectsSearchFilterField.MAINTAINER_ID
	);

	const aggregatedOptions = useMemo((): FilterOption[] => {
		if (!aggregations || !field) {
			return [];
		}

		if (isThemeFilter) {
			const themeSlugs = new Set(
				(aggregations[ElasticsearchFieldNames.Theme]?.buckets || []).map((bucket) => bucket.key)
			);
			return themeOptions.filter((option) => themeSlugs.has(option.value));
		}

		if (field === IeObjectsSearchFilterField.RIGHTS) {
			return getRightsOptions(
				[],
				[
					...(aggregations[ElasticsearchFieldNames.RightsForNewspaper]?.buckets || []),
					...(aggregations[ElasticsearchFieldNames.RightsForAudioVideo]?.buckets || []),
				].map((bucket) => bucket.key as RightsLabel)
			).map((option) => ({
				label: option.label as string,
				value: option.value as string,
			}));
		}

		const aggregationKey = AGGREGATION_KEY_BY_FIELD[field];
		const buckets = aggregationKey ? aggregations[aggregationKey]?.buckets || [] : [];

		if (field === IeObjectsSearchFilterField.MAINTAINER_ID) {
			const maintainerNames = mapValues(
				keyBy(maintainers || [], (maintainer) => maintainer.id),
				(maintainer) => maintainer.name
			);
			return buckets.map((bucket) => ({
				label: maintainerNames?.[bucket.key] || bucket.key,
				value: `${bucket.key}${FILTER_LABEL_VALUE_DELIMITER}${maintainerNames?.[bucket.key] || ''}`,
			}));
		}

		if (field === IeObjectsSearchFilterField.LANGUAGE) {
			return buckets.map((bucket) => ({
				label: LANGUAGES[locale][bucket.key as LanguageCode] || bucket.key,
				value: `${bucket.key}${FILTER_LABEL_VALUE_DELIMITER}${LANGUAGES[locale][bucket.key as LanguageCode] || bucket.key}`,
			}));
		}

		return uniqBy(
			buckets.map((bucket) => ({ label: bucket.key, value: bucket.key })),
			(option) => option.value
		);
	}, [aggregations, field, maintainers, locale, isThemeFilter, themeOptions]);

	// The aggregation only knows the values the current search still matches, so a value the visitor
	// picked earlier would drop out of the list as soon as the search has no hits for it, e.g. on a
	// tab this filter does not belong to. An applied value is always offered, so it can be unticked.
	const applied = query[filter.id];
	const options = useMemo((): FilterOption[] => {
		const offered = new Set(aggregatedOptions.map((option) => option.value));
		const missing = compact(Array.isArray(applied) ? applied : [])
			.filter((value): value is string => typeof value === 'string' && !offered.has(value))
			.map((value) => ({
				value,
				label:
					(isThemeFilter && themeOptions.find((option) => option.value === value)?.label) ||
					value.split(FILTER_LABEL_VALUE_DELIMITER).pop() ||
					value,
			}));

		return [...aggregatedOptions, ...missing];
	}, [aggregatedOptions, applied, isThemeFilter, themeOptions]);

	return { options, isLoading: isThemeFilter ? isLoading || isLoadingThemes : isLoading };
};
