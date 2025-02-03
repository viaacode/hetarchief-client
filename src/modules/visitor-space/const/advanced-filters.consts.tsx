import { type ReactSelectProps, TextInput, type TextInputProps } from '@meemoo/react-components';
import type { FC } from 'react';

import { tText } from '@shared/helpers/translate';
import {
	type IeObjectsSearchFilter,
	IeObjectsSearchFilterField,
	IeObjectsSearchOperator,
} from '@shared/types/ie-objects';
import AutocompleteFieldInput, {
	type AutocompleteFieldInputProps,
} from '@visitor-space/components/AutocompleteFieldInput/AutocompleteFieldInput';
import { DateInput } from '@visitor-space/components/DateInput';
import type { DateInputProps } from '@visitor-space/components/DateInput/DateInput';
import { DateRangeInput } from '@visitor-space/components/DateRangeInput';
import type { DateRangeInputProps } from '@visitor-space/components/DateRangeInput/DateRangeInput';
import { AutocompleteField } from '@visitor-space/components/FilterMenu/FilterMenu.types';
import { GenreSelect } from '@visitor-space/components/GenreSelect';
import { LanguageSelect } from '@visitor-space/components/LanguageSelect/LanguageSelect';
import { MediumSelect } from '@visitor-space/components/MediumSelect/MediumSelect';
import { getFilterLabel } from '@visitor-space/utils/advanced-filters';

import DurationInput from '../components/DurationInput/DurationInput';
import { FilterProperty, Operator } from '../types';

export type FilterInputComponent =
	| FC<TextInputProps>
	| FC<ReactSelectProps>
	| FC<DateInputProps>
	| FC<DateRangeInputProps>
	| FC<AutocompleteField>;
export type FilterInputComponentProps =
	| TextInputProps
	| ReactSelectProps
	| DateInputProps
	| DateRangeInputProps
	| AutocompleteFieldInputProps;

export type FilterConfig = {
	label: string;
	inputComponent: FilterInputComponent;
	inputComponentProps?: FilterInputComponentProps;
	filters?: IeObjectsSearchFilter[];
};

export type OperatorAndFilterConfig = {
	[key in Operator]?: FilterConfig;
};

export type AdvancedFiltersConfig = {
	[key in FilterProperty]?: OperatorAndFilterConfig;
};

export const ADVANCED_FILTERS: FilterProperty[] = [
	// MetadataProp.Maintainers, // These are handled separately in VisitorSpaceFilterId
	FilterProperty.DESCRIPTION,
	FilterProperty.CAST,
	FilterProperty.CREATED_AT,
	FilterProperty.TEMPORAL_COVERAGE,
	FilterProperty.DURATION,
	FilterProperty.MEDIUM,
	FilterProperty.GENRE,
	FilterProperty.IDENTIFIER,
	FilterProperty.SPACIAL_COVERAGE,
	FilterProperty.CREATOR,
	FilterProperty.MENTIONS,
	FilterProperty.OBJECT_TYPE,
	FilterProperty.LOCATION_CREATED,
	FilterProperty.PUBLISHED_AT,
	FilterProperty.LANGUAGE,
	FilterProperty.TITLE,
	FilterProperty.KEYWORDS,
	FilterProperty.PUBLISHER,
];

export const REGULAR_FILTERS: FilterProperty[] = [
	// MetadataProp.Maintainers, // These are handled separately in VisitorSpaceFilterId
	// MetadataProp.ConsultableMedia,
	// MetadataProp.ConsultableOnlyOnLocation,
	// MetadataProp.ConsultablePublicDomain,
	FilterProperty.RELEASE_DATE,
	FilterProperty.MEDIUM,
	FilterProperty.CREATOR,
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
): OperatorAndFilterConfig => {
	return {
		[Operator.GREATER_THAN_OR_EQUAL]: {
			label: operatorLabels.from,
			inputComponent: DateInput,
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
): OperatorAndFilterConfig => {
	return {
		[Operator.LESS_THAN_OR_EQUAL]: {
			label: operatorLabels.until,
			inputComponent: DateInput,
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
): OperatorAndFilterConfig => {
	return {
		[Operator.BETWEEN]: {
			label: operatorLabels.between,
			inputComponent: DateRangeInput,
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

const DATE_EQUALS = (
	operatorLabels: Record<string, string>,
	field: IeObjectsSearchFilterField
): OperatorAndFilterConfig => {
	return {
		[Operator.EQUALS]: {
			label: operatorLabels.exact,
			inputComponent: DateInput,
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

const DURATION_GREATER_THAN_EQUALS = (
	operatorLabels: Record<string, string>,
	field: IeObjectsSearchFilterField
): OperatorAndFilterConfig => {
	return {
		[Operator.GREATER_THAN_OR_EQUAL]: {
			label: operatorLabels.longer,
			inputComponent: DurationInput,
			filters: [
				{
					field,
					operator: IeObjectsSearchOperator.GTE,
				},
			],
		},
	};
};

const DURATION_LESS_THAN_OR_EQUALS = (
	operatorLabels: Record<string, string>,
	field: IeObjectsSearchFilterField
): OperatorAndFilterConfig => {
	return {
		[Operator.LESS_THAN_OR_EQUAL]: {
			label: operatorLabels.shorter,
			inputComponent: DurationInput,
			filters: [
				{
					field,
					operator: IeObjectsSearchOperator.LTE,
				},
			],
		},
	};
};

const CONTAINS = (
	operatorLabels: Record<string, string>,
	field: IeObjectsSearchFilterField,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	inputComponent?: FC<any>,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	inputComponentProps?: any
): OperatorAndFilterConfig => {
	return {
		[Operator.CONTAINS]: {
			label: operatorLabels.contains,
			inputComponent: inputComponent || TextInput,
			inputComponentProps: inputComponentProps,
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
	field: IeObjectsSearchFilterField,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	inputComponent?: FC<any>,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	inputComponentProps?: any
): OperatorAndFilterConfig => {
	return {
		[Operator.CONTAINS_NOT]: {
			label: operatorLabels.excludes,
			inputComponent: inputComponent || TextInput,
			inputComponentProps: inputComponentProps,
			filters: [
				{
					field,
					operator: IeObjectsSearchOperator.CONTAINS_NOT,
				},
			],
		},
	};
};

const EQUALS = (
	operatorLabels: Record<string, string>,
	field: IeObjectsSearchFilterField,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	inputComponent?: FC<any>,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	inputComponentProps?: any
): OperatorAndFilterConfig => {
	return {
		[Operator.EQUALS]: {
			label: operatorLabels.equals,
			inputComponent: inputComponent || TextInput,
			inputComponentProps: inputComponentProps,
			filters: [
				{
					field,
					operator: IeObjectsSearchOperator.IS,
				},
			],
		},
	};
};

const EQUALS_NOT = (
	operatorLabels: Record<string, string>,
	field: IeObjectsSearchFilterField,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	inputComponent?: FC<any>,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	inputComponentProps?: any
): OperatorAndFilterConfig => {
	return {
		[Operator.EQUALS_NOT]: {
			label: operatorLabels.differs,
			inputComponent: inputComponent || TextInput,
			inputComponentProps: inputComponentProps,
			filters: [
				{
					field,
					operator: IeObjectsSearchOperator.IS_NOT,
				},
			],
		},
	};
};

const CONTAINS_AND_EQUALS = (
	operatorLabels: Record<string, string>,
	field: IeObjectsSearchFilterField,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	inputComponent?: FC<any>,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	inputComponentProps?: any
): OperatorAndFilterConfig => {
	return {
		...CONTAINS(operatorLabels, field, inputComponent, inputComponentProps),
		...CONTAINS_NOT(operatorLabels, field, inputComponent, inputComponentProps),
		...EQUALS(operatorLabels, field, inputComponent, inputComponentProps),
		...EQUALS_NOT(operatorLabels, field, inputComponent, inputComponentProps),
	};
};

export const FILTERS_OPTIONS_CONFIG = (): AdvancedFiltersConfig => {
	const operatorLabels = GET_OPERATOR_LABELS();

	return {
		[FilterProperty.RELEASE_DATE]: {
			...DATE_GREATER_THAN_EQUALS(operatorLabels, IeObjectsSearchFilterField.RELEASE_DATE),
			...DATE_LESS_THAN_OR_EQUALS(operatorLabels, IeObjectsSearchFilterField.RELEASE_DATE),
			...DATE_BETWEEN(operatorLabels, IeObjectsSearchFilterField.RELEASE_DATE),
			...DATE_EQUALS(operatorLabels, IeObjectsSearchFilterField.RELEASE_DATE),
		},

		[FilterProperty.CREATED_AT]: {
			...DATE_GREATER_THAN_EQUALS(operatorLabels, IeObjectsSearchFilterField.CREATED),
			...DATE_LESS_THAN_OR_EQUALS(operatorLabels, IeObjectsSearchFilterField.CREATED),
			...DATE_BETWEEN(operatorLabels, IeObjectsSearchFilterField.CREATED),
			...DATE_EQUALS(operatorLabels, IeObjectsSearchFilterField.CREATED),
		},

		[FilterProperty.DURATION]: {
			...DURATION_GREATER_THAN_EQUALS(operatorLabels, IeObjectsSearchFilterField.DURATION),
			...DURATION_LESS_THAN_OR_EQUALS(operatorLabels, IeObjectsSearchFilterField.DURATION),
		},

		[FilterProperty.PUBLISHED_AT]: {
			...DATE_GREATER_THAN_EQUALS(operatorLabels, IeObjectsSearchFilterField.PUBLISHED),
			...DATE_LESS_THAN_OR_EQUALS(operatorLabels, IeObjectsSearchFilterField.PUBLISHED),
			...DATE_BETWEEN(operatorLabels, IeObjectsSearchFilterField.PUBLISHED),
			...DATE_EQUALS(operatorLabels, IeObjectsSearchFilterField.PUBLISHED),
		},

		[FilterProperty.DESCRIPTION]: {
			...CONTAINS(operatorLabels, IeObjectsSearchFilterField.DESCRIPTION),
			...CONTAINS_NOT(operatorLabels, IeObjectsSearchFilterField.DESCRIPTION),
		},

		[FilterProperty.GENRE]: {
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.GENRE, GenreSelect),
			...EQUALS_NOT(operatorLabels, IeObjectsSearchFilterField.GENRE, GenreSelect),
		},

		[FilterProperty.LANGUAGE]: {
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.LANGUAGE, LanguageSelect),
			...EQUALS_NOT(operatorLabels, IeObjectsSearchFilterField.LANGUAGE, LanguageSelect),
		},

		[FilterProperty.MEDIUM]: {
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.MEDIUM, MediumSelect),
			...EQUALS_NOT(operatorLabels, IeObjectsSearchFilterField.MEDIUM, MediumSelect),
		},

		[FilterProperty.SPACIAL_COVERAGE]: {
			...CONTAINS(operatorLabels, IeObjectsSearchFilterField.SPACIAL_COVERAGE),
			...CONTAINS_NOT(operatorLabels, IeObjectsSearchFilterField.SPACIAL_COVERAGE),
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.SPACIAL_COVERAGE),
			...EQUALS_NOT(operatorLabels, IeObjectsSearchFilterField.SPACIAL_COVERAGE),
		},

		[FilterProperty.TEMPORAL_COVERAGE]: {
			...CONTAINS_AND_EQUALS(operatorLabels, IeObjectsSearchFilterField.TEMPORAL_COVERAGE),
		},

		[FilterProperty.OBJECT_TYPE]: {
			...CONTAINS_AND_EQUALS(operatorLabels, IeObjectsSearchFilterField.OBJECT_TYPE),
		},

		[FilterProperty.PUBLISHER]: {
			...CONTAINS_AND_EQUALS(operatorLabels, IeObjectsSearchFilterField.PUBLISHER),
		},

		[FilterProperty.TITLE]: {
			...CONTAINS_AND_EQUALS(operatorLabels, IeObjectsSearchFilterField.NAME),
		},

		[FilterProperty.CAST]: {
			...CONTAINS_AND_EQUALS(operatorLabels, IeObjectsSearchFilterField.CAST),
		},

		[FilterProperty.IDENTIFIER]: {
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.IDENTIFIER),
			...EQUALS_NOT(operatorLabels, IeObjectsSearchFilterField.IDENTIFIER),
		},

		[FilterProperty.KEYWORDS]: {
			...CONTAINS_AND_EQUALS(operatorLabels, IeObjectsSearchFilterField.KEYWORD),
		},

		[FilterProperty.CREATOR]: {
			...CONTAINS_AND_EQUALS(
				operatorLabels,
				IeObjectsSearchFilterField.CREATOR,
				AutocompleteFieldInput,
				{
					fieldName: AutocompleteField.creator,
					label: getFilterLabel(FilterProperty.CREATOR),
				}
			),
		},

		[FilterProperty.LOCATION_CREATED]: {
			...CONTAINS_AND_EQUALS(
				operatorLabels,
				IeObjectsSearchFilterField.LOCATION_CREATED,
				AutocompleteFieldInput,
				{
					fieldName: AutocompleteField.locationCreated,
					label: getFilterLabel(FilterProperty.LOCATION_CREATED),
				}
			),
		},

		[FilterProperty.NEWSPAPER_SERIES_NAME]: {
			...CONTAINS_AND_EQUALS(
				operatorLabels,
				IeObjectsSearchFilterField.NEWSPAPER_SERIES_NAME,
				AutocompleteFieldInput,
				{
					fieldName: AutocompleteField.newspaperSeriesName,
					label: getFilterLabel(FilterProperty.NEWSPAPER_SERIES_NAME),
				}
			),
		},

		[FilterProperty.MENTIONS]: {
			...CONTAINS_AND_EQUALS(
				operatorLabels,
				IeObjectsSearchFilterField.MENTIONS,
				AutocompleteFieldInput,
				{
					fieldName: AutocompleteField.mentions,
					label: getFilterLabel(FilterProperty.MENTIONS),
				}
			),
		},
	};
};

export const getMetadataSearchFilters = (
	prop: FilterProperty,
	operator: Operator
): IeObjectsSearchFilter[] => {
	return FILTERS_OPTIONS_CONFIG()[prop]?.[operator]?.filters || [];
};
