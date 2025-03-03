import type { SelectOption } from '@meemoo/react-components';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tText } from '@shared/helpers/translate';
import { formatDate } from '@shared/utils/dates';
import type { SearchPageQueryParams } from '@visitor-space/const';
import { format, parseISO } from 'date-fns';
import { isString } from 'lodash-es';

import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { AdvancedFilterArrayParam } from '../../const/advanced-filter-array-param';
import { getMetadataSearchFilters } from '../../const/advanced-filters.consts';
import {
	FILTER_LABEL_VALUE_DELIMITER,
	type FilterValue,
	Operator,
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
						<strong>{keyword?.split(FILTER_LABEL_VALUE_DELIMITER).pop() as string}</strong>
					</span>
				),
				value: unique,
				key,
				id: unique,
			};
		});
};

export const mapAdvancedToTags = (
	advanced: Array<FilterValue>,
	key: IeObjectsSearchFilterField = IeObjectsSearchFilterField.ADVANCED
): TagIdentity[] => {
	return (
		advanced.map?.((advanced: FilterValue) => {
			const filterProp = advanced.field as IeObjectsSearchFilterField;
			const filterOp = advanced.operator as Operator;

			const values = advanced.multiValue || [];

			const filterPropLabel =
				getSelectLabel(getRegularProperties(), filterProp) ||
				getSelectLabel(getAdvancedProperties(), filterProp);
			let filterOperatorLabel = getSelectLabel(getOperators(filterProp), filterOp);
			let value = advanced.multiValue?.[0];

			// Convert certain values to be legible

			switch (filterProp) {
				case IeObjectsSearchFilterField.CREATED:
				case IeObjectsSearchFilterField.PUBLISHED:
				case IeObjectsSearchFilterField.RELEASE_DATE:
					if (filterOp === Operator.BETWEEN || filterOp === Operator.IS) {
						value = `${formatDate(parseISO(values[0]))} - ${formatDate(parseISO(values[1]))}`;
						filterOperatorLabel = undefined;
					} else {
						value = value ? formatDate(parseISO(value)) : '';
					}
					break;

				case IeObjectsSearchFilterField.DURATION:
					if (filterOp === Operator.BETWEEN) {
						value = `${values[0]} - ${values[1]}`;
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
		}) || []
	);
};

export const mapFiltersToTags = (query: SearchPageQueryParams): TagIdentity[] => {
	return [
		...mapArrayParamToTags(
			query[QUERY_PARAM_KEY.SEARCH_QUERY_KEY] || [],
			tText('modules/visitor-space/utils/map-filters/map-filters___trefwoord'),
			QUERY_PARAM_KEY.SEARCH_QUERY_KEY
		),
		...mapArrayParamToTags(
			query[IeObjectsSearchFilterField.MEDIUM] || [],
			getFilterLabel(IeObjectsSearchFilterField.MEDIUM),
			IeObjectsSearchFilterField.MEDIUM
		),
		// Also uses the advanced filters since we encode "between" into 2 separate advanced filters: gt and lt
		...mapAdvancedToTags(
			query[IeObjectsSearchFilterField.DURATION] || [],
			IeObjectsSearchFilterField.DURATION
		),
		// Also uses the advanced filters since we encode "between" into 2 separate advanced filters: gt and lt
		...mapAdvancedToTags(
			query[IeObjectsSearchFilterField.CREATED] || [],
			IeObjectsSearchFilterField.CREATED
		),
		// Also uses the advanced filters since we encode "between" into 2 separate advanced filters: gt and lt
		...mapAdvancedToTags(
			query[IeObjectsSearchFilterField.PUBLISHED] || [],
			IeObjectsSearchFilterField.PUBLISHED
		),
		// Also uses the advanced filters since we encode "between" into 2 separate advanced filters: gt and lt
		...mapAdvancedToTags(
			query[IeObjectsSearchFilterField.RELEASE_DATE] || [],
			IeObjectsSearchFilterField.RELEASE_DATE
		),
		...mapArrayParamToTags(
			query[IeObjectsSearchFilterField.CREATOR] || [],
			getFilterLabel(IeObjectsSearchFilterField.CREATOR),
			IeObjectsSearchFilterField.CREATOR
		),
		...mapArrayParamToTags(
			query[IeObjectsSearchFilterField.NEWSPAPER_SERIES_NAME] || [],
			getFilterLabel(IeObjectsSearchFilterField.NEWSPAPER_SERIES_NAME),
			IeObjectsSearchFilterField.NEWSPAPER_SERIES_NAME
		),
		...mapArrayParamToTags(
			query[IeObjectsSearchFilterField.LOCATION_CREATED] || [],
			getFilterLabel(IeObjectsSearchFilterField.LOCATION_CREATED),
			IeObjectsSearchFilterField.LOCATION_CREATED
		),
		...mapArrayParamToTags(
			query[IeObjectsSearchFilterField.MENTIONS] || [],
			getFilterLabel(IeObjectsSearchFilterField.MENTIONS),
			IeObjectsSearchFilterField.MENTIONS
		),
		...mapArrayParamToTags(
			query[IeObjectsSearchFilterField.GENRE] || [],
			getFilterLabel(IeObjectsSearchFilterField.GENRE),
			IeObjectsSearchFilterField.GENRE
		),
		...mapArrayParamToTags(
			query[IeObjectsSearchFilterField.KEYWORD] || [],
			getFilterLabel(IeObjectsSearchFilterField.KEYWORD),
			IeObjectsSearchFilterField.KEYWORD
		),
		...mapArrayParamToTags(
			query[IeObjectsSearchFilterField.LANGUAGE] || [],
			getFilterLabel(IeObjectsSearchFilterField.LANGUAGE),
			IeObjectsSearchFilterField.LANGUAGE
		),
		...mapBooleanParamToTag(
			query[IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION] || false,
			tText('modules/visitor-space/utils/map-filters/map-filters___raadpleegbaar-ter-plaatse'),
			IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION
		),
		...mapBooleanParamToTag(
			query[IeObjectsSearchFilterField.CONSULTABLE_MEDIA] || false,
			tText('modules/visitor-space/utils/map-filters/map-filters___alles-wat-raadpleegbaar-is'),
			IeObjectsSearchFilterField.CONSULTABLE_MEDIA
		),
		...mapBooleanParamToTag(
			query[IeObjectsSearchFilterField.CONSULTABLE_PUBLIC_DOMAIN] || false,
			tText('modules/visitor-space/utils/map-filters/map-filters___publiek-domain'),
			IeObjectsSearchFilterField.CONSULTABLE_PUBLIC_DOMAIN
		),
		...mapArrayParamToTags(
			query[IeObjectsSearchFilterField.MAINTAINER_ID] || [],
			tText('modules/visitor-space/utils/map-filters/map-filters___aanbieders'),
			IeObjectsSearchFilterField.MAINTAINER_ID
		),
		...mapAdvancedToTags(query[IeObjectsSearchFilterField.ADVANCED] || []),
	];
};

export const mapAdvancedToElastic = (item: FilterValue): FilterValue[] => {
	const values = item.multiValue || [];
	const filterProp = item.field as IeObjectsSearchFilterField;
	const filterOperator = item.operator as Operator;
	const filters =
		filterProp && filterOperator ? getMetadataSearchFilters(filterProp, filterOperator) : [];

	// Format data for Elastic
	return filters.map((filter: FilterValue, i: number): FilterValue => {
		let parsed: Date;
		let operator: Operator = Operator.IS;

		switch (item.field) {
			case IeObjectsSearchFilterField.CREATED:
			case IeObjectsSearchFilterField.PUBLISHED:
			case IeObjectsSearchFilterField.RELEASE_DATE:
				parsed = parseISO(values[i]);
				values[i] = (parsed && format(parsed, 'yyyy-MM-dd')) || values[i];
				if (filterOperator === Operator.BETWEEN) {
					operator = i === 0 ? Operator.GTE : Operator.LTE;
				}
				break;
			case IeObjectsSearchFilterField.DURATION:
				// Manually create a range of equal values
				// Add milliseconds since elasticsearch requires it: https://meemoo.atlassian.net/browse/ARC-2549
				values[i] = `${values[0]}.00`;
				break;
			default:
				break;
		}

		return { ...filter, multiValue: values };
	});
};
