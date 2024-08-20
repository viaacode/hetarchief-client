import { type ReactSelectProps, TextInput, type TextInputProps } from '@meemoo/react-components';
import { type FC } from 'react';

import { tText } from '@shared/helpers/translate';
import { Operator } from '@shared/types';
import {
	type IeObjectsSearchFilter,
	IeObjectsSearchFilterField,
	IeObjectsSearchOperator,
} from '@shared/types/ie-objects';
import { DateInput } from '@visitor-space/components/DateInput';
import { type DateInputProps } from '@visitor-space/components/DateInput/DateInput';
import { DateRangeInput } from '@visitor-space/components/DateRangeInput';
import { type DateRangeInputProps } from '@visitor-space/components/DateRangeInput/DateRangeInput';
import { GenreSelect } from '@visitor-space/components/GenreSelect';

import { MetadataProp } from '../types';

export type MetadataFields =
	| FC<TextInputProps>
	| FC<ReactSelectProps>
	| FC<DateInputProps>
	| FC<DateRangeInputProps>;
export type MetadataFieldProps = TextInputProps | ReactSelectProps | DateInputProps;

export type MetadataConfig = {
	[key in MetadataProp]?: {
		[key in Operator]?: {
			label: string;
			field: MetadataFields;
			filters?: IeObjectsSearchFilter[];
		};
	};
};

export const ADVANCED_FILTERS: MetadataProp[] = [
	// MetadataProp.Maintainers, // These are handled separately in VisitorSpaceFilterId
	MetadataProp.Description,
	MetadataProp.Cast,
	MetadataProp.CreatedAt,
	MetadataProp.TemporalCoverage,
	MetadataProp.Duration,
	MetadataProp.Medium,
	MetadataProp.Genre,
	MetadataProp.Identifier,
	MetadataProp.SpacialCoverage,
	MetadataProp.Creator,
	// TODO add Names of fallen soldiers list here
	MetadataProp.ObjectType,
	// TODO Location of publication
	MetadataProp.PublishedAt,
	MetadataProp.Language,
	MetadataProp.Title,
	MetadataProp.Keywords,
	MetadataProp.Publisher,
];

export const REGULAR_FILTERS: MetadataProp[] = [
	// MetadataProp.Maintainers, // These are handled separately in VisitorSpaceFilterId
	// MetadataProp.ConsultableMedia,
	// MetadataProp.ConsultableOnlyOnLocation,
	// MetadataProp.ConsultablePublicDomain,
	MetadataProp.ReleaseDate,
	MetadataProp.Medium,
	MetadataProp.Creator,
	// TODO Location of publication
];

export const GET_OPERATOR_LABELS = (): Record<string, string> => ({
	from: tText(
		'modules/visitor-space/components/advanced-filter-fields/advanced-filter-fields___vanaf'
	),
	until: tText(
		'modules/visitor-space/components/advanced-filter-fields/advanced-filter-fields___tot-en-met'
	),
	between: tText(
		'modules/visitor-space/components/advanced-filter-fields/advanced-filter-fields___tussen'
	),
	contains: tText(
		'modules/visitor-space/components/advanced-filter-fields/advanced-filter-fields___bevat'
	),
	excludes: tText(
		'modules/visitor-space/components/advanced-filter-fields/advanced-filter-fields___bevat-niet'
	),
	equals: tText(
		'modules/visitor-space/components/advanced-filter-fields/advanced-filter-fields___is'
	),
	differs: tText(
		'modules/visitor-space/components/advanced-filter-fields/advanced-filter-fields___is-niet'
	),
	shorter: tText(
		'modules/visitor-space/components/advanced-filter-fields/advanced-filter-fields___korter-dan'
	),
	longer: tText(
		'modules/visitor-space/components/advanced-filter-fields/advanced-filter-fields___langer-dan'
	),
	exact: tText(
		'modules/visitor-space/components/advanced-filter-fields/advanced-filter-fields___exact'
	),
});

const DATE_GREATER_THAN_EQUALS = (
	operatorLabels: Record<string, string>,
	field: IeObjectsSearchFilterField
) => {
	return {
		[Operator.GreaterThanOrEqual]: {
			label: operatorLabels.from,
			field: DateInput,
			filters: [
				{
					field,
					operator: IeObjectsSearchOperator.GTE,
				},
			],
		},
	};
};

const DATE_LESS_THAN_OR_EQUALS = (
	operatorLabels: Record<string, string>,
	field: IeObjectsSearchFilterField
) => {
	return {
		[Operator.LessThanOrEqual]: {
			label: operatorLabels.until,
			field: DateInput,
			filters: [
				{
					field,
					operator: IeObjectsSearchOperator.LTE,
				},
			],
		},
	};
};

const DATE_BETWEEN = (
	operatorLabels: Record<string, string>,
	field: IeObjectsSearchFilterField
) => {
	return {
		[Operator.Between]: {
			label: operatorLabels.between,
			field: DateRangeInput,
			filters: [
				{
					field,
					operator: IeObjectsSearchOperator.GTE,
				},
				{
					field,
					operator: IeObjectsSearchOperator.LTE,
				},
			],
		},
	};
};

const DATE_EQUALS = (operatorLabels: Record<string, string>, field: IeObjectsSearchFilterField) => {
	return {
		[Operator.Equals]: {
			label: operatorLabels.exact,
			field: DateInput,
			filters: [
				{
					field,
					operator: IeObjectsSearchOperator.GTE,
				},
				{
					field,
					operator: IeObjectsSearchOperator.LTE,
				},
			],
		},
	};
};

const CONTAINS = (operatorLabels: Record<string, string>, field: IeObjectsSearchFilterField) => {
	return {
		[Operator.Contains]: {
			label: operatorLabels.contains,
			field: TextInput,
			filters: [
				{
					field,
					operator: IeObjectsSearchOperator.CONTAINS,
				},
			],
		},
	};
};

const CONTAINS_NOT = (
	operatorLabels: Record<string, string>,
	field: IeObjectsSearchFilterField
) => {
	return {
		[Operator.ContainsNot]: {
			label: operatorLabels.excludes,
			field: TextInput,
			filters: [
				{
					field,
					operator: IeObjectsSearchOperator.CONTAINS_NOT,
				},
			],
		},
	};
};

const EQUALS = (operatorLabels: Record<string, string>, field: IeObjectsSearchFilterField) => {
	return {
		[Operator.Equals]: {
			label: operatorLabels.equals,
			field: GenreSelect,
			filters: [
				{
					field,
					operator: IeObjectsSearchOperator.IS,
				},
			],
		},
	};
};

const EQUALS_NOT = (operatorLabels: Record<string, string>, field: IeObjectsSearchFilterField) => {
	return {
		[Operator.EqualsNot]: {
			label: operatorLabels.differs,
			field: GenreSelect,
			filters: [
				{
					field,
					operator: IeObjectsSearchOperator.IS_NOT,
				},
			],
		},
	};
};

export const FILTERS_OPTIONS_CONFIG = (): MetadataConfig => {
	const operatorLabels = GET_OPERATOR_LABELS();

	return {
		[MetadataProp.ReleaseDate]: {
			...DATE_GREATER_THAN_EQUALS(operatorLabels, IeObjectsSearchFilterField.RELEASE_DATE),
			...DATE_LESS_THAN_OR_EQUALS(operatorLabels, IeObjectsSearchFilterField.RELEASE_DATE),
			...DATE_BETWEEN(operatorLabels, IeObjectsSearchFilterField.RELEASE_DATE),
			...DATE_EQUALS(operatorLabels, IeObjectsSearchFilterField.RELEASE_DATE),
		},

		[MetadataProp.CreatedAt]: {
			...DATE_GREATER_THAN_EQUALS(operatorLabels, IeObjectsSearchFilterField.CREATED),
			...DATE_LESS_THAN_OR_EQUALS(operatorLabels, IeObjectsSearchFilterField.CREATED),
			...DATE_BETWEEN(operatorLabels, IeObjectsSearchFilterField.CREATED),
			...DATE_EQUALS(operatorLabels, IeObjectsSearchFilterField.CREATED),
		},

		[MetadataProp.Duration]: {
			...DATE_GREATER_THAN_EQUALS(operatorLabels, IeObjectsSearchFilterField.DURATION),
			...DATE_LESS_THAN_OR_EQUALS(operatorLabels, IeObjectsSearchFilterField.DURATION),
			...DATE_BETWEEN(operatorLabels, IeObjectsSearchFilterField.DURATION),
			...DATE_EQUALS(operatorLabels, IeObjectsSearchFilterField.DURATION),
		},

		[MetadataProp.PublishedAt]: {
			...DATE_GREATER_THAN_EQUALS(operatorLabels, IeObjectsSearchFilterField.PUBLISHED),
			...DATE_LESS_THAN_OR_EQUALS(operatorLabels, IeObjectsSearchFilterField.PUBLISHED),
			...DATE_BETWEEN(operatorLabels, IeObjectsSearchFilterField.PUBLISHED),
			...DATE_EQUALS(operatorLabels, IeObjectsSearchFilterField.PUBLISHED),
		},

		[MetadataProp.Description]: {
			...CONTAINS(operatorLabels, IeObjectsSearchFilterField.DESCRIPTION),
			...CONTAINS_NOT(operatorLabels, IeObjectsSearchFilterField.DESCRIPTION),
		},

		[MetadataProp.Genre]: {
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.GENRE),
			...EQUALS_NOT(operatorLabels, IeObjectsSearchFilterField.GENRE),
		},

		[MetadataProp.SpacialCoverage]: {
			...CONTAINS(operatorLabels, IeObjectsSearchFilterField.SPACIAL_COVERAGE),
			...CONTAINS_NOT(operatorLabels, IeObjectsSearchFilterField.SPACIAL_COVERAGE),
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.SPACIAL_COVERAGE),
			...EQUALS_NOT(operatorLabels, IeObjectsSearchFilterField.SPACIAL_COVERAGE),
		},

		[MetadataProp.TemporalCoverage]: {
			...CONTAINS(operatorLabels, IeObjectsSearchFilterField.TEMPORAL_COVERAGE),
			...CONTAINS_NOT(operatorLabels, IeObjectsSearchFilterField.TEMPORAL_COVERAGE),
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.TEMPORAL_COVERAGE),
			...EQUALS_NOT(operatorLabels, IeObjectsSearchFilterField.TEMPORAL_COVERAGE),
		},

		[MetadataProp.ObjectType]: {
			...CONTAINS(operatorLabels, IeObjectsSearchFilterField.OBJECT_TYPE),
			...CONTAINS_NOT(operatorLabels, IeObjectsSearchFilterField.OBJECT_TYPE),
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.OBJECT_TYPE),
			...CONTAINS_NOT(operatorLabels, IeObjectsSearchFilterField.OBJECT_TYPE),
		},

		[MetadataProp.Publisher]: {
			...CONTAINS(operatorLabels, IeObjectsSearchFilterField.PUBLISHER),
			...CONTAINS_NOT(operatorLabels, IeObjectsSearchFilterField.PUBLISHER),
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.PUBLISHER),
			...CONTAINS_NOT(operatorLabels, IeObjectsSearchFilterField.PUBLISHER),
		},

		[MetadataProp.Title]: {
			...CONTAINS(operatorLabels, IeObjectsSearchFilterField.NAME),
			...CONTAINS_NOT(operatorLabels, IeObjectsSearchFilterField.NAME),
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.NAME),
			...CONTAINS_NOT(operatorLabels, IeObjectsSearchFilterField.NAME),
		},

		[MetadataProp.Cast]: {
			...CONTAINS(operatorLabels, IeObjectsSearchFilterField.CAST),
			...CONTAINS_NOT(operatorLabels, IeObjectsSearchFilterField.CAST),
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.CAST),
			...CONTAINS_NOT(operatorLabels, IeObjectsSearchFilterField.CAST),
		},

		[MetadataProp.Identifier]: {
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.IDENTIFIER),
			...CONTAINS_NOT(operatorLabels, IeObjectsSearchFilterField.IDENTIFIER),
		},

		[MetadataProp.Keywords]: {
			...CONTAINS(operatorLabels, IeObjectsSearchFilterField.KEYWORD),
			...CONTAINS_NOT(operatorLabels, IeObjectsSearchFilterField.KEYWORD),
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.KEYWORD),
			...CONTAINS_NOT(operatorLabels, IeObjectsSearchFilterField.KEYWORD),
		},
	};
};

export const getMetadataSearchFilters = (
	prop: MetadataProp,
	operator: Operator
): IeObjectsSearchFilter[] => {
	return FILTERS_OPTIONS_CONFIG()[prop]?.[operator]?.filters || [];
};
