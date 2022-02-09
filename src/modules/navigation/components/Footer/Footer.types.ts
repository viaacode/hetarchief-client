import { ComponentLink } from '@shared/types';

export interface FooterProps {
	links?: ComponentLink[];
	leftItem: FooterItem;
	rightItem: FooterItem;
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
