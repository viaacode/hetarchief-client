import { DefaultComponentProps } from '@shared/types';

export interface MediaObject {
	type: 'video' | 'audio';
	title: string;
	subtitle: string;
	description: string;
	thumbnail: string;
	id: string;
}

export interface RelatedObjectProps extends DefaultComponentProps {
	object: MediaObject;
}
