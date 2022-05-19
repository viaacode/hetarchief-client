import { VisitorSpaceInfo } from '@reading-room/types';

export type AdminReadingRoomInfoRow = { row: { original: VisitorSpaceInfo } };

// User groups

export interface UserGroupOverviewRef {
	onCancel: () => void;
	onSave: () => void;
	onSearch: (value?: string) => void;
}

export interface UserGroupArchief {
	id: number | string;
	name: string;
	permissions: PermissionData[];
}

export interface UserGroupUpdates {
	updates: UserGroupUpdate[];
}

export interface UserGroupUpdate {
	userGroupId: string;
	permissionId: string;
	hasPermission: boolean;
}

export interface UserGroupUpdateResponse {
	deleted: number;
	inserted: number;
}

// Permissions

export interface PermissionData {
	id: string;
	label: string;
	name: string;
	description: string;
}
