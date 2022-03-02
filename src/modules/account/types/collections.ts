export interface Collection {
	createdAt: string;
	id: string;
	isDefault: boolean;
	name: string;
	updatedAt: string;
	userProfileId: string;
}

export interface CollectionMedia {
	collectionEntryCreatedAt: string;
	creator: Record<string, unknown> | null;
	format: 'video' | string;
	id: string;
	name: string;
	numberOfPages: unknown;
	termsAvailable: string;
	thumbnailUrl: string;
}

export interface CreateCollectionFormState {
	name?: string;
}

export type EditCollectionFormState = CreateCollectionFormState;
