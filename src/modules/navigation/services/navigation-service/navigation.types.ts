export enum NavigationPlacement {
	HeaderLeft = 'header_left',
	HeaderRight = 'header_right',
	FooterCenter = 'footer_center',
	ProfileDropdown = 'profile_dropdown',
	FooterSection1 = 'footer_section_1',
	FooterSection2 = 'footer_section_2',
	FooterSection3 = 'footer_section_3',
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
