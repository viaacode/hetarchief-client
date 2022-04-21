export enum NavigationPlacement {
	HeaderLeft = 'header_left',
	FooterCenter = 'footer_center',
}

export interface NavigationInfo {
	id: string;
	label: string;
	placement: string;
	description?: string | null;
	linkTarget?: string | null;
	iconName: string | null;
	position: number;
	contentType: string;
	contentPath: string;
	tooltip: string | null;
	updatedAt: string;
	createdAt: string;
}
