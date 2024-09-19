import { type SelectOption } from '@meemoo/react-components';
import { format, parseISO } from 'date-fns';
import { isString } from 'lodash-es';

import { SEPARATOR } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tText } from '@shared/helpers/translate';
import { type IeObjectsSearchFilter } from '@shared/types/ie-objects';
import { formatDate } from '@shared/utils/dates';
import { type SearchPageQueryParams } from '@visitor-space/const';

import { AdvancedFilterArrayParam } from '../../const/advanced-filter-array-param';
import { getMetadataSearchFilters } from '../../const/advanced-filters.consts';
import {
	type AdvancedFilter,
	FILTER_LABEL_VALUE_DELIMITER,
	FilterProperty,
	Operator,
	SearchFilterId,
	type TagIdentity,
} from '../../types';
import {
	getAdvancedProperties,
	getFilterLabel,
	getOperators,
	getRegularProperties,
} from '../advanced-filters';

const getSelectLabel = (
	options: SelectOption[],
	optionValue: string | undefined
): string | undefined => {
	return options.find((option) => option.value === optionValue)?.label;
};

// Prevent duplicate values by prefixing the value with the filter key (e.g. creator--shd)
export const tagPrefix = (key: string): string => `${key}--`;

export const mapBooleanParamToTag = (value: boolean, label: string, key: string): TagIdentity[] => {
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
		},
	];
};

export const mapArrayParamToTags = (
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
						<strong>
							{keyword?.split(FILTER_LABEL_VALUE_DELIMITER).pop() as string}
						</strong>
					</span>
				),
				value: unique,
				key,
				id: unique,
			};
		});
};

export const mapAdvancedToTags = (
	advanced: Array<AdvancedFilter>,
	key: SearchFilterId = SearchFilterId.Advanced
): TagIdentity[] => {
	return advanced.map((advanced: AdvancedFilter) => {
		const filterProp = advanced.prop as FilterProperty;
		const filterOp = advanced.op as Operator;

		const split = (advanced.val || '').split(SEPARATOR);

		const filterPropLabel =
			getSelectLabel(getRegularProperties(), filterProp) ||
			getSelectLabel(getAdvancedProperties(), filterProp);
		let filterOperatorLabel = getSelectLabel(getOperators(filterProp), filterOp);
		let value = advanced.val;

		// Convert certain values to be legible

		switch (filterProp) {
			case FilterProperty.CREATED_AT:
			case FilterProperty.PUBLISHED_AT:
			case FilterProperty.RELEASE_DATE:
				if (filterOp === Operator.BETWEEN || filterOp === Operator.EQUALS) {
					value = `${formatDate(parseISO(split[0]))} - ${formatDate(parseISO(split[1]))}`;
					filterOperatorLabel = undefined;
				} else {
					value = value ? formatDate(parseISO(value)) : '';
				}
				break;

			case FilterProperty.DURATION:
				if (filterOp === Operator.BETWEEN) {
					value = `${split[0]} - ${split[1]}`;
					filterOperatorLabel = undefined;
				}
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
			...advanced,
		};
	});
};

export const mapFiltersToTags = (query: SearchPageQueryParams): TagIdentity[] => {
	return [
		...mapArrayParamToTags(
			query[QUERY_PARAM_KEY.SEARCH_QUERY_KEY] || [],
			tText('modules/visitor-space/utils/map-filters/map-filters___trefwoord'),
			QUERY_PARAM_KEY.SEARCH_QUERY_KEY
		),
		...mapArrayParamToTags(
			query[SearchFilterId.Medium] || [],
			getFilterLabel(FilterProperty.MEDIUM),
			SearchFilterId.Medium
		),
		// Also uses the advanced filters since we encode "between" into 2 separate advanced filters: gt and lt
		...mapAdvancedToTags(query[SearchFilterId.Duration] || [], SearchFilterId.Duration),
		// Also uses the advanced filters since we encode "between" into 2 separate advanced filters: gt and lt
		...mapAdvancedToTags(query[SearchFilterId.Created] || [], SearchFilterId.Created),
		// Also uses the advanced filters since we encode "between" into 2 separate advanced filters: gt and lt
		...mapAdvancedToTags(query[SearchFilterId.Published] || [], SearchFilterId.Published),
		// Also uses the advanced filters since we encode "between" into 2 separate advanced filters: gt and lt
		...mapAdvancedToTags(query[SearchFilterId.ReleaseDate] || [], SearchFilterId.ReleaseDate),
		...mapArrayParamToTags(
			query[SearchFilterId.Creator] || [],
			getFilterLabel(FilterProperty.CREATOR),
			SearchFilterId.Creator
		),
		...mapArrayParamToTags(
			query[SearchFilterId.NewspaperSeriesName] || [],
			getFilterLabel(FilterProperty.NEWSPAPER_SERIES_NAME),
			SearchFilterId.NewspaperSeriesName
		),
		...mapArrayParamToTags(
			query[SearchFilterId.LocationCreated] || [],
			getFilterLabel(FilterProperty.LOCATION_CREATED),
			SearchFilterId.LocationCreated
		),
		...mapArrayParamToTags(
			query[SearchFilterId.Mentions] || [],
			getFilterLabel(FilterProperty.MENTIONS),
			SearchFilterId.Mentions
		),
		...mapArrayParamToTags(
			query[SearchFilterId.Genre] || [],
			getFilterLabel(FilterProperty.GENRE),
			SearchFilterId.Genre
		),
		...mapArrayParamToTags(
			query[SearchFilterId.Keywords] || [],
			getFilterLabel(FilterProperty.KEYWORDS),
			SearchFilterId.Keywords
		),
		...mapArrayParamToTags(
			query[SearchFilterId.Language] || [],
			getFilterLabel(FilterProperty.LANGUAGE),
			SearchFilterId.Language
		),
		...mapBooleanParamToTag(
			query[SearchFilterId.ConsultableOnlyOnLocation] || false,
			tText(
				'modules/visitor-space/utils/map-filters/map-filters___raadpleegbaar-ter-plaatse'
			),
			SearchFilterId.ConsultableOnlyOnLocation
		),
		...mapBooleanParamToTag(
			query[SearchFilterId.ConsultableMedia] || false,
			tText(
				'modules/visitor-space/utils/map-filters/map-filters___alles-wat-raadpleegbaar-is'
			),
			SearchFilterId.ConsultableMedia
		),
		...mapBooleanParamToTag(
			query[SearchFilterId.ConsultablePublicDomain] || false,
			tText('modules/visitor-space/utils/map-filters/map-filters___publiek-domain'),
			SearchFilterId.ConsultablePublicDomain
		),
		...mapArrayParamToTags(
			query[SearchFilterId.Maintainers] || [],
			tText('modules/visitor-space/utils/map-filters/map-filters___aanbieders'),
			SearchFilterId.Maintainers
		),
		...mapAdvancedToTags(query[SearchFilterId.Advanced] || []),
	];
};

export const mapAdvancedToElastic = (item: AdvancedFilter): IeObjectsSearchFilter[] => {
	const values = (item.val || '').split(SEPARATOR);
	const filterProp = item.prop as FilterProperty;
	const filterOperator = item.op as Operator;
	const filters =
		filterProp && filterOperator ? getMetadataSearchFilters(filterProp, filterOperator) : [];

	// Format data for Elastic
	return filters.map((filter: IeObjectsSearchFilter, i: number) => {
		let parsed;

		switch (item.prop) {
			case FilterProperty.CREATED_AT:
			case FilterProperty.PUBLISHED_AT:
			case FilterProperty.RELEASE_DATE:
				parsed = parseISO(values[i]);
				values[i] = (parsed && format(parsed, 'yyyy-MM-dd')) || values[i];
				break;
			case FilterProperty.DURATION:
				if (item?.op === Operator.EXACT) {
					// Manually create a range of equal values
					values[i] = values[0];
				}
				break;
			default:
				break;
		}

		return { ...filter, value: values[i] };
	});
};
