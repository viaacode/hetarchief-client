import {
	DatepickerProps,
	ReactSelectProps,
	TextInput,
	TextInputProps,
} from '@meemoo/react-components';
import { FC } from 'react';

import { tText } from '@shared/helpers/translate';
import {
	IeObjectsSearchFilter,
	IeObjectsSearchFilterField,
	IeObjectsSearchOperator,
	Operator,
} from '@shared/types';

import {
	DateInput,
	DateRangeInput,
	DurationInput,
	DurationRangeInput,
	GenreSelect,
} from '../components';
import { MetadataProp } from '../types';

export type MetadataFields = FC<TextInputProps> | FC<ReactSelectProps> | FC<DatepickerProps>;
export type MetadataFieldProps = TextInputProps | ReactSelectProps | DatepickerProps;

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
	MetadataProp.Description,
	MetadataProp.Genre,
	MetadataProp.SpacialCoverage,
	MetadataProp.TemporalCoverage,
	MetadataProp.Publisher,
	MetadataProp.Title,
	MetadataProp.Cast,
	MetadataProp.ObjectType,
	MetadataProp.Identifier,
	MetadataProp.Keywords,
];

export const REGULAR_FILTERS: MetadataProp[] = [
	MetadataProp.Medium,
	MetadataProp.Duration,
	MetadataProp.CreatedAt,
	MetadataProp.PublishedAt,
	MetadataProp.Creator,
	MetadataProp.Language,

	// These are handled separately in VisitorSpaceFilterId
	// MetadataProp.Maintainers,
	// MetadataProp.ConsultableOnlyOnLocation,
	// MetadataProp.ConsultableMedia,
];

export const GET_OPERATOR_LABELS = () => ({
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

export const FILTERS_OPTIONS_CONFIG = (): MetadataConfig => {
	const operatorLabels = GET_OPERATOR_LABELS();

	return {
		[MetadataProp.CreatedAt]: {
			[Operator.GreaterThanOrEqual]: {
				label: operatorLabels.from,
				field: DateInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.CREATED,
						operator: IeObjectsSearchOperator.GTE,
					},
				],
			},
			[Operator.LessThanOrEqual]: {
				label: operatorLabels.until,
				field: DateInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.CREATED,
						operator: IeObjectsSearchOperator.LTE,
					},
				],
			},
			[Operator.Between]: {
				label: operatorLabels.between,
				field: DateRangeInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.CREATED,
						operator: IeObjectsSearchOperator.GTE,
					},
					{
						field: IeObjectsSearchFilterField.CREATED,
						operator: IeObjectsSearchOperator.LTE,
					},
				],
			},
			[Operator.Equals]: {
				label: operatorLabels.exact,
				field: DateInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.CREATED,
						operator: IeObjectsSearchOperator.GTE,
					},
					{
						field: IeObjectsSearchFilterField.CREATED,
						operator: IeObjectsSearchOperator.LTE,
					},
				],
			},
		},

		[MetadataProp.Duration]: {
			[Operator.LessThanOrEqual]: {
				label: operatorLabels.shorter,
				field: DurationInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.DURATION,
						operator: IeObjectsSearchOperator.LTE,
					},
				],
			},
			[Operator.GreaterThanOrEqual]: {
				label: operatorLabels.longer,
				field: DurationInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.DURATION,
						operator: IeObjectsSearchOperator.GTE,
					},
				],
			},
			[Operator.Between]: {
				label: operatorLabels.between,
				field: DurationRangeInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.DURATION,
						operator: IeObjectsSearchOperator.GTE,
					},
					{
						field: IeObjectsSearchFilterField.DURATION,
						operator: IeObjectsSearchOperator.LTE,
					},
				],
			},
			[Operator.Exact]: {
				label: operatorLabels.exact,
				field: DurationRangeInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.DURATION,
						operator: IeObjectsSearchOperator.GTE,
					},
					{
						field: IeObjectsSearchFilterField.DURATION,
						operator: IeObjectsSearchOperator.LTE,
					},
				],
			},
		},

		[MetadataProp.PublishedAt]: {
			[Operator.GreaterThanOrEqual]: {
				label: operatorLabels.from,
				field: DateInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.PUBLISHED,
						operator: IeObjectsSearchOperator.GTE,
					},
				],
			},
			[Operator.LessThanOrEqual]: {
				label: operatorLabels.until,
				field: DateInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.PUBLISHED,
						operator: IeObjectsSearchOperator.LTE,
					},
				],
			},
			[Operator.Between]: {
				label: operatorLabels.between,
				field: DateRangeInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.PUBLISHED,
						operator: IeObjectsSearchOperator.GTE,
					},
					{
						field: IeObjectsSearchFilterField.PUBLISHED,
						operator: IeObjectsSearchOperator.LTE,
					},
				],
			},
			[Operator.Equals]: {
				label: operatorLabels.exact,
				field: DateInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.PUBLISHED,
						operator: IeObjectsSearchOperator.GTE,
					},
					{
						field: IeObjectsSearchFilterField.PUBLISHED,
						operator: IeObjectsSearchOperator.LTE,
					},
				],
			},
		},
		[MetadataProp.Description]: {
			[Operator.Contains]: {
				label: operatorLabels.contains,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.DESCRIPTION,
						operator: IeObjectsSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: operatorLabels.excludes,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.DESCRIPTION,
						operator: IeObjectsSearchOperator.CONTAINS_NOT,
					},
				],
			},
		},

		[MetadataProp.Genre]: {
			[Operator.Equals]: {
				label: operatorLabels.equals,
				field: GenreSelect,
				filters: [
					{
						field: IeObjectsSearchFilterField.GENRE,
						operator: IeObjectsSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: operatorLabels.differs,
				field: GenreSelect,
				filters: [
					{
						field: IeObjectsSearchFilterField.GENRE,
						operator: IeObjectsSearchOperator.IS_NOT,
					},
				],
			},
		},

		[MetadataProp.SpacialCoverage]: {
			[Operator.Contains]: {
				label: operatorLabels.contains,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.SPACIAL_COVERAGE,
						operator: IeObjectsSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: operatorLabels.excludes,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.SPACIAL_COVERAGE,
						operator: IeObjectsSearchOperator.CONTAINS_NOT,
					},
				],
			},
			[Operator.Equals]: {
				label: operatorLabels.equals,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.SPACIAL_COVERAGE,
						operator: IeObjectsSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: operatorLabels.differs,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.SPACIAL_COVERAGE,
						operator: IeObjectsSearchOperator.IS_NOT,
					},
				],
			},
		},

		[MetadataProp.TemporalCoverage]: {
			[Operator.Contains]: {
				label: operatorLabels.contains,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.TEMPORAL_COVERAGE,
						operator: IeObjectsSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: operatorLabels.excludes,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.TEMPORAL_COVERAGE,
						operator: IeObjectsSearchOperator.CONTAINS_NOT,
					},
				],
			},
			[Operator.Equals]: {
				label: operatorLabels.equals,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.TEMPORAL_COVERAGE,
						operator: IeObjectsSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: operatorLabels.differs,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.TEMPORAL_COVERAGE,
						operator: IeObjectsSearchOperator.IS_NOT,
					},
				],
			},
		},

		[MetadataProp.ObjectType]: {
			[Operator.Contains]: {
				label: operatorLabels.contains,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.OBJECT_TYPE,
						operator: IeObjectsSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: operatorLabels.excludes,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.OBJECT_TYPE,
						operator: IeObjectsSearchOperator.CONTAINS_NOT,
					},
				],
			},
			[Operator.Equals]: {
				label: operatorLabels.equals,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.OBJECT_TYPE,
						operator: IeObjectsSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: operatorLabels.differs,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.OBJECT_TYPE,
						operator: IeObjectsSearchOperator.IS_NOT,
					},
				],
			},
		},

		[MetadataProp.Publisher]: {
			[Operator.Contains]: {
				label: operatorLabels.contains,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.PUBLISHER,
						operator: IeObjectsSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: operatorLabels.excludes,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.PUBLISHER,
						operator: IeObjectsSearchOperator.CONTAINS_NOT,
					},
				],
			},
			[Operator.Equals]: {
				label: operatorLabels.equals,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.PUBLISHER,
						operator: IeObjectsSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: operatorLabels.differs,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.PUBLISHER,
						operator: IeObjectsSearchOperator.IS_NOT,
					},
				],
			},
		},

		[MetadataProp.Title]: {
			[Operator.Contains]: {
				label: operatorLabels.contains,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.NAME,
						operator: IeObjectsSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: operatorLabels.excludes,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.NAME,
						operator: IeObjectsSearchOperator.CONTAINS_NOT,
					},
				],
			},
			[Operator.Equals]: {
				label: operatorLabels.equals,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.NAME,
						operator: IeObjectsSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: operatorLabels.differs,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.NAME,
						operator: IeObjectsSearchOperator.IS_NOT,
					},
				],
			},
		},

		[MetadataProp.Cast]: {
			[Operator.Contains]: {
				label: operatorLabels.contains,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.CAST,
						operator: IeObjectsSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: operatorLabels.excludes,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.CAST,
						operator: IeObjectsSearchOperator.CONTAINS_NOT,
					},
				],
			},
			[Operator.Equals]: {
				label: operatorLabels.equals,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.CAST,
						operator: IeObjectsSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: operatorLabels.differs,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.CAST,
						operator: IeObjectsSearchOperator.IS_NOT,
					},
				],
			},
		},

		[MetadataProp.Identifier]: {
			[Operator.Equals]: {
				label: operatorLabels.equals,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.IDENTIFIER,
						operator: IeObjectsSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: operatorLabels.differs,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.IDENTIFIER,
						operator: IeObjectsSearchOperator.IS_NOT,
					},
				],
			},
		},

		[MetadataProp.Keywords]: {
			[Operator.Contains]: {
				label: operatorLabels.contains,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.KEYWORD,
						operator: IeObjectsSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: operatorLabels.excludes,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.KEYWORD,
						operator: IeObjectsSearchOperator.CONTAINS_NOT,
					},
				],
			},
			[Operator.Equals]: {
				label: operatorLabels.equals,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.KEYWORD,
						operator: IeObjectsSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: operatorLabels.differs,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.KEYWORD,
						operator: IeObjectsSearchOperator.IS_NOT,
					},
				],
			},
		},
	};
};

export const getMetadataSearchFilters = (
	prop: MetadataProp,
	operator: Operator
): IeObjectsSearchFilter[] => {
	return FILTERS_OPTIONS_CONFIG()[prop]?.[operator]?.filters || [];
};
