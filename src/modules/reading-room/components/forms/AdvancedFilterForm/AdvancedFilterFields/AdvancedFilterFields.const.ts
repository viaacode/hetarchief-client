import { Select, SelectOption, TextInput } from '@meemoo/react-components';
import { i18n } from 'next-i18next';

import { Timepicker } from '@shared/components/Timepicker';

import { MetadataProp, Operator } from './AdvancedFilterFields.types';

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

export const OPERATOR_OPTIONS = (): SelectOption[] => [
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

export const METADATA_FIELD_MAP = {
	[MetadataProp.CreatedAt]: TextInput, // TODO: Create DateRangePicker
	[MetadataProp.Creator]: TextInput,
	[MetadataProp.Description]: TextInput,
	[MetadataProp.Duration]: TextInput, // TODO: Create DurationInput (TextInput with format)
	[MetadataProp.Era]: TextInput,
	[MetadataProp.Everything]: TextInput,
	[MetadataProp.Mediatype]: Select, // TODO: add options (MediaTypes)
	[MetadataProp.Genre]: Select, // TODO: add options; aggregate of results? static?
	[MetadataProp.Language]: TextInput,
	[MetadataProp.Location]: TextInput,
	[MetadataProp.Medium]: Select, // TODO: add options; aggregate of results? static?
	[MetadataProp.PublishedAt]: TextInput, // TODO: Create DateRangePicker
	[MetadataProp.Publisher]: TextInput,
	[MetadataProp.Title]: TextInput,
};
