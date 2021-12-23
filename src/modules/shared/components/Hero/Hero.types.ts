import { ComponentLink } from '@shared/types';

export interface HeroProps {
	title: string;
	description: string;
	link: ComponentLink;
	image: HeroImage;
}

export interface HeroImage {
	name: string;
	alt?: string;
}
