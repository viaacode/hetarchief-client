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
	MediaTypeSelect,
	MediumSelect,
	ObjectTypeSelect,
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

export const METADATA_CONFIG = (): MetadataConfig => {
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

		[MetadataProp.Everything]: {
			[Operator.Contains]: {
				label: dictionary.contains,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.ADVANCED_QUERY,
						operator: IeObjectsSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.ADVANCED_QUERY,
						operator: IeObjectsSearchOperator.CONTAINS_NOT,
					},
				],
			},
		},

		[MetadataProp.Genre]: {
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
	return METADATA_CONFIG()[prop]?.[operator]?.filters || [];
};
