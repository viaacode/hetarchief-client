import type {
	IeObjectAccessThrough,
	IeObjectLicense,
	IeObjectRepresentation,
} from '@ie-objects/ie-objects.types';
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
	objectId: string;
	objectSchemaIdentifier: string;
	objectSchemaName: string;
	objectThumbnailUrl: string;
	objectPublishedOrCreatedDate?: string;
	objectAccessThrough: IeObjectAccessThrough[];
	objectLicences: IeObjectLicense[];
	objectRepresentation: IeObjectRepresentation;
	profileId: string;
	reason: string;
	requesterCapacity: MaterialRequestRequesterCapacity;
	requesterFullName: string;
	requesterId: string;
	requesterMail: string;
	type: MaterialRequestType;
	reuseForm?: MaterialRequestReuseForm;
	updatedAt: string;
	organisation?: string;
}

export interface MaterialRequestReuseForm {
	startTime?: number;
	endTime?: number;
	downloadQuality?: MaterialRequestDownloadQuality;
	intendedUsage?: string;
	exploitation?: MaterialRequestExploitation;
	distributionAccess?: MaterialRequestDistributionAccess;
	distributionType?: MaterialRequestDistributionType;
	distributionTypeDigitalOnline?: MaterialRequestDistributionDigitalOnline;
	distributionTypeOtherExplanation?: string;
	materialEditing?: MaterialRequestEditing;
	geographicalUsage?: MaterialRequestGeographicalUsage;
	timeUsageType?: MaterialRequestTimeUsage;
	timeUsageFrom?: string;
	timeUsageTo?: string;
	copyrightDisplay?: MaterialRequestCopyrightDisplay;
}

export interface MaterialRequestDetail extends MaterialRequest {
	requesterUserGroupDescription: string;
	requesterUserGroupId: string;
	requesterUserGroupLabel: string;
	requesterUserGroupName: string;
}

export interface MaterialRequestCreation {
	objectSchemaIdentifier: string;
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
		label: tText('modules/admin/const/material-requests___requester-capacity-private-researcher'),
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

export enum MaterialRequestDownloadQuality {
	NORMAL = 'NORMAL',
	HIGH = 'HIGH',
}

export enum MaterialRequestExploitation {
	INTERN = 'INTERN',
	NON_COMMERCIAL = 'NON_COMMERCIAL',
	INDIRECT_COMMERCIAL = 'INDIRECT_COMMERCIAL',
	COMMERCIAL = 'COMMERCIAL',
}

export enum MaterialRequestDistributionAccess {
	INTERN = 'INTERN',
	INTERN_EXTERN = 'INTERN_EXTERN',
}

export enum MaterialRequestDistributionType {
	ANALOG = 'ANALOG',
	DIGITAL_OFFLINE = 'DIGITAL_OFFLINE',
	DIGITAL_ONLINE = 'DIGITAL_ONLINE',
	OTHER = 'OTHER',
}

export enum MaterialRequestDistributionDigitalOnline {
	NO_AUTH = 'NO_AUTH',
	WITH_AUTH = 'WITH_AUTH',
}

export enum MaterialRequestEditing {
	NONE = 'NONE',
	WITH_CHANGES = 'WITH_CHANGES',
}

export enum MaterialRequestGeographicalUsage {
	COMPLETELY_LOCAL = 'COMPLETELY_LOCAL',
	NOT_COMPLETELY_LOCAL = 'NOT_COMPLETELY_LOCAL',
}

export enum MaterialRequestTimeUsage {
	UNLIMITED = 'UNLIMITED',
	IN_TIME = 'IN_TIME',
}

export enum MaterialRequestCopyrightDisplay {
	SAME_TIME_WITH_OBJECT = 'SAME_TIME_WITH_OBJECT',
	AROUND_OBJECT = 'AROUND_OBJECT',
	NONE = 'NONE',
}
