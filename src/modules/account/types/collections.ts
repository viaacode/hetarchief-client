export interface Collection {
	createdAt: string;
	id: string;
	isDefault: boolean;
	name: string;
	updatedAt: string;
	userProfileId: string;
	objects?: Pick<CollectionMedia, 'meemooFragmentId'>[];
}

export interface CollectionMedia {
	collectionEntryCreatedAt: string;
	creator: unknown | null;
	description: string;
	format: 'video' | 'audio' | 'film' | string; // TODO extend with all options
	meemooFragmentId: string;
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
