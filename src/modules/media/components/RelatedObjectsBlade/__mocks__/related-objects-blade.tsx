import { MediaObject } from '@media/components/RelatedObject/RelatedObject.types';
import { Icon } from '@shared/components';

import { RelatedObjectsBladeProps } from '../RelatedObjectsBlade.types';

export const relatedObjectsBladeMock: RelatedObjectsBladeProps = {
	icon: <Icon className="u-font-size-24" name="related-objects" />,
	title: '3 gerelateerde objecten',
	content: () => <div>content</div>,
};

export const relatedObjectsBladeObjects: MediaObject[] = [
	{
		id: 'relatedObjectVideoMock',
		type: 'video',
		title: 'GIVE: Gecoördineerd Initiatief voor Vlaamse Erfgoeddigitalisering',
		subtitle: '(01 jan. 1970)',
		thumbnail: '/images/bg-shd.png',
		description:
			'GIVE, het Gecoördineerd Initiatief voor Vlaamse Erfgoeddigitalisering, vormt de paraplu voor vier digitaliseringsprojecten die tegen eind 2023 uitgevoerd zullen worden. Samen met heel wat partners uit het culturele veld zet meemoo zijn schouders onder de digitalisering van kranten, glasplaten en topstukken. Daarnaast zetten we in op metadataverrijking.',
	},
	{
		id: 'relatedObjectVideoMock',
		type: 'video',
		title: 'GIVE: Gecoördineerd Initiatief voor Vlaamse Erfgoeddigitalisering',
		subtitle: '(01 jan. 1970)',
		thumbnail: '/images/bg-shd.png',
		description:
			'GIVE, het Gecoördineerd Initiatief voor Vlaamse Erfgoeddigitalisering, vormt de paraplu voor vier digitaliseringsprojecten die tegen eind 2023 uitgevoerd zullen worden. Samen met heel wat partners uit het culturele veld zet meemoo zijn schouders onder de digitalisering van kranten, glasplaten en topstukken. Daarnaast zetten we in op metadataverrijking.',
	},
	{
		id: 'relatedObjectVideoMock',
		type: 'video',
		title: 'GIVE: Gecoördineerd Initiatief voor Vlaamse Erfgoeddigitalisering',
		subtitle: '(01 jan. 1970)',
		thumbnail: '/images/bg-shd.png',
		description:
			'GIVE, het Gecoördineerd Initiatief voor Vlaamse Erfgoeddigitalisering, vormt de paraplu voor vier digitaliseringsprojecten die tegen eind 2023 uitgevoerd zullen worden. Samen met heel wat partners uit het culturele veld zet meemoo zijn schouders onder de digitalisering van kranten, glasplaten en topstukken. Daarnaast zetten we in op metadataverrijking.',
	},
];
