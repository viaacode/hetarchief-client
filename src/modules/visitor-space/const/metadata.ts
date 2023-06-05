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

export const FILTERS_OPTIONS_CONFIG = (): MetadataConfig => {
	const dictionary = {
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
	};

	return {
		[MetadataProp.CreatedAt]: {
			[Operator.GreaterThanOrEqual]: {
				label: dictionary.from,
				field: DateInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.CREATED,
						operator: IeObjectsSearchOperator.GTE,
					},
				],
			},
			[Operator.LessThanOrEqual]: {
				label: dictionary.until,
				field: DateInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.CREATED,
						operator: IeObjectsSearchOperator.LTE,
					},
				],
			},
			[Operator.Between]: {
				label: dictionary.between,
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
				label: dictionary.exact,
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
				label: dictionary.shorter,
				field: DurationInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.DURATION,
						operator: IeObjectsSearchOperator.LTE,
					},
				],
			},
			[Operator.GreaterThanOrEqual]: {
				label: dictionary.longer,
				field: DurationInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.DURATION,
						operator: IeObjectsSearchOperator.GTE,
					},
				],
			},
			[Operator.Between]: {
				label: dictionary.between,
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
				label: dictionary.exact,
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
				label: dictionary.from,
				field: DateInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.PUBLISHED,
						operator: IeObjectsSearchOperator.GTE,
					},
				],
			},
			[Operator.LessThanOrEqual]: {
				label: dictionary.until,
				field: DateInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.PUBLISHED,
						operator: IeObjectsSearchOperator.LTE,
					},
				],
			},
			[Operator.Between]: {
				label: dictionary.between,
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
				label: dictionary.exact,
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
				label: dictionary.contains,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.DESCRIPTION,
						operator: IeObjectsSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
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
			[Operator.Contains]: {
				label: dictionary.contains,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.GENRE,
						operator: IeObjectsSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.GENRE,
						operator: IeObjectsSearchOperator.CONTAINS_NOT,
					},
				],
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: GenreSelect,
				filters: [
					{
						field: IeObjectsSearchFilterField.GENRE,
						operator: IeObjectsSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
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
				label: dictionary.contains,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.SPACIAL_COVERAGE,
						operator: IeObjectsSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.SPACIAL_COVERAGE,
						operator: IeObjectsSearchOperator.CONTAINS_NOT,
					},
				],
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.SPACIAL_COVERAGE,
						operator: IeObjectsSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
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
				label: dictionary.contains,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.TEMPORAL_COVERAGE,
						operator: IeObjectsSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.TEMPORAL_COVERAGE,
						operator: IeObjectsSearchOperator.CONTAINS_NOT,
					},
				],
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.TEMPORAL_COVERAGE,
						operator: IeObjectsSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
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
				label: dictionary.contains,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.OBJECT_TYPE,
						operator: IeObjectsSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.OBJECT_TYPE,
						operator: IeObjectsSearchOperator.CONTAINS_NOT,
					},
				],
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.OBJECT_TYPE,
						operator: IeObjectsSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
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
				label: dictionary.contains,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.PUBLISHER,
						operator: IeObjectsSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.PUBLISHER,
						operator: IeObjectsSearchOperator.CONTAINS_NOT,
					},
				],
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.PUBLISHER,
						operator: IeObjectsSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
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
				label: dictionary.contains,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.NAME,
						operator: IeObjectsSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.NAME,
						operator: IeObjectsSearchOperator.CONTAINS_NOT,
					},
				],
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.NAME,
						operator: IeObjectsSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
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
				label: dictionary.contains,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.CAST,
						operator: IeObjectsSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.CAST,
						operator: IeObjectsSearchOperator.CONTAINS_NOT,
					},
				],
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.CAST,
						operator: IeObjectsSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
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
				label: dictionary.equals,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.IDENTIFIER,
						operator: IeObjectsSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
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
				label: dictionary.contains,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.KEYWORD,
						operator: IeObjectsSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.KEYWORD,
						operator: IeObjectsSearchOperator.CONTAINS_NOT,
					},
				],
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.KEYWORD,
						operator: IeObjectsSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
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
