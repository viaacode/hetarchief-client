import { RelatedObjectProps } from '../RelatedObject.types';

export const relatedObjectVideoMock: RelatedObjectProps = {
	object: {
		id: 'relatedObjectVideoMock',
		type: 'video',
		title: 'GIVE: Gecoördineerd Initiatief voor Vlaamse Erfgoeddigitalisering',
		subtitle: 'Digitaliseren | Toegang & hergebruik',
		thumbnail: '/images/bg-shd.png',
		description:
			'GIVE, het Gecoördineerd Initiatief voor Vlaamse Erfgoeddigitalisering, vormt de paraplu voor vier digitaliseringsprojecten die tegen eind 2023 uitgevoerd zullen worden. Samen met heel wat partners uit het culturele veld zet meemoo zijn schouders onder de digitalisering van kranten, glasplaten en topstukken. Daarnaast zetten we in op metadataverrijking.',
	},
};

export const relatedObjectEmptyMock: RelatedObjectProps = {
	object: { ...relatedObjectVideoMock.object, thumbnail: undefined },
};
