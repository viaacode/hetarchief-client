import { SelectOption, TextInput } from '@meemoo/react-components';
import { i18n } from 'next-i18next';

import { MetadataProp } from './AdvancedFilterFields.types';

import { Operator } from '.';

// TODO: replace values with actual metadata property
export const METADATA_PROP_OPTIONS = (): SelectOption[] => [
	{
		label: i18n?.t('Hoofdtitel') ?? '',
		value: MetadataProp.Title,
	},
	{
		label: i18n?.t('Secundaire titel') ?? '',
		value: MetadataProp.SecundaryTitle,
	},
];

export const OPERATOR_OPTIONS = (): SelectOption[] => [
	{
		label: i18n?.t('Bevat') ?? '',
		value: Operator.Contains,
	},
	{
		label: i18n?.t('Bevat niet') ?? '',
		value: Operator.ContainsNot,
	},
	{
		label: i18n?.t('Is') ?? '',
		value: Operator.Equals,
	},
	{
		label: i18n?.t('Is niet') ?? '',
		value: Operator.EqualsNot,
	},
];

export const METADATA_FIELD_MAP = {
	[MetadataProp.Title]: TextInput,
	[MetadataProp.SecundaryTitle]: TextInput,
};
