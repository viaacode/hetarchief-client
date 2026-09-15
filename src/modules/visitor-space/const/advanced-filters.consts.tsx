import { GroupName } from '@account/const';
import { type ReactSelectProps, TextInput, type TextInputProps } from '@meemoo/react-components';
import {
	type IeObjectsSearchFilter,
	IeObjectsSearchFilterField,
	IeObjectsSearchOperator,
	SearchPageMediaType,
} from '@shared/types/ie-objects';
import { AdvancedRightsSelect } from '@visitor-space/components/AdvancedRightsSelect/AdvancedRightsSelect';
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
import { ThemeSelect } from '@visitor-space/components/ThemeSelect';
import { getFilterLabel } from '@visitor-space/utils/advanced-filters';
import type { FC } from 'react';
import DurationInput from '../components/DurationInput/DurationInput';
import { SearchFilterId } from '../types';
import { getOperatorLabels, type OperatorLabels } from './operator-labels.const';

type FilterInputComponent =
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

type OperatorAndFilterConfig = {
	[key in IeObjectsSearchOperator]?: FilterConfig;
};

export type AdvancedFiltersConfig = {
	[key in SearchFilterId]?: OperatorAndFilterConfig;
};

export interface AdvancedFilterVisibilityContext {
	selectedTab: SearchPageMediaType;
	userGroup: GroupName;
}

export interface AdvancedFilterOption {
	type: SearchFilterId;
	/**
	 * Whether the property can be picked in the advanced filter form.
	 * Omit it for properties that are available to every user, on every tab.
	 */
	isVisible?: (context: AdvancedFilterVisibilityContext) => boolean;
}

export const ADVANCED_FILTERS: AdvancedFilterOption[] = [
	// MetadataProp.Maintainers, // These are handled separately in VisitorSpaceFilterId
	{ type: SearchFilterId.Description },
	{ type: SearchFilterId.Cast },
	{ type: SearchFilterId.Created },
	{ type: SearchFilterId.TemporalCoverage },
	{
		type: SearchFilterId.Theme,
		// Themes are only assigned to audio and video objects, not to newspapers, and are not
		// offered to kiosk users: https://meemoo.atlassian.net/browse/ARC-3797
		isVisible: ({ selectedTab, userGroup }) =>
			selectedTab !== SearchPageMediaType.Newspaper && userGroup !== GroupName.KIOSK_VISITOR,
	},
	{
		type: SearchFilterId.Duration,
		// Newspapers have no duration
		isVisible: ({ selectedTab }) => selectedTab !== SearchPageMediaType.Newspaper,
	},
	{ type: SearchFilterId.Medium },
	{ type: SearchFilterId.Genre },
	{ type: SearchFilterId.Identifier },
	{ type: SearchFilterId.SpacialCoverage },
	{ type: SearchFilterId.Creator },
	{ type: SearchFilterId.Mentions },
	{ type: SearchFilterId.ObjectType },
	{ type: SearchFilterId.LocationCreated },
	{ type: SearchFilterId.Rights },
	{ type: SearchFilterId.Published },
	{ type: SearchFilterId.Language },
	{ type: SearchFilterId.Title },
	{ type: SearchFilterId.Keywords },
	{ type: SearchFilterId.Publisher },
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

const DATE_GREATER_THAN_EQUALS = (
	operatorLabels: OperatorLabels,
	field: IeObjectsSearchFilterField
): OperatorAndFilterConfig => {
	return {
		[IeObjectsSearchOperator.GTE]: {
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
	operatorLabels: OperatorLabels,
	field: IeObjectsSearchFilterField
): OperatorAndFilterConfig => {
	return {
		[IeObjectsSearchOperator.LTE]: {
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
	operatorLabels: OperatorLabels,
	field: IeObjectsSearchFilterField
): OperatorAndFilterConfig => {
	return {
		[IeObjectsSearchOperator.BETWEEN]: {
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
	operatorLabels: OperatorLabels,
	field: IeObjectsSearchFilterField
): OperatorAndFilterConfig => {
	return {
		[IeObjectsSearchOperator.IS]: {
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
	operatorLabels: OperatorLabels,
	field: IeObjectsSearchFilterField
): OperatorAndFilterConfig => {
	return {
		[IeObjectsSearchOperator.GTE]: {
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
	operatorLabels: OperatorLabels,
	field: IeObjectsSearchFilterField
): OperatorAndFilterConfig => {
	return {
		[IeObjectsSearchOperator.LTE]: {
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
	operatorLabels: OperatorLabels,
	field: IeObjectsSearchFilterField,
	// biome-ignore lint/suspicious/noExplicitAny: No typing yet
	inputComponent?: FC<any>,
	// biome-ignore lint/suspicious/noExplicitAny: No typing yet
	inputComponentProps?: any
): OperatorAndFilterConfig => {
	return {
		[IeObjectsSearchOperator.CONTAINS]: {
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
	operatorLabels: OperatorLabels,
	field: IeObjectsSearchFilterField,
	// biome-ignore lint/suspicious/noExplicitAny: No typing yet
	inputComponent?: FC<any>,
	// biome-ignore lint/suspicious/noExplicitAny: No typing yet
	inputComponentProps?: any
): OperatorAndFilterConfig => {
	return {
		[IeObjectsSearchOperator.CONTAINS_NOT]: {
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
	operatorLabels: OperatorLabels,
	field: IeObjectsSearchFilterField,
	// biome-ignore lint/suspicious/noExplicitAny: No typing yet
	inputComponent?: FC<any>,
	// biome-ignore lint/suspicious/noExplicitAny: No typing yet
	inputComponentProps?: any
): OperatorAndFilterConfig => {
	return {
		[IeObjectsSearchOperator.IS]: {
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
	operatorLabels: OperatorLabels,
	field: IeObjectsSearchFilterField,
	// biome-ignore lint/suspicious/noExplicitAny: No typing yet
	inputComponent?: FC<any>,
	// biome-ignore lint/suspicious/noExplicitAny: No typing yet
	inputComponentProps?: any
): OperatorAndFilterConfig => {
	return {
		[IeObjectsSearchOperator.IS_NOT]: {
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
	operatorLabels: OperatorLabels,
	field: IeObjectsSearchFilterField,
	// biome-ignore lint/suspicious/noExplicitAny: No typing yet
	inputComponent?: FC<any>,
	// biome-ignore lint/suspicious/noExplicitAny: No typing yet
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
	const operatorLabels = getOperatorLabels();

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

		[SearchFilterId.Rights]: {
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.RIGHTS, AdvancedRightsSelect),
			...EQUALS_NOT(operatorLabels, IeObjectsSearchFilterField.RIGHTS, AdvancedRightsSelect),
		},

		[SearchFilterId.Medium]: {
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.MEDIUM, MediumSelect),
			...EQUALS_NOT(operatorLabels, IeObjectsSearchFilterField.MEDIUM, MediumSelect),
		},

		[SearchFilterId.Theme]: {
			...EQUALS(operatorLabels, IeObjectsSearchFilterField.THEME, ThemeSelect),
			...EQUALS_NOT(operatorLabels, IeObjectsSearchFilterField.THEME, ThemeSelect),
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
			// meemoo_description_cast is an analysed text field with no .keyword subfield, so the
			// term query behind IS would match nothing. Contains only.
			...CONTAINS(operatorLabels, IeObjectsSearchFilterField.CAST),
			...CONTAINS_NOT(operatorLabels, IeObjectsSearchFilterField.CAST),
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
					fieldName: AutocompleteField.creator,
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
					fieldName: AutocompleteField.locationCreated,
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
					fieldName: AutocompleteField.newspaperSeriesName,
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
					fieldName: AutocompleteField.mentions,
					label: getFilterLabel(SearchFilterId.Mentions),
				}
			),
		},
	};
};

export const getMetadataSearchFilters = (
	prop: SearchFilterId,
	operator: IeObjectsSearchOperator
): IeObjectsSearchFilter[] => {
	return FILTERS_OPTIONS_CONFIG()[prop]?.[operator]?.filters || [];
};
