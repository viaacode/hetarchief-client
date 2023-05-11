import { SelectOption } from '@meemoo/react-components';
import { format } from 'date-fns';

import { SEPARATOR } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tText } from '@shared/helpers/translate';
import { IeObjectsSearchFilter, Operator } from '@shared/types';
import { asDate, formatDate } from '@shared/utils';

import { getMetadataSearchFilters } from '../../const';
import { AdvancedFilterArrayParam } from '../../const/query-params';
import {
	AdvancedFilter,
	FILTER_LABEL_VALUE_DELIMITER,
	MetadataProp,
	TagIdentity,
	VisitorSpaceFilterId,
	VisitorSpaceQueryParams,
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
	values: (string | null)[],
	label: string,
	key: string
): TagIdentity[] => {
	return values
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
	key: VisitorSpaceFilterId = VisitorSpaceFilterId.Advanced
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
				if (op === Operator.Between || op === Operator.Equals) {
					value = `${formatDate(asDate(split[0]))} - ${formatDate(asDate(split[1]))}`;
					operator = undefined;
				} else {
					value = formatDate(asDate(value));
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

export const mapFiltersToTags = (query: VisitorSpaceQueryParams): TagIdentity[] => {
	return [
		...mapArrayParamToTags(
			query[QUERY_PARAM_KEY.SEARCH_QUERY_KEY] || [],
			tText('modules/visitor-space/utils/map-filters/map-filters___trefwoord'),
			QUERY_PARAM_KEY.SEARCH_QUERY_KEY
		),
		...mapArrayParamToTags(
			query[VisitorSpaceFilterId.Medium] || [],
			getFilterLabel(MetadataProp.Medium),
			VisitorSpaceFilterId.Medium
		),
		// Also uses the advanced filters since we encode "between" into 2 separate advanced filters: gt and lt
		...mapAdvancedToTags(
			query[VisitorSpaceFilterId.Duration] || [],
			VisitorSpaceFilterId.Duration
		),
		// Also uses the advanced filters since we encode "between" into 2 separate advanced filters: gt and lt
		...mapAdvancedToTags(
			query[VisitorSpaceFilterId.Created] || [],
			VisitorSpaceFilterId.Created
		),
		// Also uses the advanced filters since we encode "between" into 2 separate advanced filters: gt and lt
		...mapAdvancedToTags(
			query[VisitorSpaceFilterId.Published] || [],
			VisitorSpaceFilterId.Published
		),
		...mapArrayParamToTags(
			query[VisitorSpaceFilterId.Creator] || [],
			getFilterLabel(MetadataProp.Creator),
			VisitorSpaceFilterId.Creator
		),
		...mapArrayParamToTags(
			query[VisitorSpaceFilterId.Genre] || [],
			getFilterLabel(MetadataProp.Genre),
			VisitorSpaceFilterId.Genre
		),
		...mapArrayParamToTags(
			query[VisitorSpaceFilterId.Keywords] || [],
			getFilterLabel(MetadataProp.Keywords),
			VisitorSpaceFilterId.Keywords
		),
		...mapArrayParamToTags(
			query[VisitorSpaceFilterId.Language] || [],
			getFilterLabel(MetadataProp.Language),
			VisitorSpaceFilterId.Language
		),
		...mapBooleanParamToTag(
			query[VisitorSpaceFilterId.ConsultableMedia] || false,
			tText(
				'modules/visitor-space/utils/map-filters/map-filters___alles-wat-raadpleegbaar-is'
			),
			VisitorSpaceFilterId.ConsultableMedia
		),
		...mapArrayParamToTags(
			query[VisitorSpaceFilterId.Maintainers] || [],
			tText('modules/visitor-space/utils/map-filters/map-filters___aanbieders'),
			VisitorSpaceFilterId.Maintainers
		),
		...mapBooleanParamToTag(
			query[VisitorSpaceFilterId.ConsultableOnlyOnLocation] || false,
			tText(
				'modules/visitor-space/utils/map-filters/map-filters___raadpleegbaar-ter-plaatse'
			),
			VisitorSpaceFilterId.ConsultableOnlyOnLocation
		),
		...mapAdvancedToTags(query[VisitorSpaceFilterId.Advanced] || []),
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
				parsed = asDate(values[i]);
				values[i] = (parsed && format(parsed, 'uuuu-MM-dd')) || values[i];
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
