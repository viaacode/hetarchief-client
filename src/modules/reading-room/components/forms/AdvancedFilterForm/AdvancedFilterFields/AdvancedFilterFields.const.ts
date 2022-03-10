import { SelectOption, TextInput } from '@meemoo/react-components';
import { i18n } from 'next-i18next';

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
				'modules/reading-room/components/forms/advanced-filter-form/advanced-filter-fields/advanced-filter-fields___beschrijving'
			) ?? '',
		value: MetadataProp.Description,
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
				'modules/reading-room/components/forms/advanced-filter-form/advanced-filter-fields/advanced-filter-fields___tijdsperiode-van-de-inhoud'
			) ?? '',
		value: MetadataProp.Era,
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
				'modules/reading-room/components/forms/advanced-filter-form/advanced-filter-fields/advanced-filter-fields___locatie-van-de-inhoud'
			) ?? '',
		value: MetadataProp.Location,
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
	[MetadataProp.Everything]: TextInput,
	[MetadataProp.Description]: TextInput,
	[MetadataProp.Title]: TextInput,
	[MetadataProp.Era]: TextInput,
	[MetadataProp.Publisher]: TextInput,
	[MetadataProp.Location]: TextInput,
};
