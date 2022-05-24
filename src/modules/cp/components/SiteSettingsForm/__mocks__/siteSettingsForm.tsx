import { SelectOption } from '@meemoo/react-components';
import { kebabCase } from 'lodash-es';

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
		value: kebabCase('VRT'),
	},
	{
		label: 'Industriemuseum',
		value: kebabCase('Industriemuseum'),
	},
	{
		label: 'Vlaams Parmelent',
		value: kebabCase('Vlaams Parmelent'),
	},
	{
		label: 'Huis van Alijn',
		value: kebabCase('Huis van Alijn'),
	},
	{
		label: 'AMVB',
		value: kebabCase('AMVB'),
	},
	{
		label: 'Amsab-ISG',
		value: kebabCase('Amsab-ISG'),
	},
];
