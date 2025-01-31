import { sortBy } from 'lodash-es';

import { tText } from '@shared/helpers/translate';
import {
	ADVANCED_FILTERS,
	type FilterConfig,
	FILTERS_OPTIONS_CONFIG,
	REGULAR_FILTERS,
} from '@visitor-space/const/advanced-filters.consts';

import {
	FilterProperty,
	type Operator,
	type OperatorOptions,
	type PropertyOptions,
} from '../../types';

export const getRegularProperties = (): PropertyOptions => {
	return sortBy(
		REGULAR_FILTERS.map((key) => {
			return {
				label: getFilterLabel(key as FilterProperty),
				value: key as FilterProperty,
			};
		}),
		(option) => option.label
	);
};
export const getAdvancedProperties = (): PropertyOptions => {
	return sortBy(
		ADVANCED_FILTERS.map((key) => {
			return {
				label: getFilterLabel(key as FilterProperty),
				value: key as FilterProperty,
			};
		}),
		(option) => option.label
	);
};

export const getOperators = (prop: FilterProperty): OperatorOptions => {
	const property = FILTERS_OPTIONS_CONFIG()[prop];

	if (property) {
		return Object.keys(property).map((key) => {
			return {
				label: property[key as Operator]?.label || '',
				value: key as Operator,
			};
		});
	}

	return [];
};

export const getFilterConfig = (prop: FilterProperty, op: Operator): FilterConfig | null => {
	const property = FILTERS_OPTIONS_CONFIG()[prop];

	if (property?.[op]) {
		return property[op] || null;
	}

	return null;
};

export const getFilterLabel = (prop: FilterProperty): string => {
	return (
		{
			[FilterProperty.CREATED_AT]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___creatiedatum'
			),
			[FilterProperty.RELEASE_DATE]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___uitgavedatum'
			),
			[FilterProperty.CREATOR]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___maker'
			),
			[FilterProperty.NEWSPAPER_SERIES_NAME]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___reeks'
			),
			[FilterProperty.LOCATION_CREATED]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___plaats-van-uitgave'
			),
			[FilterProperty.MENTIONS]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___namenlijst-gesneuvelden'
			),
			[FilterProperty.DESCRIPTION]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___beschrijving'
			),
			[FilterProperty.DURATION]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___duurtijd'
			),
			[FilterProperty.GENRE]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___genre'
			),
			[FilterProperty.LANGUAGE]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___taal'
			),
			[FilterProperty.MEDIA_TYPE]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___bestandstype'
			),
			[FilterProperty.MEDIUM]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___analoge-drager'
			),
			[FilterProperty.PUBLISHED_AT]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___publicatiedatum'
			),
			[FilterProperty.PUBLISHER]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___publisher'
			),
			[FilterProperty.TITLE]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___titel'
			),
			[FilterProperty.IDENTIFIER]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___identifier'
			),
			[FilterProperty.CAST]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___cast'
			),
			[FilterProperty.SPACIAL_COVERAGE]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___locatie-van-de-inhoud'
			),
			[FilterProperty.TEMPORAL_COVERAGE]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___tijdsperiode-van-de-inhoud'
			),
			[FilterProperty.OBJECT_TYPE]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___object-type'
			),
			[FilterProperty.KEYWORDS]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___trefwoord'
			),
		}[prop] || ''
	);
};
