import type { IeObjectSearchAggregations } from '@ie-objects/ie-objects.types';
import { IeObjectsService } from '@ie-objects/services';
import { QUERY_KEYS } from '@shared/const/query-keys';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { type IeObjectsSearchFilter, IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { useQuery } from '@tanstack/react-query';
import type { FilterMenuFilterOption } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import {
	LANGUAGES,
	type LanguageCode,
} from '@visitor-space/components/LanguageFilterForm/languages';
import { getRightsOptions, type RightsLabel } from '@visitor-space/const/rights-filter.const';
import { useGetContentPartners } from '@visitor-space/hooks/get-content-partner';
import { useSearchQueryFilters } from '@visitor-space/hooks/get-search-query-filters';
import { useGetThemeFilterOptions } from '@visitor-space/hooks/use-get-theme-filter-options';
import { ElasticsearchFieldNames, FILTER_LABEL_VALUE_DELIMITER } from '@visitor-space/types';
import { keyBy, mapValues, uniqBy } from 'es-toolkit/compat';
import { useMemo } from 'react';

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
	[IeObjectsSearchFilterField.GENRE]: ElasticsearchFieldNames.Genre,
	[IeObjectsSearchFilterField.LANGUAGE]: ElasticsearchFieldNames.Language,
	[IeObjectsSearchFilterField.LOCATION_CREATED]: ElasticsearchFieldNames.LocationCreated,
};

/**
 * Every clause except the ones on this field.
 * An open filter must offer the values the other filters allow, so its own clauses come out of
 * the query that computes its options.
 */
export const dropClausesForField = (
	filters: IeObjectsSearchFilter[],
	field: IeObjectsSearchFilterField | undefined
): IeObjectsSearchFilter[] => filters.filter((filter) => filter.field !== field);

/**
 * The values a filter may offer, given every other filter that is active.
 *
 * The filter's own clauses are left out of the query on purpose: an open "Aanbieder" modal must
 * list every provider the other filters allow, not only the providers already selected.
 * See the "Technische input van Bert" section in the FA of ARC-3806.
 * ARC-1882 and ARC-1056 widened this to every filter at once, which listed options with no
 * results. Keep it to the one filter the user opened.
 */
export const useGetFilterOptions = (
	filter: FilterMenuFilterOption,
	enabled: boolean
): { options: FilterOption[]; isLoading: boolean } => {
	const locale = useLocale();
	const searchFilters = useSearchQueryFilters();
	const field = filter.field;

	const filtersWithoutThisFilter = useMemo(
		() => dropClausesForField(searchFilters, field),
		[searchFilters, field]
	);

	// Themes are not aggregated in elasticsearch, and the url holds a slug rather than a name,
	// so the options of this filter come from the themes endpoint. ARC-3797
	const isThemeFilter = field === IeObjectsSearchFilterField.THEME;
	const { options: themeOptions, isLoading: isLoadingThemes } = useGetThemeFilterOptions();

	const { data: aggregations, isLoading } = useQuery({
		queryKey: [QUERY_KEYS.getIeObjectFilterOptions, field, filtersWithoutThisFilter],
		queryFn: async (): Promise<IeObjectSearchAggregations | undefined> => {
			const results = await IeObjectsService.getSearchResults(
				filtersWithoutThisFilter,
				1,
				1,
				undefined,
				[field as IeObjectsSearchFilterField]
			);
			return results.aggregations;
		},
		enabled: enabled && !!field && !isThemeFilter,
	});

	// Maintainer buckets hold ids, so the readable names come from somewhere else
	const { data: maintainers } = useGetContentPartners(
		{},
		enabled && field === IeObjectsSearchFilterField.MAINTAINER_ID
	);

	const options = useMemo((): FilterOption[] => {
		if (isThemeFilter) {
			return themeOptions;
		}

		if (!aggregations || !field) {
			return [];
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

	return { options, isLoading: isThemeFilter ? isLoadingThemes : isLoading };
};
