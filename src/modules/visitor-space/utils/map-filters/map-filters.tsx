import type { SelectOption } from '@meemoo/react-components';
import { SEPARATOR } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tText } from '@shared/helpers/translate';
import type { IeObjectsSearchFilter } from '@shared/types/ie-objects';
import { IeObjectsSearchOperator } from '@shared/types/ie-objects';
import { formatDate } from '@shared/utils/dates';
import type { Locale } from '@shared/utils/i18n';
import type { FilterMenuFilterOption } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import type { SearchPageQueryParams } from '@visitor-space/const';
import { format, parseISO } from 'date-fns';
import { isString } from 'es-toolkit/compat';

import { AdvancedFilterArrayParam } from '../../const/advanced-filter-array-param';
import { getMetadataSearchFilters } from '../../const/advanced-filters.consts';
import {
	getTextFilterOperatorLabel,
	normalizeTextFilterOperator,
} from '../../const/operator-labels.const';
import { getRightsLabel } from '../../const/rights-filter.const';
import {
	type AdvancedFilter,
	FILTER_LABEL_VALUE_DELIMITER,
	FilterModalType,
	SearchFilterId,
	type TagIdentity,
	type TextFilterCondition,
} from '../../types';
import { getAdvancedProperties, getOperators, getRegularProperties } from '../advanced-filters';
import { sortAccentIndependent } from '../sort-labels';

/** A pill shows at most this many values, then a counter for the rest. See the FA of ARC-3806. */
export const MAX_VALUES_PER_TAG = 2;

const getSelectLabel = (
	options: SelectOption[],
	optionValue: string | undefined
): string | undefined => {
	return options.find((option) => option.value === optionValue)?.label;
};

// Prevent duplicate values by prefixing the value with the filter key (e.g. creator--shd)
export const tagPrefix = (key: string): string => `${key}--`;

/** A stored value can carry its own readable label, eg "OR-rf5kf25---VRT". */
const valueToLabel = (value: string): string =>
	value.split(FILTER_LABEL_VALUE_DELIMITER).pop() as string;

const mapBooleanParamToTag = (value: boolean, label: string, key: string): TagIdentity[] => {
	const unique = `${tagPrefix(key)}${value}`;

	if (!value) {
		return [];
	}

	return [
		{
			label: (
				<span>
					{`${tText('modules/visitor-space/utils/map-filters/map-filters___filter')}: `}
					<strong>{label}</strong>
				</span>
			),
			value: unique,
			key,
			id: unique,
			// This filter is a checkbox in the panel, so there is no modal to open
			isClickable: false,
		},
	];
};

const mapArrayParamToTags = (
	values: (string | null)[] | string,
	label: string,
	key: string
): TagIdentity[] => {
	const valuesArray = isString(values) ? [values] : values;
	return valuesArray
		.filter((keyword) => !!keyword)
		.map((keyword) => {
			const unique = `${tagPrefix(key)}${keyword}`;

			return {
				label: (
					<span>
						{`${label}: `}
						<strong>{valueToLabel(keyword as string)}</strong>
					</span>
				),
				value: unique,
				key,
				id: unique,
				isClickable: false,
			};
		});
};

export interface MapFiltersToTagsOptions {
	/**
	 * Theme slug to theme name in the language of the UI. Only the slug is stored in the url, so the
	 * pill of the theme filter is labelled in whichever language the visitor is using. See ARC-3797
	 */
	themeLabelsBySlug?: Record<string, string>;
	/** The language the pill values are sorted in. */
	locale: Locale;
}

/**
 * One pill that gathers every value of one filter: at most two values, alphabetically, then a
 * counter for the rest. See the "Redesign pills" section of the ARC-3806 FA.
 */
const mapValuesToOneTag = (
	values: string[],
	filterName: string,
	operatorLabel: string | undefined,
	key: string,
	locale: Locale,
	op?: string
): TagIdentity[] => {
	if (values.length === 0) {
		return [];
	}

	const labels = sortAccentIndependent(values.map(valueToLabel), locale);
	const shown = labels.slice(0, MAX_VALUES_PER_TAG);
	const remaining = labels.length - shown.length;
	// One pill per filter, so the operator keeps two pills apart when a text filter mixes them
	const unique = `${tagPrefix(key)}${op || ''}`;

	return [
		{
			label: (
				<span>
					{`${filterName}${operatorLabel ? ` ${operatorLabel.toLowerCase()}` : ''}: `}
					<strong>
						{shown.join(', ')}
						{remaining > 0 ? `, +${remaining}` : ''}
					</strong>
				</span>
			),
			value: unique,
			key,
			id: unique,
			op,
		},
	];
};

const mapAdvancedToTags = (
	advanced: Array<AdvancedFilter>,
	key: SearchFilterId,
	options: MapFiltersToTagsOptions
): TagIdentity[] => {
	return advanced.map((advanced: AdvancedFilter) => {
		const filterProp = advanced.prop as SearchFilterId;
		const filterOp = advanced.op as IeObjectsSearchOperator;

		const split = (advanced.val || '').split(SEPARATOR);

		const filterPropLabel =
			getSelectLabel(getRegularProperties(), filterProp) ||
			getSelectLabel(getAdvancedProperties(), filterProp);
		let filterOperatorLabel = getSelectLabel(getOperators(filterProp), filterOp);
		let value = advanced.val;

		// Convert certain values to be legible

		switch (filterProp) {
			case SearchFilterId.Created:
			case SearchFilterId.Published:
			case SearchFilterId.ReleaseDate:
				if (
					filterOp === IeObjectsSearchOperator.BETWEEN ||
					filterOp === IeObjectsSearchOperator.IS
				) {
					value = `${formatDate(parseISO(split[0]))} - ${formatDate(parseISO(split[1]))}`;
					filterOperatorLabel = undefined;
				} else {
					value = value ? formatDate(parseISO(value)) : '';
				}
				break;

			case SearchFilterId.Duration:
				if (filterOp === IeObjectsSearchOperator.BETWEEN) {
					value = `${split[0]} - ${split[1]}`;
					filterOperatorLabel = undefined;
				}
				break;

			case SearchFilterId.Rights:
				value = getRightsLabel(value) || value;
				break;

			case SearchFilterId.Theme:
				// Only the slug is stored, so the pill is labelled in the language of the UI.
				// Falls back to the slug while the themes are still loading
				value = (value && options.themeLabelsBySlug?.[value]) || value;
				break;

			default:
				break;
		}

		// Define render structure
		const unique = `${tagPrefix(key)}${AdvancedFilterArrayParam.encode([advanced])}`;

		return {
			label: (
				<span>
					{`${filterPropLabel}:`}
					<strong>
						{filterOperatorLabel && ` ${filterOperatorLabel?.toLowerCase()}`}
						{` ${value}`}
					</strong>
				</span>
			),
			value: unique,
			key,
			id: unique,
			// A url from before ARC-3806 keeps one combined pill, which has no modal to open
			isClickable: key !== SearchFilterId.Advanced,
			...advanced,
		};
	});
};

/**
 * A text filter gets one pill per operator it offers, so "bevat" and "is niet" stay apart. An
 * operator with no conditions yields no pill: mapValuesToOneTag returns [] for an empty list.
 */
const mapTextFilterToTags = (
	conditions: TextFilterCondition[],
	filter: FilterMenuFilterOption,
	locale: Locale
): TagIdentity[] =>
	getOperators(filter.id).flatMap(({ value: op }) =>
		mapValuesToOneTag(
			conditions
				// A url may carry an operator this field no longer offers
				.filter((condition) => normalizeTextFilterOperator(condition.op, filter.id) === op)
				.map((condition) => condition.val),
			filter.label,
			getTextFilterOperatorLabel(op, filter.id),
			filter.id,
			locale,
			op
		)
	);

const mapFilterToTags = (
	query: SearchPageQueryParams,
	filter: FilterMenuFilterOption,
	options: MapFiltersToTagsOptions
): TagIdentity[] => {
	const value = query[filter.id];

	if (!value) {
		return [];
	}

	switch (filter.modalType) {
		case FilterModalType.Text:
			return mapTextFilterToTags(value as TextFilterCondition[], filter, options.locale);

		case FilterModalType.SearchableCheckbox:
		case FilterModalType.CheckboxList:
		case FilterModalType.Autocomplete: {
			const values = (isString(value) ? [value] : (value as (string | null)[])).filter(
				Boolean
			) as string[];
			return mapValuesToOneTag(
				// The theme filter stores slugs, so its pill is labelled in the language of the UI. ARC-3797
				filter.id === SearchFilterId.Theme
					? values.map((slug) => options.themeLabelsBySlug?.[slug] || slug)
					: values,
				filter.label,
				// Only the searchable checkbox and the autocomplete filters carry "is". ARC-3806
				filter.modalType === FilterModalType.CheckboxList
					? undefined
					: tText('modules/visitor-space/utils/map-filters/map-filters___is'),
				filter.id,
				options.locale
			);
		}

		default:
			// The date, duration and boolean filters keep the pill they always had
			if (typeof value === 'boolean') {
				return mapBooleanParamToTag(value, filter.label, filter.id);
			}
			return mapAdvancedToTags((value as AdvancedFilter[]) || [], filter.id, options);
	}
};

export const mapFiltersToTags = (
	query: SearchPageQueryParams,
	filters: FilterMenuFilterOption[],
	options: MapFiltersToTagsOptions
): TagIdentity[] => {
	return [
		// The search bar keeps one pill per term, since each term is its own search
		...mapArrayParamToTags(
			query[QUERY_PARAM_KEY.SEARCH_QUERY_KEY] || [],
			tText('modules/visitor-space/utils/map-filters/map-filters___trefwoord'),
			QUERY_PARAM_KEY.SEARCH_QUERY_KEY
		),
		...filters.flatMap((filter) => mapFilterToTags(query, filter, options)),
		// Urls shared before ARC-3806 may still carry the old combined parameter
		...mapAdvancedToTags(query[SearchFilterId.Advanced] || [], SearchFilterId.Advanced, options),
	];
};

export const mapAdvancedToElastic = (item: AdvancedFilter): IeObjectsSearchFilter[] => {
	const values = (item.val || '').split(SEPARATOR);
	const filterProp = item.prop as SearchFilterId;
	const filterOperator = item.op as IeObjectsSearchOperator;
	const filters =
		filterProp && filterOperator ? getMetadataSearchFilters(filterProp, filterOperator) : [];

	// Format data for Elastic
	return filters.map((filter: IeObjectsSearchFilter, i: number) => {
		let parsed: Date;

		switch (item.prop) {
			case SearchFilterId.Created:
			case SearchFilterId.Published:
			case SearchFilterId.ReleaseDate:
				if (item.op === IeObjectsSearchOperator.IS && values.length === 1) {
					// Manually create a range of equal values: https://meemoo.atlassian.net/browse/ARC-3191
					values[i] = values[0];
				}

				parsed = parseISO(values[i]);
				values[i] = (parsed && format(parsed, 'yyyy-MM-dd')) || values[i];
				break;
			case SearchFilterId.Duration:
				// Manually create a range of equal values
				// Add milliseconds since elasticsearch requires it: https://meemoo.atlassian.net/browse/ARC-2549
				values[i] = `${values[0]}.00`;
				break;
			default:
				break;
		}

		return { ...filter, value: values[i] };
	});
};

/**
 * The query the search page keeps after the visitor removed one or more pills.
 *
 * The tag list hands back the pills that survive, so the query is rebuilt from those rather than
 * from the one that went. What a surviving pill stands for depends on its filter: a text filter
 * has one pill per operator and keeps only the conditions of that operator, while the filters with
 * one pill for every value keep all of them.
 */
export const getQueryForRemainingTags = (
	remainingTags: readonly TagIdentity[],
	query: SearchPageQueryParams,
	availableFilters: FilterMenuFilterOption[]
): Record<string, unknown> => {
	const updatedQuery: Record<string, unknown> = {};

	for (const tag of remainingTags) {
		if (tag.key === QUERY_PARAM_KEY.SEARCH_QUERY_KEY) {
			// The search bar keeps one pill per term
			updatedQuery[tag.key] = [
				...((updatedQuery[tag.key] as Array<unknown>) || []),
				`${tag.value}`.replace(tagPrefix(tag.key), ''),
			];
			continue;
		}

		const filter = availableFilters.find((availableFilter) => availableFilter.id === tag.key);

		switch (filter?.modalType) {
			case FilterModalType.Text:
				// The pill was keyed on the normalized operator, so compare on that: a url carrying an
				// operator the field no longer offers would otherwise match no pill at all, and its
				// conditions would disappear when a neighbouring pill was removed
				updatedQuery[tag.key] = [
					...((updatedQuery[tag.key] as TextFilterCondition[]) || []),
					...((query[tag.key] as TextFilterCondition[]) || []).filter(
						(condition) => normalizeTextFilterOperator(condition.op, filter.id) === tag.op
					),
				];
				break;

			case FilterModalType.SearchableCheckbox:
			case FilterModalType.CheckboxList:
			case FilterModalType.Autocomplete:
				// One pill holds every value of the filter, so a surviving pill keeps them all
				updatedQuery[tag.key] = query[tag.key];
				break;

			default:
				if (typeof query[tag.key] === 'boolean') {
					updatedQuery[tag.key] = true;
				} else {
					// A date, duration or legacy advanced pill carries its own prop, op and value
					updatedQuery[tag.key] = [...((updatedQuery[tag.key] as Array<unknown>) || []), tag];
				}
				break;
		}
	}

	return updatedQuery;
};
