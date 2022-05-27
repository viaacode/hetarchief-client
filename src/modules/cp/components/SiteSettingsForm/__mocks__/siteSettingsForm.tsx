import { SelectOption } from '@meemoo/react-components';

import { SiteSettingsFormProps } from '../SiteSettingsForm.types';

export const SITE_SETTINGS_FORM_MOCK: SiteSettingsFormProps = {
	room: {
		id: '52caf5a2-a6d1-4e54-90cc-1b6e5fb66a21',
		name: 'Amsab-ISG',
		image: '/image',
		color: '#007b60',
		logo: 'https://assets.viaa.be/images/OR-154dn75',
		slug: 'amsab-isg',
	},
	renderCancelSaveButtons: (onCancel, onSave) => (
		<>
			<button onClick={onCancel}>Cancel</button>
			<button onClick={onSave}>Save</button>
		</>
	),
	onSubmit: () => null,
};

export const OPTIONS_MOCK: SelectOption[] = [
	{
		label: 'VRT',
		value: 'OR-rf5kdfg',
	},
	{
		label: 'Industriemuseum',
		value: 'OR-rf5ksdf',
	},
	{
		label: 'Vlaams Parmelent',
		value: 'OR-rfghjdf',
	},
	{
		label: 'Huis van Alijn',
		value: 'OR-rffghdf',
	},
	{
		label: 'AMVB',
		value: 'OR-rfdfgdf',
	},
	{
		label: 'Amsab-ISG',
		value: 'OR-rsdfsdf',
	},
];
