export interface MaterialRequest {
	createdAt: string;
	id: string;
	isPending: boolean;
	maintainerId: string;
	maintainerName: string;
	maintainerSlug: string;
	objectSchemaIdentifier: string;
	objectSchemaName: string;
	profileId: string;
	reason: string;
	requesterFullName: string;
	requesterId: string;
	requesterMail: string;
	type: MaterialRequestType;
	updatedAt: string;
}

export interface MaterialRequestDetails {
	createdAt: string;
	id: string;
	isPending: boolean;
	maintainerId: string;
	maintainerLogo: string;
	maintainerName: string;
	maintainerSlug: string;
	meemooIdentifier: string;
	objectSchemaIdentifier: string;
	objectSchemaName: string;
	organisation?: string;
	profileId: string;
	reason: string;
	requesterFullName: string;
	requesterId: string;
	requesterMail: string;
	requesterUserGroupDescription: string;
	requesterUserGroupId: string;
	requesterUserGroupLabel: string;
	requesterUserGroupName: string;
	type: string;
	updatedAt: string;
}

export enum MaterialRequestType {
	REUSE = 'REUSE',
	MORE_INFO = 'MORE_INFO',
	VIEW = 'VIEW',
}

export enum MaterialRequestKeys {
	createdAt = 'createdAt',
	type = 'type',
	name = 'requesterFullName',
	email = 'requesterMail',
	maintainer = 'maintainerName',
	material = 'objectSchemaName',
}

export type MaterialRequestRow = { row: { original: MaterialRequest } };
