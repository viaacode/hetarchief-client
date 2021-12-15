export interface FooterProps {
	links?: FooterLink[];
	leftItem: FooterItem;
	rightItem: FooterItem;
	floatingActionButton?: any; // TODO: button component type
}

export interface FooterLink {
	label: string;
	to: string;
	external?: boolean;
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
	link: FooterLink;
}
