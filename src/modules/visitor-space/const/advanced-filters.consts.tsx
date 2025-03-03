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
import { Operator, SearchFilterId } from '../types';

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
	[key in SearchFilterId]?: OperatorAndFilterConfig;
};

export const ADVANCED_FILTERS: SearchFilterId[] = [
	// MetadataProp.Maintainers, // These are handled separately in VisitorSpaceFilterId
	SearchFilterId.Description,
	SearchFilterId.Cast,
	SearchFilterId.Created,
	SearchFilterId.TemporalCoverage,
	SearchFilterId.Duration,
	SearchFilterId.Medium,
	SearchFilterId.Genre,
	SearchFilterId.Identifier,
	SearchFilterId.SpacialCoverage,
	SearchFilterId.Creator,
	SearchFilterId.Mentions,
	SearchFilterId.ObjectType,
	SearchFilterId.LocationCreated,
	SearchFilterId.Published,
	SearchFilterId.Language,
	SearchFilterId.Title,
	SearchFilterId.Keywords,
	SearchFilterId.Publisher,
];

export const REGULAR_FILTERS: SearchFilterId[] = [
	// MetadataProp.Maintainers, // These are handled separately in VisitorSpaceFilterId
	// MetadataProp.ConsultableMedia,
	// MetadataProp.ConsultableOnlyOnLocation,
	// MetadataProp.ConsultablePublicDomain,
	SearchFilterId.ReleaseDate,
	SearchFilterId.Medium,
	SearchFilterId.Creator,
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
		[SearchFilterId.ReleaseDate]: {
			...DATE_GREATER_THAN_EQUALS(operatorLabels, IeObjectsSearchFilterField.RELEASE_DATE),
			...DATE_LESS_THAN_OR_EQUALS(operatorLabels, IeObjectsSearchFilterField.RELEASE_DATE),
			...DATE_BETWEEN(operatorLabels, IeObjectsSearchFilterField.RELEASE_DATE),
			...DATE_EQUALS(operatorLabels, IeObjectsSearchFilterField.RELEASE_DATE),
		},

		[SearchFilterId.Created]: {
			...DATE_GREATER_THAN_EQUALS(operatorLabels, IeObjectsSearchFilterField.CREATED),
			...DATE_LESS_THAN_OR_EQUALS(operatorLabels, IeObjectsSearchFilterField.CREATED),
			...DATE_BETWEEN(operatorLabels, IeObjectsSearchFilterField.CREATED),
			...DATE_EQUALS(operatorLabels, IeObjectsSearchFilterField.CREATED),
		},

		[SearchFilterId.Duration]: {
			...DURATION_GREATER_THAN_EQUALS(operatorLabels, IeObjectsSearchFilterField.DURATION),
			...DURATION_LESS_THAN_OR_EQUALS(operatorLabels, IeObjectsSearchFilterField.DURATION),
		},

		[SearchFilterId.Published]: {
			...DATE_GREATER_THAN_EQUALS(operatorLabels, IeObjectsSearchFilterField.PUBLISHED),
			...DATE_LESS_THAN_OR_EQUALS(operatorLabels, IeObjectsSearchFilterField.PUBLISHED),
			...DATE_BETWEEN(operatorLabels, IeObjectsSearchFilterField.PUBLISHED),
			...DATE_EQUALS(operatorLabels, IeObjectsSearchFilterField.PUBLISHED),
		},

		[SearchFilterId.Description]: {
			...CONTAINS(operatorLabels, IeObjectsSearchFilterField.DESCRIPTION),
			...CONTAINS_NOT(operatorLabels, IeObjectsSearchFilterField.DESCRIPTION),
		},

		[SearchFilterId.Genre]: {
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.GENRE, GenreSelect),
			...EQUALS_NOT(operatorLabels, IeObjectsSearchFilterField.GENRE, GenreSelect),
		},

		[SearchFilterId.Language]: {
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.LANGUAGE, LanguageSelect),
			...EQUALS_NOT(operatorLabels, IeObjectsSearchFilterField.LANGUAGE, LanguageSelect),
		},

		[SearchFilterId.Medium]: {
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.MEDIUM, MediumSelect),
			...EQUALS_NOT(operatorLabels, IeObjectsSearchFilterField.MEDIUM, MediumSelect),
		},

		[SearchFilterId.SpacialCoverage]: {
			...CONTAINS(operatorLabels, IeObjectsSearchFilterField.SPACIAL_COVERAGE),
			...CONTAINS_NOT(operatorLabels, IeObjectsSearchFilterField.SPACIAL_COVERAGE),
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.SPACIAL_COVERAGE),
			...EQUALS_NOT(operatorLabels, IeObjectsSearchFilterField.SPACIAL_COVERAGE),
		},

		[SearchFilterId.TemporalCoverage]: {
			...CONTAINS_AND_EQUALS(operatorLabels, IeObjectsSearchFilterField.TEMPORAL_COVERAGE),
		},

		[SearchFilterId.ObjectType]: {
			...CONTAINS_AND_EQUALS(operatorLabels, IeObjectsSearchFilterField.OBJECT_TYPE),
		},

		[SearchFilterId.Publisher]: {
			...CONTAINS_AND_EQUALS(operatorLabels, IeObjectsSearchFilterField.PUBLISHER),
		},

		[SearchFilterId.Title]: {
			...CONTAINS_AND_EQUALS(operatorLabels, IeObjectsSearchFilterField.NAME),
		},

		[SearchFilterId.Cast]: {
			...CONTAINS_AND_EQUALS(operatorLabels, IeObjectsSearchFilterField.CAST),
		},

		[SearchFilterId.Identifier]: {
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.IDENTIFIER),
			...EQUALS_NOT(operatorLabels, IeObjectsSearchFilterField.IDENTIFIER),
		},

		[SearchFilterId.Keywords]: {
			...CONTAINS_AND_EQUALS(operatorLabels, IeObjectsSearchFilterField.KEYWORD),
		},

		[SearchFilterId.Creator]: {
			...CONTAINS_AND_EQUALS(
				operatorLabels,
				IeObjectsSearchFilterField.CREATOR,
				AutocompleteFieldInput,
				{
					fieldName: AutocompleteField.Creator,
					label: getFilterLabel(SearchFilterId.Creator),
				}
			),
		},

		[SearchFilterId.LocationCreated]: {
			...CONTAINS_AND_EQUALS(
				operatorLabels,
				IeObjectsSearchFilterField.LOCATION_CREATED,
				AutocompleteFieldInput,
				{
					fieldName: AutocompleteField.LocationCreated,
					label: getFilterLabel(SearchFilterId.LocationCreated),
				}
			),
		},

		[SearchFilterId.NewspaperSeriesName]: {
			...CONTAINS_AND_EQUALS(
				operatorLabels,
				IeObjectsSearchFilterField.NEWSPAPER_SERIES_NAME,
				AutocompleteFieldInput,
				{
					fieldName: AutocompleteField.NewspaperSeriesName,
					label: getFilterLabel(SearchFilterId.NewspaperSeriesName),
				}
			),
		},

		[SearchFilterId.Mentions]: {
			...CONTAINS_AND_EQUALS(
				operatorLabels,
				IeObjectsSearchFilterField.MENTIONS,
				AutocompleteFieldInput,
				{
					fieldName: AutocompleteField.Mentions,
					label: getFilterLabel(SearchFilterId.Mentions),
				}
			),
		},
	};
};

export const getMetadataSearchFilters = (
	prop: SearchFilterId,
	operator: Operator
): IeObjectsSearchFilter[] => {
	return FILTERS_OPTIONS_CONFIG()[prop]?.[operator]?.filters || [];
};
