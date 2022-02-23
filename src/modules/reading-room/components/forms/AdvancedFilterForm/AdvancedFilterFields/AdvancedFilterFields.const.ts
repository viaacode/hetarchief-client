import { SelectOption, TextInput } from '@meemoo/react-components';
import { i18n } from 'next-i18next';

import { MetadataProp, Operator } from './AdvancedFilterFields.types';

// TODO: replace values with actual metadata property
export const METADATA_PROP_OPTIONS = (): SelectOption[] => [
	{
		label:
			i18n?.t(
				'modules/reading-room/components/forms/advanced-filter-form/advanced-filter-fields/advanced-filter-fields___hoofdtitel'
			) ?? '',
		value: MetadataProp.Title,
	},
	{
		label:
			i18n?.t(
				'modules/reading-room/components/forms/advanced-filter-form/advanced-filter-fields/advanced-filter-fields___secundaire-titel'
			) ?? '',
		value: MetadataProp.SecondaryTitle,
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
	[MetadataProp.Title]: TextInput,
	[MetadataProp.SecondaryTitle]: TextInput,
};
