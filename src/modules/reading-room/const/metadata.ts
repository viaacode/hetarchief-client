import {
	DatepickerProps,
	ReactSelectProps,
	TextInput,
	TextInputProps,
} from '@meemoo/react-components';
import { FC } from 'react';

import {
	DateInput,
	DateRangeInput,
	DurationInput,
	DurationRangeInput,
	GenreSelect,
	MediaTypeSelect,
	MediumSelect,
} from '@reading-room/components';
import { MetadataProp } from '@reading-room/types';
import { i18n } from '@shared/helpers/i18n';
import {
	MediaSearchFilterField,
	MediaSearchFilters,
	MediaSearchOperator,
	Operator,
} from '@shared/types';

export type MetadataFields = FC<TextInputProps> | FC<ReactSelectProps> | FC<DatepickerProps>;

export type MetadataConfig = {
	[key in MetadataProp]?: {
		[key in Operator]?: {
			label: string;
			field: MetadataFields;
			filters?: MediaSearchFilters;
		};
	};
};

export const METADATA_CONFIG = (): MetadataConfig => {
	const dictionary = {
		from: i18n.t(
			'modules/reading-room/components/advanced-filter-fields/advanced-filter-fields___vanaf'
		),
		until: i18n.t(
			'modules/reading-room/components/advanced-filter-fields/advanced-filter-fields___tot-en-met'
		),
		between: i18n.t(
			'modules/reading-room/components/advanced-filter-fields/advanced-filter-fields___tussen'
		),
		contains: i18n.t(
			'modules/reading-room/components/advanced-filter-fields/advanced-filter-fields___bevat'
		),
		excludes: i18n.t(
			'modules/reading-room/components/advanced-filter-fields/advanced-filter-fields___bevat-niet'
		),
		equals: i18n.t(
			'modules/reading-room/components/advanced-filter-fields/advanced-filter-fields___is'
		),
		differs: i18n.t(
			'modules/reading-room/components/advanced-filter-fields/advanced-filter-fields___is-niet'
		),
		shorter: i18n.t(
			'modules/reading-room/components/advanced-filter-fields/advanced-filter-fields___korter-dan'
		),
		longer: i18n.t(
			'modules/reading-room/components/advanced-filter-fields/advanced-filter-fields___langer-dan'
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
				filters: [], // TODO: Add to proxy
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
				filters: [], // TODO: Add to proxy
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
				filters: [], // TODO: Add to proxy
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: TextInput,
				filters: [], // TODO: Add to proxy
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
		[MetadataProp.Era]: {
			[Operator.Contains]: {
				label: dictionary.contains,
				field: TextInput,
				filters: [], // TODO: Add to proxy
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
				filters: [], // TODO: Add to proxy
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
				filters: [], // TODO: Add to proxy
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: TextInput,
				filters: [], // TODO: Add to proxy
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
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
				filters: [
					{
						field: MediaSearchFilterField.ADVANCED_QUERY,
						operator: MediaSearchOperator.IS,
					},
				],
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: TextInput,
				filters: [
					{
						field: MediaSearchFilterField.ADVANCED_QUERY,
						operator: MediaSearchOperator.IS_NOT,
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
				field: MediumSelect, // TODO: populate by aggregate (missing in ES)
				filters: [], // TODO: Add to proxy
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: MediumSelect, // TODO: populate by aggregate (missing in ES)
				filters: [], // TODO: Add to proxy
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
				filters: [], // TODO: Add to proxy
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: TextInput,
				filters: [], // TODO: Add to proxy
			},
		},
		[MetadataProp.Location]: {
			[Operator.Contains]: {
				label: dictionary.contains,
				field: TextInput,
				filters: [], // TODO: Add to proxy
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
				filters: [], // TODO: Add to proxy
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
				filters: [], // TODO: Add to proxy
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: TextInput,
				filters: [], // TODO: Add to proxy
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
				filters: [], // TODO: Add to proxy
			},
			[Operator.ContainsNot]: {
				label: dictionary.excludes,
				field: TextInput,
				filters: [], // TODO: Add to proxy
			},
			[Operator.Equals]: {
				label: dictionary.equals,
				field: TextInput,
				filters: [], // TODO: Add to proxy
			},
			[Operator.EqualsNot]: {
				label: dictionary.differs,
				field: TextInput,
				filters: [], // TODO: Add to proxy
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
): MediaSearchFilters => {
	return METADATA_CONFIG()[prop]?.[operator]?.filters || [];
};
