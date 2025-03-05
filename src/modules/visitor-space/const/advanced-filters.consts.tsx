import { type ReactSelectProps, TextInput, type TextInputProps } from '@meemoo/react-components';
import type { FC } from 'react';

import { tText } from '@shared/helpers/translate';
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

import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import { getFilterLabel } from '@visitor-space/const/advanced-filter-array-param';
import { type FilterValue, Operator } from '@visitor-space/types';
import DurationInput from '../components/DurationInput/DurationInput';

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
	filters?: FilterValue[];
};

export type OperatorAndFilterConfig = {
	[key in Operator]?: FilterConfig;
};

export type AdvancedFiltersConfig = Record<IeObjectsSearchFilterField, OperatorAndFilterConfig>;

export const ADVANCED_FILTERS: IeObjectsSearchFilterField[] = [
	// MetadataProp.Maintainers, // These are handled separately in VisitorSpaceFilterId
	IeObjectsSearchFilterField.DESCRIPTION,
	IeObjectsSearchFilterField.CAST,
	IeObjectsSearchFilterField.TEMPORAL_COVERAGE,
	IeObjectsSearchFilterField.DURATION,
	IeObjectsSearchFilterField.MEDIUM,
	IeObjectsSearchFilterField.GENRE,
	IeObjectsSearchFilterField.IDENTIFIER,
	IeObjectsSearchFilterField.SPACIAL_COVERAGE,
	IeObjectsSearchFilterField.CREATOR,
	IeObjectsSearchFilterField.MENTIONS,
	IeObjectsSearchFilterField.OBJECT_TYPE,
	IeObjectsSearchFilterField.LOCATION_CREATED,
	IeObjectsSearchFilterField.LANGUAGE,
	IeObjectsSearchFilterField.NAME,
	IeObjectsSearchFilterField.KEYWORD,
	IeObjectsSearchFilterField.PUBLISHER,
	IeObjectsSearchFilterField.RELEASE_DATE,
	IeObjectsSearchFilterField.PUBLISHED,
	IeObjectsSearchFilterField.CREATED,
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
		[Operator.GTE]: {
			label: operatorLabels.from,
			inputComponent: DateInput,
			filters: [
				{
					field,
					operator: Operator.GTE,
					multiValue: [],
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
		[Operator.LTE]: {
			label: operatorLabels.until,
			inputComponent: DateInput,
			filters: [
				{
					field,
					operator: Operator.LTE,
					multiValue: [],
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
					operator: Operator.GTE,
					multiValue: [],
				},
				{
					field,
					operator: Operator.LTE,
					multiValue: [],
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
		[Operator.IS]: {
			label: operatorLabels.exact,
			inputComponent: DateInput,
			filters: [
				{
					field,
					operator: Operator.GTE,
					multiValue: [],
				},
				{
					field,
					operator: Operator.LTE,
					multiValue: [],
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
		[Operator.GTE]: {
			label: operatorLabels.longer,
			inputComponent: DurationInput,
			filters: [
				{
					field,
					operator: Operator.GTE,
					multiValue: [],
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
		[Operator.LTE]: {
			label: operatorLabels.shorter,
			inputComponent: DurationInput,
			filters: [
				{
					field,
					operator: Operator.LTE,
					multiValue: [],
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
					operator: Operator.CONTAINS,
					multiValue: [],
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
					operator: Operator.CONTAINS_NOT,
					multiValue: [],
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
		[Operator.IS]: {
			label: operatorLabels.equals,
			inputComponent: inputComponent || TextInput,
			inputComponentProps: inputComponentProps,
			filters: [
				{
					field,
					operator: Operator.IS,
					multiValue: [],
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
		[Operator.IS_NOT]: {
			label: operatorLabels.differs,
			inputComponent: inputComponent || TextInput,
			inputComponentProps: inputComponentProps,
			filters: [
				{
					field,
					operator: Operator.IS_NOT,
					multiValue: [],
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
		[IeObjectsSearchFilterField.QUERY]: {
			...CONTAINS(operatorLabels, IeObjectsSearchFilterField.QUERY),
			...CONTAINS_NOT(operatorLabels, IeObjectsSearchFilterField.QUERY),
		},

		[IeObjectsSearchFilterField.RELEASE_DATE]: {
			...DATE_GREATER_THAN_EQUALS(operatorLabels, IeObjectsSearchFilterField.RELEASE_DATE),
			...DATE_LESS_THAN_OR_EQUALS(operatorLabels, IeObjectsSearchFilterField.RELEASE_DATE),
			...DATE_BETWEEN(operatorLabels, IeObjectsSearchFilterField.RELEASE_DATE),
			...DATE_EQUALS(operatorLabels, IeObjectsSearchFilterField.RELEASE_DATE),
		},

		[IeObjectsSearchFilterField.CREATED]: {
			...DATE_GREATER_THAN_EQUALS(operatorLabels, IeObjectsSearchFilterField.CREATED),
			...DATE_LESS_THAN_OR_EQUALS(operatorLabels, IeObjectsSearchFilterField.CREATED),
			...DATE_BETWEEN(operatorLabels, IeObjectsSearchFilterField.CREATED),
			...DATE_EQUALS(operatorLabels, IeObjectsSearchFilterField.CREATED),
		},

		[IeObjectsSearchFilterField.DURATION]: {
			...DURATION_GREATER_THAN_EQUALS(operatorLabels, IeObjectsSearchFilterField.DURATION),
			...DURATION_LESS_THAN_OR_EQUALS(operatorLabels, IeObjectsSearchFilterField.DURATION),
		},

		[IeObjectsSearchFilterField.PUBLISHED]: {
			...DATE_GREATER_THAN_EQUALS(operatorLabels, IeObjectsSearchFilterField.PUBLISHED),
			...DATE_LESS_THAN_OR_EQUALS(operatorLabels, IeObjectsSearchFilterField.PUBLISHED),
			...DATE_BETWEEN(operatorLabels, IeObjectsSearchFilterField.PUBLISHED),
			...DATE_EQUALS(operatorLabels, IeObjectsSearchFilterField.PUBLISHED),
		},

		[IeObjectsSearchFilterField.DESCRIPTION]: {
			...CONTAINS(operatorLabels, IeObjectsSearchFilterField.DESCRIPTION),
			...CONTAINS_NOT(operatorLabels, IeObjectsSearchFilterField.DESCRIPTION),
		},

		[IeObjectsSearchFilterField.GENRE]: {
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.GENRE, GenreSelect),
			...EQUALS_NOT(operatorLabels, IeObjectsSearchFilterField.GENRE, GenreSelect),
		},

		[IeObjectsSearchFilterField.LANGUAGE]: {
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.LANGUAGE, LanguageSelect),
			...EQUALS_NOT(operatorLabels, IeObjectsSearchFilterField.LANGUAGE, LanguageSelect),
		},

		[IeObjectsSearchFilterField.MEDIUM]: {
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.MEDIUM, MediumSelect),
			...EQUALS_NOT(operatorLabels, IeObjectsSearchFilterField.MEDIUM, MediumSelect),
		},

		[IeObjectsSearchFilterField.SPACIAL_COVERAGE]: {
			...CONTAINS(operatorLabels, IeObjectsSearchFilterField.SPACIAL_COVERAGE),
			...CONTAINS_NOT(operatorLabels, IeObjectsSearchFilterField.SPACIAL_COVERAGE),
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.SPACIAL_COVERAGE),
			...EQUALS_NOT(operatorLabels, IeObjectsSearchFilterField.SPACIAL_COVERAGE),
		},

		[IeObjectsSearchFilterField.TEMPORAL_COVERAGE]: {
			...CONTAINS_AND_EQUALS(operatorLabels, IeObjectsSearchFilterField.TEMPORAL_COVERAGE),
		},

		[IeObjectsSearchFilterField.OBJECT_TYPE]: {
			...CONTAINS_AND_EQUALS(operatorLabels, IeObjectsSearchFilterField.OBJECT_TYPE),
		},

		[IeObjectsSearchFilterField.PUBLISHER]: {
			...CONTAINS_AND_EQUALS(operatorLabels, IeObjectsSearchFilterField.PUBLISHER),
		},

		[IeObjectsSearchFilterField.NAME]: {
			...CONTAINS_AND_EQUALS(operatorLabels, IeObjectsSearchFilterField.NAME),
		},

		[IeObjectsSearchFilterField.CAST]: {
			...CONTAINS_AND_EQUALS(operatorLabels, IeObjectsSearchFilterField.CAST),
		},

		[IeObjectsSearchFilterField.IDENTIFIER]: {
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.IDENTIFIER),
			...EQUALS_NOT(operatorLabels, IeObjectsSearchFilterField.IDENTIFIER),
		},

		[IeObjectsSearchFilterField.KEYWORD]: {
			...CONTAINS_AND_EQUALS(operatorLabels, IeObjectsSearchFilterField.KEYWORD),
		},

		[IeObjectsSearchFilterField.CREATOR]: {
			...CONTAINS_AND_EQUALS(
				operatorLabels,
				IeObjectsSearchFilterField.CREATOR,
				AutocompleteFieldInput,
				{
					fieldName: AutocompleteField.Creator,
					label: getFilterLabel(IeObjectsSearchFilterField.CREATOR),
				}
			),
		},

		[IeObjectsSearchFilterField.LOCATION_CREATED]: {
			...CONTAINS_AND_EQUALS(
				operatorLabels,
				IeObjectsSearchFilterField.LOCATION_CREATED,
				AutocompleteFieldInput,
				{
					fieldName: AutocompleteField.LocationCreated,
					label: getFilterLabel(IeObjectsSearchFilterField.LOCATION_CREATED),
				}
			),
		},

		[IeObjectsSearchFilterField.NEWSPAPER_SERIES_NAME]: {
			...CONTAINS_AND_EQUALS(
				operatorLabels,
				IeObjectsSearchFilterField.NEWSPAPER_SERIES_NAME,
				AutocompleteFieldInput,
				{
					fieldName: AutocompleteField.NewspaperSeriesName,
					label: getFilterLabel(IeObjectsSearchFilterField.NEWSPAPER_SERIES_NAME),
				}
			),
		},

		[IeObjectsSearchFilterField.MENTIONS]: {
			...CONTAINS_AND_EQUALS(
				operatorLabels,
				IeObjectsSearchFilterField.MENTIONS,
				AutocompleteFieldInput,
				{
					fieldName: AutocompleteField.Mentions,
					label: getFilterLabel(IeObjectsSearchFilterField.MENTIONS),
				}
			),
		},

		// These are currently not available under the advanced filters
		[IeObjectsSearchFilterField.FORMAT]: {},
		[IeObjectsSearchFilterField.MAINTAINER_ID]: {},
		[IeObjectsSearchFilterField.MAINTAINER_SLUG]: {},
		[IeObjectsSearchFilterField.CONSULTABLE_ONLY_ON_LOCATION]: {},
		[IeObjectsSearchFilterField.CONSULTABLE_MEDIA]: {},
		[IeObjectsSearchFilterField.CONSULTABLE_PUBLIC_DOMAIN]: {},
		[IeObjectsSearchFilterField.LICENSES]: {},
		[IeObjectsSearchFilterField.ADVANCED]: {},
	};
};

export const getMetadataSearchFilters = (
	prop: IeObjectsSearchFilterField,
	operator: Operator
): FilterValue[] => {
	return FILTERS_OPTIONS_CONFIG()[prop]?.[operator]?.filters || [];
};
