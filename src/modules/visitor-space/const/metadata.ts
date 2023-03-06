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
		[MetadataProp.Creator]: {
			[Operator.Contains]: {
				label: dictionary.contains,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.CREATOR,
						operator: IeObjectsSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.CREATOR,
						operator: IeObjectsSearchOperator.CONTAINS_NOT,
					},
				],
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.CREATOR,
						operator: IeObjectsSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.CREATOR,
						operator: IeObjectsSearchOperator.IS_NOT,
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
		// "Temporal" missing in ES, src/modules/ie-objects/types.ts:84
		[MetadataProp.Era]: {
			[Operator.Contains]: {
				label: dictionary.contains,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.ERA,
						operator: IeObjectsSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.ERA,
						operator: IeObjectsSearchOperator.CONTAINS_NOT,
					},
				],
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.ERA,
						operator: IeObjectsSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.ERA,
						operator: IeObjectsSearchOperator.IS_NOT,
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
		[MetadataProp.Mediatype]: {
			[Operator.Equals]: {
				label: dictionary.equals,
				field: MediaTypeSelect,
				filters: [
					{
						field: IeObjectsSearchFilterField.FORMAT,
						operator: IeObjectsSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: MediaTypeSelect,
				filters: [
					{
						field: IeObjectsSearchFilterField.FORMAT,
						operator: IeObjectsSearchOperator.IS_NOT,
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
						field: IeObjectsSearchFilterField.MEDIUM,
						operator: IeObjectsSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: MediumSelect,
				filters: [
					{
						field: IeObjectsSearchFilterField.MEDIUM,
						operator: IeObjectsSearchOperator.IS_NOT,
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
		[MetadataProp.Language]: {
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.LANGUAGE,
						operator: IeObjectsSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.LANGUAGE,
						operator: IeObjectsSearchOperator.IS_NOT,
					},
				],
			},
		},
		// "Spatial" missing in ES, src/modules/ie-objects/types.ts:83
		[MetadataProp.Location]: {
			[Operator.Contains]: {
				label: dictionary.contains,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.LOCATION,
						operator: IeObjectsSearchOperator.CONTAINS,
					},
				],
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.LOCATION,
						operator: IeObjectsSearchOperator.CONTAINS_NOT,
					},
				],
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.LOCATION,
						operator: IeObjectsSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: TextInput,
				filters: [
					{
						field: IeObjectsSearchFilterField.LOCATION,
						operator: IeObjectsSearchOperator.IS_NOT,
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
	};
};

export const getMetadataSearchFilters = (
	prop: MetadataProp,
	operator: Operator
): IeObjectsSearchFilter[] => {
	return METADATA_CONFIG()[prop]?.[operator]?.filters || [];
};
