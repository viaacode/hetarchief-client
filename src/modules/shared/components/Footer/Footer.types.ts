import { footerType } from './Footer.constants';

export interface IFooterProps {
	type: footerType;
	links: IFooterLink[];
	leftItem: IFooterItem;
	rightItem: IFooterItem;
	onClickFeedback?: () => void;
}

export interface IFooterLink {
	label: string;
	to: string;
	external?: boolean;
}

export interface IFooterImage {
	name: string;
	alt?: string;
	width: number;
	height: number;
}

export interface IFooterItem {
	label: string;
	image: IFooterImage;
	link: IFooterLink;
}
