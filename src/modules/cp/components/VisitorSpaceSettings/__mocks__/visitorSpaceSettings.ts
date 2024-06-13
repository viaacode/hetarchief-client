import { VisitorSpaceInfo, VisitorSpaceStatus } from '@visitor-space/types';

export const VISITOR_SPACE_MOCK: VisitorSpaceInfo = {
	id: '52caf5a2-a6d1-4e54-90cc-1b6e5fb66a21',
	slug: 'amsab',
	maintainerId: 'OR-154dn75',
	name: 'Amsab-ISG',
	descriptionNl:
		'Amsab-ISG is het Instituut voor Sociale Geschiedenis. Het bewaart, ontsluit, onderzoekt en valoriseert het erfgoed van sociale en humanitaire bewegingen.',
	serviceDescriptionNl: 'Vraag meer info aan de balie.',
	descriptionEn:
		'Amsab-ISG is the Institute for Social History. It preserves, discloses, researches, and valorizes the heritage of social and humanitarian movements.',
	serviceDescriptionEn: 'Request more info at the receptiondesk.',
	image: '',
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
	status: VisitorSpaceStatus.Active,
	publishedAt: null,
	createdAt: '2022-01-13T13:10:14.41978',
	updatedAt: '2022-01-13T13:10:14.41978',
	info: 'info',
};
