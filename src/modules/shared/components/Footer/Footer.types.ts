import { footerType } from './Footer.constants';

export interface IFooterProps {
	type: footerType;
	links: IFooterLink[];
	onClickFeedback?: () => void;
}

export interface IFooterLink {
	label: string;
	to: string;
	external?: boolean;
}
