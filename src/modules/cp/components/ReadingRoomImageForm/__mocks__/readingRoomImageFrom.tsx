import { ReadingRoomImageFormProps } from '../ReadingRoomImageForm.types';

export const READING_ROOM_IMAGE_FORM_MOCK: ReadingRoomImageFormProps = {
	room: {
		id: '52caf5a2-a6d1-4e54-90cc-1b6e5fb66a21',
		maintainerId: 'OR-154dn75',
		name: 'Amsab-ISG',
		description:
			'Amsab-ISG is het Instituut voor Sociale Geschiedenis. Het bewaart, ontsluit, onderzoekt en valoriseert het erfgoed van sociale en humanitaire bewegingen.',
		serviceDescription: 'Vraag meer info aan de balie.',
		image: '/image',
		color: '#007b60',
		logo: 'https://assets.viaa.be/images/OR-154dn75',
		audienceType: 'PUBLIC',
		publicAccess: false,
		contactInfo: {
			email: null,
			telephone: null,
			address: {
				street: 'Pijndersstraat 28',
				postalCode: '9000',
				locality: 'Gent',
			},
		},
		isPublished: false,
		publishedAt: null,
		createdAt: '2022-01-13T13:10:14.41978',
		updatedAt: '2022-01-13T13:10:14.41978',
	},
	renderCancelSaveButtons: (onCancel, onSave) => (
		<>
			<button onClick={onCancel}>Cancel</button>
			<button onClick={onSave}>Save</button>
		</>
	),
	onSubmit: () => null,
};
