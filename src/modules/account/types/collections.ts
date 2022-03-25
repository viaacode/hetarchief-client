import { MediaTypes } from '@shared/types';

export interface Collection {
	createdAt: string;
	id: string;
	isDefault: boolean;
	name: string;
	updatedAt: string;
	userProfileId: string;
	objects?: Pick<CollectionMedia, 'schemaIdentifier'>[];
}

export interface CollectionMedia {
	collectionEntryCreatedAt: string;
	creator: unknown | null;
	description: string;
	format: MediaTypes;
	schemaIdentifier: string;
	name: string;
	numberOfPages: unknown;
	termsAvailable: string;
	thumbnailUrl: string;
	maintainerId: string;
	maintainerName: string;
	readingRoomId: string;
}

export interface CreateCollectionFormState {
	name?: string;
}

export type EditCollectionFormState = CreateCollectionFormState;
