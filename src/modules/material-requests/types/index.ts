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
	isArchived: boolean;
	status: MaterialRequestStatus;
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
	objectRepresentationId?: string;
	objectRepresentation?: IeObjectRepresentation;
	profileId: string;
	reason: string;
	requesterCapacity: MaterialRequestRequesterCapacity;
	requesterFullName: string;
	requesterId: string;
	requesterMail: string;
	requesterOrganisation?: string;
	requesterOrganisationSector?: string;
	type: MaterialRequestType;
	reuseForm?: MaterialRequestReuseForm;
	updatedAt: string;
	requestedAt: string;
	requestGroupName: string | null;
	requestGroupId: string | null;
	downloadStatus: MaterialRequestDownloadStatus | null;
	downloadAvailableAt?: string;
	downloadExpiresAt?: string;
	history: MaterialRequestEvent[];
}

export interface MaterialRequestEvent {
	id: string;
	materialRequestId: string;
	messageType: MaterialRequestEventType;
	body: MaterialRequestMessageBody;
	createdAt: string;
	senderProfile?: {
		id: string;
		mail: string;
		firstName: string;
		lastName: string;
		organisation: {
			id: string;
			name: string;
		};
	};
}

export interface MaterialRequestAttachment {
	id: string;
	attachmentUrl: string;
	attachmentFilename: string;
	createdAt: string;
}

export enum MaterialRequestAdditionalConditionsType {
	PERMISSION_LICENSE_OWNER = 'PERMISSION_LICENSE_OWNER',
	ATTRIBUTION = 'ATTRIBUTION',
	PAYMENT = 'PAYMENT',
	EXTRA_USE_LIMITATION = 'EXTRA_USE_LIMITATION',
}

interface Condition {
	type: MaterialRequestAdditionalConditionsType;
	text: string;
}

export interface MaterialRequestMessageBodyMessage {
	message: string;
}

export interface MaterialRequestMessageBodyAdditionalConditions {
	conditions: Condition[];
	autoApproveAfterAcceptAdditionalConditions: boolean;
}

export interface MaterialRequestMessageBodyStatusUpdateWithMotivation {
	motivation: string;
}

export type MaterialRequestMessageBody =
	| MaterialRequestMessageBodyMessage
	| MaterialRequestMessageBodyAdditionalConditions
	| MaterialRequestMessageBodyStatusUpdateWithMotivation;

export interface MaterialRequestMessage extends MaterialRequestEvent {
	attachments?: MaterialRequestAttachment[];
}

export enum MaterialRequestReuseFormKey {
	representationId = 'representationId',
	thumbnailUrl = 'thumbnailUrl',
	startTime = 'startTime',
	endTime = 'endTime',
	durationType = 'durationType',
	downloadQuality = 'downloadQuality',
	intendedUsageDescription = 'intendedUsageDescription',
	intendedUsage = 'intendedUsage',
	distributionAccess = 'distributionAccess',
	distributionType = 'distributionType',
	distributionTypeDigitalOnline = 'distributionTypeDigitalOnline',
	distributionTypeOtherExplanation = 'distributionTypeOtherExplanation',
	materialEditing = 'materialEditing',
	geographicalUsage = 'geographicalUsage',
	geographicalUsageDescription = 'geographicalUsageDescription',
	timeUsageType = 'timeUsageType',
	timeUsageFrom = 'timeUsageFrom',
	timeUsageTo = 'timeUsageTo',
	copyrightDisplay = 'copyrightDisplay',
}

export enum MaterialRequestDurationType {
	FULL = 'FULL',
	PARTIAL = 'PARTIAL',
}

export interface MaterialRequestReuseForm {
	representationId: string | undefined;
	startTime: number | undefined;
	endTime: number | undefined;
	durationType: MaterialRequestDurationType | undefined;
	downloadQuality: MaterialRequestDownloadQuality | undefined;
	intendedUsageDescription: string | undefined;
	intendedUsage: MaterialRequestIntendedUsage | undefined;
	distributionAccess: MaterialRequestDistributionAccess | undefined;
	distributionType: MaterialRequestDistributionType | undefined;
	distributionTypeDigitalOnline: MaterialRequestDistributionDigitalOnline | undefined;
	distributionTypeOtherExplanation: string | undefined;
	materialEditing: MaterialRequestEditing | undefined;
	geographicalUsage: MaterialRequestGeographicalUsage | undefined;
	geographicalUsageDescription: string | undefined;
	timeUsageType: MaterialRequestTimeUsage | undefined;
	timeUsageFrom?: string | undefined;
	timeUsageTo: string | undefined;
	copyrightDisplay: MaterialRequestCopyrightDisplay | undefined;
	thumbnailUrl?: string;
}

export interface MaterialRequestDetail extends MaterialRequest {
	requesterUserGroupDescription: string;
	requesterUserGroupId: string;
	requesterUserGroupLabel: string;
	requesterUserGroupName: string;
}

export interface MaterialRequestCreation {
	objectId: string;
	objectRepresentationId: string | undefined;
	type: MaterialRequestType;
	reason: string;
	requesterCapacity: MaterialRequestRequesterCapacity;
	organisation?: string;
	reuseForm?: MaterialRequestReuseForm;
}

export interface MaterialRequestUpdate {
	type: MaterialRequestType;
	reason: string;
	requesterCapacity: MaterialRequestRequesterCapacity;
	organisation?: string;
	reuseForm?: MaterialRequestReuseForm;
}

export interface MaterialRequestSendAll {
	type: MaterialRequestRequesterCapacity;
	organisation?: string;
	requestGroupName?: string;
}

export enum MaterialRequestType {
	REUSE = 'REUSE',
	MORE_INFO = 'MORE_INFO',
	VIEW = 'VIEW',
}

export enum MaterialRequestStatus {
	NEW = 'NEW',
	PENDING = 'PENDING',
	APPROVED = 'APPROVED',
	DENIED = 'DENIED',
	CANCELLED = 'CANCELLED',
	NONE = 'NONE',
}

export enum MaterialRequestEventType {
	MESSAGE = 'MESSAGE',
	APPROVED = 'APPROVED',
	DENIED = 'DENIED',
	CANCELLED = 'CANCELLED',
	ADDITIONAL_CONDITIONS = 'ADDITIONAL_CONDITIONS',
	ADDITIONAL_CONDITIONS_ACCEPTED = 'ADDITIONAL_CONDITIONS_ACCEPTED',
	ADDITIONAL_CONDITIONS_DENIED = 'ADDITIONAL_CONDITIONS_DENIED',
	DOWNLOAD_AVAILABLE = 'DOWNLOAD_AVAILABLE',
	DOWNLOAD_EXPIRED = 'DOWNLOAD_EXPIRED',
	FINAL_SUMMARY = 'FINAL_SUMMARY',
	REUSE_SUMMARY = 'REUSE_SUMMARY',
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
	objectSchemaName = 'objectSchemaName',
	maintainerName = 'maintainerName',
	type = 'type',
	requestGroupName = 'requestGroupName',
	requesterFullName = 'requesterFullName',
	requesterMail = 'requesterMail',
	createdAt = 'createdAt',
	requestedAt = 'requestedAt',
	status = 'status',
	downloadStatus = 'downloadStatus',
}

export type MaterialRequestRow = { row: { original: MaterialRequest } };

export enum MaterialRequestDownloadQuality {
	NORMAL = 'NORMAL',
	HIGH = 'HIGH',
}

export enum MaterialRequestIntendedUsage {
	INTERN = 'INTERN',
	NON_COMMERCIAL = 'NON_COMMERCIAL',
	COMMERCIAL = 'COMMERCIAL',
}

export enum MaterialRequestDistributionAccess {
	INTERN = 'INTERN',
	INTERN_EXTERN = 'INTERN_EXTERN',
}

export enum MaterialRequestDistributionType {
	DIGITAL_OFFLINE = 'DIGITAL_OFFLINE',
	DIGITAL_ONLINE = 'DIGITAL_ONLINE',
	OTHER = 'OTHER',
}

export enum MaterialRequestDistributionDigitalOnline {
	INTERNAL = 'INTERNAL',
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

export enum MaterialRequestDownloadStatus {
	/** download job failed */
	FAILED = 'FAILED',
	/** download was triggered, but job has not been fetched yet */
	NEW = 'NEW',
	/** download was triggered, and mam export job is in progress */
	PENDING = 'PENDING',
	/** download job succeeded, download_url filled in */
	SUCCEEDED = 'SUCCEEDED',
	/** download has expired */
	EXPIRED = 'EXPIRED',
}
