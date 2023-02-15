export interface MaterialRequest {
	createdAt: string;
	id: string;
	isPending: boolean;
	maintainerId: string;
	maintainerName: string;
	maintainerSlug: string;
	objectSchemaIdentifier: string;
	profileId: string;
	reason: string;
	requesterFullName: string;
	requesterId: string;
	requesterMail: string;
	type: MaterialRequestType;
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
}

export type MaterialRequestRow = { row: { original: MaterialRequest } };
