import { tText } from '@shared/helpers/translate';
import type { IeObjectType } from '@shared/types/ie-objects';

export interface MaterialRequest {
	createdAt: string;
	id: string;
	isPending: boolean;
	maintainerId: string;
	maintainerLogo: string;
	maintainerName: string;
	maintainerSlug: string;
	objectDctermsFormat: IeObjectType;
	objectSchemaIdentifier: string;
	objectSchemaName: string;
	profileId: string;
	reason: string;
	requesterCapacity: MaterialRequestRequesterCapacity;
	requesterFullName: string;
	requesterId: string;
	requesterMail: string;
	type: MaterialRequestType;
	updatedAt: string;
	organisation?: string;
}

export interface MaterialRequestDetail extends MaterialRequest {
	requesterUserGroupDescription: string;
	requesterUserGroupId: string;
	requesterUserGroupLabel: string;
	requesterUserGroupName: string;
}

export interface MaterialRequestCreation {
	objectId: string;
	type: MaterialRequestType;
	reason: string;
	requesterCapacity: MaterialRequestRequesterCapacity;
	organisation?: string;
}

export interface MaterialRequestUpdate {
	type: MaterialRequestType;
	reason: string;
	requesterCapacity: MaterialRequestRequesterCapacity;
	organisation?: string;
}

export interface MaterialRequestSendAll {
	type: MaterialRequestRequesterCapacity;
	organisation?: string;
}

export enum MaterialRequestType {
	REUSE = 'REUSE',
	MORE_INFO = 'MORE_INFO',
	VIEW = 'VIEW',
}

export enum MaterialRequestRequesterCapacity {
	OTHER = 'OTHER',
	WORK = 'WORK',
	PRIVATE_RESEARCH = 'PRIVATE_RESEARCH',
	EDUCATION = 'EDUCATION',
}

export const GET_MATERIAL_REQUEST_REQUESTER_CAPACITY_ARRAY = (): {
	id: string;
	label: string;
}[] => [
	{
		id: MaterialRequestRequesterCapacity.OTHER,
		label: tText('modules/admin/const/material-requests___requester-capacity-other'),
	},
	{
		id: MaterialRequestRequesterCapacity.WORK,
		label: tText('modules/admin/const/material-requests___requester-capacity-work'),
	},
	{
		id: MaterialRequestRequesterCapacity.PRIVATE_RESEARCH,
		label: tText(
			'modules/admin/const/material-requests___requester-capacity-private-researcher'
		),
	},
	{
		id: MaterialRequestRequesterCapacity.EDUCATION,
		label: tText('modules/admin/const/material-requests___requester-capacity-education'),
	},
];

export const GET_MATERIAL_REQUEST_REQUESTER_CAPACITY_RECORD = (): Record<string, string> =>
	Object.fromEntries(
		GET_MATERIAL_REQUEST_REQUESTER_CAPACITY_ARRAY().map(({ id, label }) => [id, label])
	);

export interface MaterialRequestMaintainer {
	id: string;
	name: string;
}

export enum MaterialRequestKeys {
	createdAt = 'createdAt',
	updatedAt = 'updatedAt',
	type = 'type',
	name = 'requesterFullName',
	email = 'requesterMail',
	maintainer = 'maintainerName',
	material = 'objectSchemaName',
}

export type MaterialRequestRow = { row: { original: MaterialRequest } };
