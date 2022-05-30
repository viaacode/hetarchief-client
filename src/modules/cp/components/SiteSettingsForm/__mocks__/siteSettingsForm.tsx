import { SiteSettingsFormProps } from '../SiteSettingsForm.types';

export const SITE_SETTINGS_FORM_MOCK: SiteSettingsFormProps = {
	space: {
		id: 'OR-rsdfsdf',
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
