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
	schemaIdentifier: string; // Unique id per object
	meemooIdentifier: string; // PID: not unique per object
	collectionEntryCreatedAt?: string;
	creator?: unknown;
	description: string;
	format: MediaTypes;
	name: string;
	numberOfPages?: unknown;
	termsAvailable: string;
	thumbnailUrl: string;
	maintainerId: string;
	maintainerName: string;
	readingRoomId: string;
	series: string[];
	programs: string[];
	datePublished?: string;
	dateCreatedLowerBound?: string;
}

export interface CreateCollectionFormState {
	name?: string;
}

export type EditCollectionFormState = CreateCollectionFormState;
