import { ComponentLink } from '@shared/types';

export interface FooterProps {
	children?: React.ReactNode;
	linkSections: ComponentLink[][];
}

export interface FooterImage {
	name: string;
	alt?: string;
	width: number;
	height: number;
}

export interface FooterItem {
	label: string;
	image: FooterImage;
	link: ComponentLink;
}
