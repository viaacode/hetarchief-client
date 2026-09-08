import type { IeObjectType } from '@shared/types/ie-objects';
import type {
	HetArchiefIeObjectAccessThrough,
	HetArchiefIeObjectLicense,
	HetArchiefIsPartOfKey,
} from '@viaa/avo2-types';

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
	meemooLocalId: string;
	accessThrough: HetArchiefIeObjectAccessThrough[];
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
	/** Whether the current user may see/play this object's essence, as reported by the proxy */
	hasAccessToEssence?: boolean;
	maintainerId: string;
	maintainerName: string;
	maintainerSlug: string;
	isPartOf?: Partial<Record<HetArchiefIsPartOfKey, string[]>>;
	datePublished?: string;
	dateCreatedLowerBound?: string;
	licenses: HetArchiefIeObjectLicense[];
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
