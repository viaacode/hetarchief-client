export interface Collection {
	createdAt: string;
	id: string;
	isDefault: boolean;
	name: string;
	updatedAt: string;
	userProfileId: string;
}

export interface CreateCollectionFormState {
	name?: string;
}
