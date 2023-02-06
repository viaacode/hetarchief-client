import { ApiResponseWrapper, MediaTypes } from '@shared/types';

export type GetFoldersResponse = ApiResponseWrapper<Folder>;

export interface Folder {
	createdAt: string;
	id: string;
	isDefault: boolean;
	name: string;
	updatedAt: string;
	userProfileId: string;
	objects?: Pick<FolderMedia, 'schemaIdentifier'>[];
}

export interface FolderMedia {
	schemaIdentifier: string; // Unique id per object
	meemooIdentifier: string; // PID: not unique per object
	meemooLocalId: string;
	premisIsPartOf?: string;
	collectionEntryCreatedAt?: string;
	creator?: unknown;
	description: string;
	duration: string;
	format: MediaTypes;
	name: string;
	numberOfPages?: unknown;
	termsAvailable: string;
	thumbnailUrl: string;
	maintainerId: string;
	maintainerName: string;
	visitorSpaceSlug: string;
	series: string[];
	programs: string[];
	datePublished?: string;
	dateCreatedLowerBound?: string;
}

export interface CreateFolderFormState {
	name?: string;
}

export type EditFolderFormState = CreateFolderFormState;
