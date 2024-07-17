import {
	type IeObjectAccessThrough,
	type IeObjectLicense,
	type IsPartOfKey,
} from '@ie-objects/ie-objects.types';
import { type IeObjectType } from '@shared/types/ie-objects';

export interface Folder {
	createdAt: string;
	id: string;
	isDefault: boolean;
	name: string;
	description?: string;
	updatedAt: string;
	userProfileId: string;
	usedForLimitedAccessUntil: string | null;
	objects?: Pick<FolderIeObject, 'schemaIdentifier'>[];
}

export interface FolderIeObject {
	schemaIdentifier: string; // Unique id per object
	meemooLocalId: string[];
	accessThrough: IeObjectAccessThrough[];
	premisIsPartOf?: string;
	folderEntryCreatedAt?: string;
	creator?: unknown;
	description: string;
	duration: string;
	dctermsFormat: IeObjectType | null;
	name: string;
	numberOfPages?: unknown;
	termsAvailable: string;
	thumbnailUrl: string;
	maintainerId: string;
	maintainerName: string;
	maintainerSlug: string;
	isPartOf?: Partial<Record<IsPartOfKey, string[]>>;
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
