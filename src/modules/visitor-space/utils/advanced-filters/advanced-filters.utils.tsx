import { sortBy } from 'lodash-es';

import { tText } from '@shared/helpers/translate';
import {
	ADVANCED_FILTERS,
	FILTERS_OPTIONS_CONFIG,
	type FilterConfig,
	REGULAR_FILTERS,
} from '@visitor-space/const/advanced-filters.consts';

import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import type { Operator, OperatorOptions, PropertyOptions } from '../../types';

export const getRegularProperties = (): PropertyOptions => {
	return sortBy(
		REGULAR_FILTERS.map((key) => {
			return {
				label: getFilterLabel(key as IeObjectsSearchFilterField),
				value: key as IeObjectsSearchFilterField,
			};
		}),
		(option) => option.label
	);
};
export const getAdvancedProperties = (): PropertyOptions => {
	return sortBy(
		ADVANCED_FILTERS.map((key) => {
			return {
				label: getFilterLabel(key as IeObjectsSearchFilterField),
				value: key as IeObjectsSearchFilterField,
			};
		}),
		(option) => option.label
	);
};

export const getOperators = (prop: IeObjectsSearchFilterField): OperatorOptions => {
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

export const getFilterConfig = (
	prop: IeObjectsSearchFilterField,
	op: Operator
): FilterConfig | null => {
	const property = FILTERS_OPTIONS_CONFIG()[prop];

	if (property?.[op]) {
		return property[op] || null;
	}

	return null;
};

export const getFilterLabel = (prop: IeObjectsSearchFilterField): string => {
	return (
		{
			[IeObjectsSearchFilterField.QUERY]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___zoekterm'
			),
			[IeObjectsSearchFilterField.ADVANCED]: tText('Geavanceerd'),
			[IeObjectsSearchFilterField.CREATED]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___creatiedatum'
			),
			[IeObjectsSearchFilterField.RELEASE_DATE]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___uitgavedatum'
			),
			[IeObjectsSearchFilterField.CREATOR]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___maker'
			),
			[IeObjectsSearchFilterField.NEWSPAPER_SERIES_NAME]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___reeks'
			),
			[IeObjectsSearchFilterField.LOCATION_CREATED]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___plaats-van-uitgave'
			),
			[IeObjectsSearchFilterField.MENTIONS]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___namenlijst-gesneuvelden'
			),
			[IeObjectsSearchFilterField.NAME]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___titel'
			),
			[IeObjectsSearchFilterField.DESCRIPTION]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___beschrijving'
			),
			[IeObjectsSearchFilterField.DURATION]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___duurtijd'
			),
			[IeObjectsSearchFilterField.GENRE]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___genre'
			),
			[IeObjectsSearchFilterField.LANGUAGE]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___taal'
			),
			[IeObjectsSearchFilterField.FORMAT]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___bestandstype'
			),
			[IeObjectsSearchFilterField.MEDIUM]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___analoge-drager'
			),
			[IeObjectsSearchFilterField.PUBLISHED]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___publicatiedatum'
			),
			[IeObjectsSearchFilterField.PUBLISHER]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___publisher'
			),
			[IeObjectsSearchFilterField.IDENTIFIER]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___identifier'
			),
			[IeObjectsSearchFilterField.CAST]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___cast'
			),
			[IeObjectsSearchFilterField.SPACIAL_COVERAGE]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___locatie-van-de-inhoud'
			),
			[IeObjectsSearchFilterField.TEMPORAL_COVERAGE]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___tijdsperiode-van-de-inhoud'
			),
			[IeObjectsSearchFilterField.OBJECT_TYPE]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___object-type'
			),
			[IeObjectsSearchFilterField.KEYWORD]: tText(
				'modules/visitor-space/utils/advanced-filters/metadata___trefwoord'
			),
			[IeObjectsSearchFilterField.MAINTAINER_SLUG]: tText('Aanbieder'),
			[IeObjectsSearchFilterField.MAINTAINER_ID]: tText('Aanbieders'),
			[IeObjectsSearchFilterField.CONSULTABLE_MEDIA]: tText(
				'modules/visitor-space/const/index___alles-wat-raadpleegbaar-is'
			),
			[IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION]: tText(
				'modules/visitor-space/const/index___enkel-ter-plaatse-beschikbaar'
			),
			[IeObjectsSearchFilterField.CONSULTABLE_PUBLIC_DOMAIN]: tText(
				'modules/visitor-space/const/visitor-space-filters___publiek-domain'
			),
			[IeObjectsSearchFilterField.LICENSES]: tText('Licensie'),
		}[prop] || ''
	);
};
