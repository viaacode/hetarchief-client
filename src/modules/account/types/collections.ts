import type { IPagination } from '@studiohyperdrive/pagination';

import { IeObjectLicense } from '@ie-objects/types';
import { IeObjectTypes } from '@shared/types';
import { AccessThroughType } from '@shared/types/access';

export type GetFoldersResponse = IPagination<Folder>;

export interface Folder {
	createdAt: string;
	id: string;
	isDefault: boolean;
	name: string;
	updatedAt: string;
	userProfileId: string;
	usedForLimitedAccessUntil: string | null;
	objects?: Pick<FolderIeObject, 'schemaIdentifier'>[];
}

export interface FolderIeObject {
	schemaIdentifier: string; // Unique id per object
	meemooIdentifier: string; // PID: not unique per object
	meemooLocalId: string;
	accessThrough: AccessThroughType[];
	premisIsPartOf?: string;
	collectionEntryCreatedAt?: string;
	creator?: unknown;
	description: string;
	duration: string;
	dctermsFormat: IeObjectTypes;
	name: string;
	numberOfPages?: unknown;
	termsAvailable: string;
	thumbnailUrl: string;
	maintainerId: string;
	maintainerName: string;
	maintainerSlug: string;
	series: string[];
	programs: string[];
	datePublished?: string;
	dateCreatedLowerBound?: string;
	licenses: IeObjectLicense[];
}

export interface CreateFolderFormState {
	name?: string;
}

export enum SharedFolderStatus {
	ADDED = 'ADDED',
	ALREADY_OWNER = 'ALREADY_OWNER',
}

export interface SharedFolderResponse {
	folderId: string;
	folderName: string;
	status: SharedFolderStatus;
}

export type EditFolderFormState = CreateFolderFormState;
