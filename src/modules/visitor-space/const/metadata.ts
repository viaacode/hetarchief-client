import {
	DatepickerProps,
	ReactSelectProps,
	TextInput,
	TextInputProps,
} from '@meemoo/react-components';
import { FC } from 'react';

import { tText } from '@shared/helpers/translate';
import {
	MediaSearchFilter,
	MediaSearchFilterField,
	MediaSearchOperator,
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
} from '../components';
import { MetadataProp } from '../types';

export type MetadataFields = FC<TextInputProps> | FC<ReactSelectProps> | FC<DatepickerProps>;
export type MetadataFieldProps = TextInputProps | ReactSelectProps | DatepickerProps;

export type MetadataConfig = {
	[key in MetadataProp]?: {
		[key in Operator]?: {
			label: string;
			field: MetadataFields;
			filters?: MediaSearchFilter[];
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
	};

	return {
		[MetadataProp.CreatedAt]: {
			[Operator.GreaterThanOrEqual]: {
				label: dictionary.from,
				field: DateInput,
				filters: [
					{ field: MediaSearchFilterField.CREATED, operator: MediaSearchOperator.GTE },
				],
			},
			[Operator.LessThanOrEqual]: {
				label: dictionary.until,
				field: DateInput,
				filters: [
					{ field: MediaSearchFilterField.CREATED, operator: MediaSearchOperator.LTE },
				],
			},
			[Operator.Between]: {
				label: dictionary.between,
				field: DateRangeInput,
				filters: [
					{ field: MediaSearchFilterField.CREATED, operator: MediaSearchOperator.GTE },
					{ field: MediaSearchFilterField.CREATED, operator: MediaSearchOperator.LTE },
				],
			},
		},
		[MetadataProp.Creator]: {
			[Operator.Contains]: {
				label: dictionary.contains,
				field: TextInput,
				filters: [
					{
						field: MediaSearchFilterField.CREATOR,
						operator: MediaSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
				filters: [
					{
						field: MediaSearchFilterField.CREATOR,
						operator: MediaSearchOperator.CONTAINS_NOT,
					},
				],
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
				filters: [
					{
						field: MediaSearchFilterField.CREATOR,
						operator: MediaSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: TextInput,
				filters: [
					{ field: MediaSearchFilterField.CREATOR, operator: MediaSearchOperator.IS_NOT },
				],
			},
		},
		[MetadataProp.Description]: {
			[Operator.Contains]: {
				label: dictionary.contains,
				field: TextInput,
				filters: [
					{
						field: MediaSearchFilterField.DESCRIPTION,
						operator: MediaSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
				filters: [
					{
						field: MediaSearchFilterField.DESCRIPTION,
						operator: MediaSearchOperator.CONTAINS_NOT,
					},
				],
			},
		},
		[MetadataProp.Duration]: {
			[Operator.LessThanOrEqual]: {
				label: dictionary.shorter,
				field: DurationInput,
				filters: [
					{ field: MediaSearchFilterField.DURATION, operator: MediaSearchOperator.LTE },
				],
			},
			[Operator.GreaterThanOrEqual]: {
				label: dictionary.longer,
				field: DurationInput,
				filters: [
					{ field: MediaSearchFilterField.DURATION, operator: MediaSearchOperator.GTE },
				],
			},
			[Operator.Between]: {
				label: dictionary.between,
				field: DurationRangeInput,
				filters: [
					{ field: MediaSearchFilterField.DURATION, operator: MediaSearchOperator.GTE },
					{ field: MediaSearchFilterField.DURATION, operator: MediaSearchOperator.LTE },
				],
			},
		},
		// "Temporal" missing in ES, src/modules/media/types.ts:84
		[MetadataProp.Era]: {
			[Operator.Contains]: {
				label: dictionary.contains,
				field: TextInput,
				filters: [
					{
						field: MediaSearchFilterField.ERA,
						operator: MediaSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
				filters: [
					{
						field: MediaSearchFilterField.ERA,
						operator: MediaSearchOperator.CONTAINS_NOT,
					},
				],
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
				filters: [
					{
						field: MediaSearchFilterField.ERA,
						operator: MediaSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: TextInput,
				filters: [
					{
						field: MediaSearchFilterField.ERA,
						operator: MediaSearchOperator.IS_NOT,
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
						field: MediaSearchFilterField.ADVANCED_QUERY,
						operator: MediaSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
				filters: [
					{
						field: MediaSearchFilterField.ADVANCED_QUERY,
						operator: MediaSearchOperator.CONTAINS_NOT,
					},
				],
			},
		},
		[MetadataProp.Mediatype]: {
			[Operator.Equals]: {
				label: dictionary.equals,
				field: MediaTypeSelect,
				filters: [
					{
						field: MediaSearchFilterField.FORMAT,
						operator: MediaSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: MediaTypeSelect,
				filters: [
					{
						field: MediaSearchFilterField.FORMAT,
						operator: MediaSearchOperator.IS_NOT,
					},
				],
			},
		},
		[MetadataProp.Medium]: {
			[Operator.Equals]: {
				label: dictionary.equals,
				field: MediumSelect,
				filters: [
					{
						field: MediaSearchFilterField.MEDIUM,
						operator: MediaSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: MediumSelect,
				filters: [
					{
						field: MediaSearchFilterField.MEDIUM,
						operator: MediaSearchOperator.IS_NOT,
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
						field: MediaSearchFilterField.GENRE,
						operator: MediaSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: GenreSelect,
				filters: [
					{
						field: MediaSearchFilterField.GENRE,
						operator: MediaSearchOperator.IS_NOT,
					},
				],
			},
		},
		[MetadataProp.Language]: {
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
				filters: [
					{
						field: MediaSearchFilterField.LANGUAGE,
						operator: MediaSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: TextInput,
				filters: [
					{
						field: MediaSearchFilterField.LANGUAGE,
						operator: MediaSearchOperator.IS_NOT,
					},
				],
			},
		},
		// "Spatial" missing in ES, src/modules/media/types.ts:83
		[MetadataProp.Location]: {
			[Operator.Contains]: {
				label: dictionary.contains,
				field: TextInput,
				filters: [
					{
						field: MediaSearchFilterField.LOCATION,
						operator: MediaSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
				filters: [
					{
						field: MediaSearchFilterField.LOCATION,
						operator: MediaSearchOperator.CONTAINS_NOT,
					},
				],
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
				filters: [
					{
						field: MediaSearchFilterField.LOCATION,
						operator: MediaSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: TextInput,
				filters: [
					{
						field: MediaSearchFilterField.LOCATION,
						operator: MediaSearchOperator.IS_NOT,
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
						field: MediaSearchFilterField.PUBLISHED,
						operator: MediaSearchOperator.GTE,
					},
				],
			},
			[Operator.LessThanOrEqual]: {
				label: dictionary.until,
				field: DateInput,
				filters: [
					{
						field: MediaSearchFilterField.PUBLISHED,
						operator: MediaSearchOperator.LTE,
					},
				],
			},
			[Operator.Between]: {
				label: dictionary.between,
				field: DateRangeInput,
				filters: [
					{
						field: MediaSearchFilterField.PUBLISHED,
						operator: MediaSearchOperator.GTE,
					},
					{
						field: MediaSearchFilterField.PUBLISHED,
						operator: MediaSearchOperator.LTE,
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
						field: MediaSearchFilterField.PUBLISHER,
						operator: MediaSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
				filters: [
					{
						field: MediaSearchFilterField.PUBLISHER,
						operator: MediaSearchOperator.CONTAINS_NOT,
					},
				],
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
				filters: [
					{
						field: MediaSearchFilterField.PUBLISHER,
						operator: MediaSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: TextInput,
				filters: [
					{
						field: MediaSearchFilterField.PUBLISHER,
						operator: MediaSearchOperator.IS_NOT,
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
						field: MediaSearchFilterField.NAME,
						operator: MediaSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
				filters: [
					{
						field: MediaSearchFilterField.NAME,
						operator: MediaSearchOperator.CONTAINS_NOT,
					},
				],
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
				filters: [
					{
						field: MediaSearchFilterField.NAME,
						operator: MediaSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: TextInput,
				filters: [
					{
						field: MediaSearchFilterField.NAME,
						operator: MediaSearchOperator.IS_NOT,
					},
				],
			},
		},
	};
};

export const getMetadataSearchFilters = (
	prop: MetadataProp,
	operator: Operator
): MediaSearchFilter[] => {
	return METADATA_CONFIG()[prop]?.[operator]?.filters || [];
};
