export interface HeroProps {
	title: string;
	description: string;
	link: HeroLink;
	image: HeroImage;
}

export interface HeroLink {
	label: string;
	to: string;
	external?: boolean;
}

export interface HeroImage {
	name: string;
	alt?: string;
}
