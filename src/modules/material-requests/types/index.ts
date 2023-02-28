import { tText } from '@shared/helpers/translate';

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

export interface MaterialRequestDetail extends MaterialRequest {
	maintainerLogo: string;
	objectMeemooIdentifier: string;
	objectType?: 'audio' | 'video' | 'film';
	organisation?: string;
	requesterCapacity: MaterialRequestRequesterCapacity;
	requesterUserGroupDescription: string;
	requesterUserGroupId: string;
	requesterUserGroupLabel: string;
	requesterUserGroupName: string;
}

export enum MaterialRequestType {
	REUSE = 'REUSE',
	MORE_INFO = 'MORE_INFO',
	VIEW = 'VIEW',
}

export enum MaterialRequestRequesterCapacity {
	OTHER = 'OTHER',
	WORK = 'WORK',
	PRIVATE_RESEARCHER = 'PRIVATE_RESEARCHER',
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
		id: MaterialRequestRequesterCapacity.PRIVATE_RESEARCHER,
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
	GET_MATERIAL_REQUEST_REQUESTER_CAPACITY_ARRAY().reduce(
		(
			acc: Record<string, string>,
			curr: { id: string | number; label: string }
		): Record<string, string> => ({ ...acc, [curr.id]: curr.label }),
		{}
	);

export interface MaterialRequestMaintainer {
	id: string;
	name: string;
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
