import { ReactSelect, SelectOption, TextInput } from '@meemoo/react-components';
import { i18n } from 'next-i18next';

import { DurationInput } from '@reading-room/components/DurationInput';
import { OperatorOptions } from '@reading-room/types';
import { Operator } from '@shared/types';

import { MediaTypeSelect } from '../MediaTypeSelect';

import { MetadataProp } from './AdvancedFilterFields.types';

// TODO: replace values with actual metadata property
export const METADATA_PROP_OPTIONS = (): SelectOption[] => [
	{
		label:
			i18n?.t(
				'modules/reading-room/components/forms/advanced-filter-form/advanced-filter-fields/advanced-filter-fields___alles'
			) ?? '',
		value: MetadataProp.Everything,
	},
	{
		label:
			i18n?.t(
				'modules/reading-room/components/forms/advanced-filter-form/advanced-filter-fields/advanced-filter-fields___titel'
			) ?? '',
		value: MetadataProp.Title,
	},
	{
		label:
			i18n?.t(
				'modules/reading-room/components/forms/advanced-filter-form/advanced-filter-fields/advanced-filter-fields___bestandstype'
			) ?? '',
		value: MetadataProp.Mediatype,
	},
	{
		label:
			i18n?.t(
				'modules/reading-room/components/forms/advanced-filter-form/advanced-filter-fields/advanced-filter-fields___analoge-drager'
			) ?? '',
		value: MetadataProp.Medium,
	},
	{
		label:
			i18n?.t(
				'modules/reading-room/components/forms/advanced-filter-form/advanced-filter-fields/advanced-filter-fields___duurtijd'
			) ?? '',
		value: MetadataProp.Duration,
	},
	{
		label:
			i18n?.t(
				'modules/reading-room/components/forms/advanced-filter-form/advanced-filter-fields/advanced-filter-fields___creatiedatum'
			) ?? '',
		value: MetadataProp.CreatedAt,
	},
	{
		label:
			i18n?.t(
				'modules/reading-room/components/forms/advanced-filter-form/advanced-filter-fields/advanced-filter-fields___uitzenddatum'
			) ?? '',
		value: MetadataProp.PublishedAt,
	},
	{
		label:
			i18n?.t(
				'modules/reading-room/components/forms/advanced-filter-form/advanced-filter-fields/advanced-filter-fields___maker'
			) ?? '',
		value: MetadataProp.Creator,
	},
	{
		label:
			i18n?.t(
				'modules/reading-room/components/forms/advanced-filter-form/advanced-filter-fields/advanced-filter-fields___publisher'
			) ?? '',
		value: MetadataProp.Publisher,
	},
	{
		label:
			i18n?.t(
				'modules/reading-room/components/forms/advanced-filter-form/advanced-filter-fields/advanced-filter-fields___beschrijving'
			) ?? '',
		value: MetadataProp.Description,
	},
	{
		label:
			i18n?.t(
				'modules/reading-room/components/forms/advanced-filter-form/advanced-filter-fields/advanced-filter-fields___bestandstype'
			) ?? '',
		value: MetadataProp.Genre,
	},
	{
		label:
			i18n?.t(
				'modules/reading-room/components/forms/advanced-filter-form/advanced-filter-fields/advanced-filter-fields___tijdsperiode-van-de-inhoud'
			) ?? '',
		value: MetadataProp.Era,
	},
	{
		label:
			i18n?.t(
				'modules/reading-room/components/forms/advanced-filter-form/advanced-filter-fields/advanced-filter-fields___locatie-van-de-inhoud'
			) ?? '',
		value: MetadataProp.Location,
	},
	{
		label:
			i18n?.t(
				'modules/reading-room/components/forms/advanced-filter-form/advanced-filter-fields/advanced-filter-fields___taal'
			) ?? '',
		value: MetadataProp.Language,
	},
];

export const METADATA_FIELD_MAP = {
	[MetadataProp.CreatedAt]: TextInput, // TODO: Create DateRangePicker
	[MetadataProp.Creator]: TextInput,
	[MetadataProp.Description]: TextInput,
	[MetadataProp.Duration]: DurationInput,
	[MetadataProp.Era]: TextInput,
	[MetadataProp.Everything]: TextInput,
	[MetadataProp.Mediatype]: MediaTypeSelect, // TODO: add options (MediaTypes)
	[MetadataProp.Genre]: ReactSelect, // TODO: add options; aggregate of results? static?
	[MetadataProp.Language]: TextInput,
	[MetadataProp.Location]: TextInput,
	[MetadataProp.Medium]: ReactSelect, // TODO: add options; aggregate of results? static?
	[MetadataProp.PublishedAt]: TextInput, // TODO: Create DateRangePicker
	[MetadataProp.Publisher]: TextInput,
	[MetadataProp.Title]: TextInput,
};

// Operators
// Note that the order in these arrays determines rendering

// Text

export const METADATA_OPERATOR_DOES_OR_DOES_NOT_CONTAIN = (): OperatorOptions => [
	{
		label:
			i18n?.t(
				'modules/reading-room/components/forms/advanced-filter-form/advanced-filter-fields/advanced-filter-fields___bevat'
			) ?? '',
		value: Operator.Contains,
	},
	{
		label:
			i18n?.t(
				'modules/reading-room/components/forms/advanced-filter-form/advanced-filter-fields/advanced-filter-fields___bevat-niet'
			) ?? '',
		value: Operator.ContainsNot,
	},
];

export const METADATA_OPERATOR_IS_OR_IS_NOT = (): OperatorOptions => [
	{
		label:
			i18n?.t(
				'modules/reading-room/components/forms/advanced-filter-form/advanced-filter-fields/advanced-filter-fields___is'
			) ?? '',
		value: Operator.Equals,
	},
	{
		label:
			i18n?.t(
				'modules/reading-room/components/forms/advanced-filter-form/advanced-filter-fields/advanced-filter-fields___is-niet'
			) ?? '',
		value: Operator.EqualsNot,
	},
];

export const METADATA_OPERATOR_DOES_AND_IS = (): OperatorOptions => [
	...METADATA_OPERATOR_DOES_OR_DOES_NOT_CONTAIN(),
	...METADATA_OPERATOR_IS_OR_IS_NOT(),
];

// Mathematical

export const METADATA_OPERATOR_BETWEEN = (): OperatorOptions => [
	{
		label: i18n?.t('Tussen') ?? '',
		value: Operator.Between,
	},
];

// Following two mappings are functionally identical but have different labels

export const METADATA_OPERATOR_DATES = (): OperatorOptions => [
	{
		label: i18n?.t('Vanaf') ?? '',
		value: Operator.GreaterThan,
	},
	{
		label: i18n?.t('Tot en met') ?? '',
		value: Operator.LessThanOrEqual,
	},
	...METADATA_OPERATOR_BETWEEN(),
];

export const METADATA_OPERATOR_DURATION = (): OperatorOptions => [
	{
		label: i18n?.t('Korter dan') ?? '',
		value: Operator.LessThanOrEqual,
	},
	{
		label: i18n?.t('Langer dan') ?? '',
		value: Operator.GreaterThan,
	},
	...METADATA_OPERATOR_BETWEEN(),
];

// Map

export const METADATA_OPERATOR_MAP = {
	[MetadataProp.CreatedAt]: METADATA_OPERATOR_DATES,
	[MetadataProp.Creator]: METADATA_OPERATOR_DOES_AND_IS,
	[MetadataProp.Description]: METADATA_OPERATOR_DOES_AND_IS,
	[MetadataProp.Duration]: METADATA_OPERATOR_DURATION,
	[MetadataProp.Era]: METADATA_OPERATOR_DOES_AND_IS,
	[MetadataProp.Everything]: METADATA_OPERATOR_DOES_AND_IS,
	[MetadataProp.Mediatype]: METADATA_OPERATOR_IS_OR_IS_NOT,
	[MetadataProp.Genre]: METADATA_OPERATOR_IS_OR_IS_NOT,
	[MetadataProp.Language]: METADATA_OPERATOR_IS_OR_IS_NOT,
	[MetadataProp.Location]: METADATA_OPERATOR_DOES_AND_IS,
	[MetadataProp.Medium]: METADATA_OPERATOR_IS_OR_IS_NOT,
	[MetadataProp.PublishedAt]: METADATA_OPERATOR_DATES,
	[MetadataProp.Publisher]: METADATA_OPERATOR_DOES_AND_IS,
	[MetadataProp.Title]: METADATA_OPERATOR_DOES_AND_IS,
};
