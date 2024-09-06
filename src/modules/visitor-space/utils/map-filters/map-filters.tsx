import { type SelectOption } from '@meemoo/react-components';
import { format, parseISO } from 'date-fns';
import { isString } from 'lodash-es';

import { SEPARATOR } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tText } from '@shared/helpers/translate';
import { Operator } from '@shared/types';
import { type IeObjectsSearchFilter } from '@shared/types/ie-objects';
import { formatDate } from '@shared/utils/dates';
import { type SearchPageQueryParams } from '@visitor-space/const';

import { getMetadataSearchFilters } from '../../const/metadata';
import { AdvancedFilterArrayParam } from '../../const/query-params';
import {
	type AdvancedFilter,
	FILTER_LABEL_VALUE_DELIMITER,
	MetadataProp,
	SearchFilterId,
	type TagIdentity,
} from '../../types';
import {
	getAdvancedProperties,
	getFilterLabel,
	getOperators,
	getRegularProperties,
} from '../metadata';

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
		const prop = advanced.prop as MetadataProp;
		const op = advanced.op as Operator;

		const split = (advanced.val || '').split(SEPARATOR);

		const label =
			getSelectLabel(getRegularProperties(), prop) ||
			getSelectLabel(getAdvancedProperties(), prop);
		let operator = getSelectLabel(getOperators(prop), advanced.op);
		let value = advanced.val;

		// Convert certain values to be legible

		switch (prop) {
			case MetadataProp.CreatedAt:
			case MetadataProp.PublishedAt:
			case MetadataProp.ReleaseDate:
				if (op === Operator.Between || op === Operator.Equals) {
					value = `${formatDate(parseISO(split[0]))} - ${formatDate(parseISO(split[1]))}`;
					operator = undefined;
				} else {
					value = value ? formatDate(parseISO(value)) : '';
				}
				break;

			case MetadataProp.Duration:
				if (op === Operator.Between) {
					value = `${split[0]} - ${split[1]}`;
					operator = undefined;
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
					{`${label}:`}
					<strong>
						{operator && ` ${operator?.toLowerCase()}`}
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
			getFilterLabel(MetadataProp.Medium),
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
			getFilterLabel(MetadataProp.Creator),
			SearchFilterId.Creator
		),
		...mapArrayParamToTags(
			query[SearchFilterId.NewspaperSeriesName] || [],
			getFilterLabel(MetadataProp.NewspaperSeriesName),
			SearchFilterId.NewspaperSeriesName
		),
		...mapArrayParamToTags(
			query[SearchFilterId.LocationCreated] || [],
			getFilterLabel(MetadataProp.LocationCreated),
			SearchFilterId.LocationCreated
		),
		...mapArrayParamToTags(
			query[SearchFilterId.Genre] || [],
			getFilterLabel(MetadataProp.Genre),
			SearchFilterId.Genre
		),
		...mapArrayParamToTags(
			query[SearchFilterId.Keywords] || [],
			getFilterLabel(MetadataProp.Keywords),
			SearchFilterId.Keywords
		),
		...mapArrayParamToTags(
			query[SearchFilterId.Language] || [],
			getFilterLabel(MetadataProp.Language),
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
	const filters =
		item.prop && item.op
			? getMetadataSearchFilters(item.prop as MetadataProp, item.op as Operator)
			: [];

	// Format data for Elastic
	return filters.map((filter: IeObjectsSearchFilter, i: number) => {
		let parsed;

		switch (item.prop) {
			case MetadataProp.CreatedAt:
			case MetadataProp.PublishedAt:
			case MetadataProp.ReleaseDate:
				parsed = parseISO(values[i]);
				values[i] = (parsed && format(parsed, 'yyyy-MM-dd')) || values[i];
				break;
			case MetadataProp.Duration:
				if (item?.op === Operator.Exact) {
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
