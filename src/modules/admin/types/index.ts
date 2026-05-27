import type { VisitorSpaceInfo } from '@visitor-space/types';

export type AdminVisitorSpaceInfoRow = { row: { original: VisitorSpaceInfo } };

// User groups
export interface UserGroupOverviewRef {
	onCancel: () => void;
	onSave: () => void;
	onSearch: (value?: string) => void;
}

// Content partners

export interface ContentPartner {
	name: string;
	id: string;
}

export interface ContentPartnerResponse {
	items: ContentPartner[];
}
