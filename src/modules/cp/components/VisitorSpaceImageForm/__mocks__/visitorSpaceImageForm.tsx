import { VisitorSpaceImageFormProps } from '../VisitorSpaceImageForm.types';

export const VISITOR_SPACE_IMAGE_FORM_MOCK: VisitorSpaceImageFormProps = {
	room: {
		id: '52caf5a2-a6d1-4e54-90cc-1b6e5fb66a21',
		name: 'Amsab-ISG',
		image: '/image',
		color: '#007b60',
		logo: 'https://assets.viaa.be/images/OR-154dn75',
	},
	renderCancelSaveButtons: (onCancel, onSave) => (
		<>
			<button onClick={onCancel}>Cancel</button>
			<button onClick={onSave}>Save</button>
		</>
	),
	onSubmit: () => null,
};
