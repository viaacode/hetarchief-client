import type { IeObjectType } from '@shared/types/ie-objects';

export interface GetContentBlockEncloseContentReturnType {
	id?: string;
	name?: string;
	description?: string;
	thumbnail?: string;
	/** Ie-objects only: whether the current user may see/play the essence, as reported by the proxy */
	hasAccessToEssence?: boolean;
	dateCreated?: string;
	datePublished?: string;
	maintainerName?: string;
	maintainerSlug?: string;
	objectType: IeObjectType | null;
	identifier?: string;
	link: string;
	pid?: string;
	type: 'IE_OBJECT' | 'CONTENT_PAGE';
}

export interface ContentPage {
	id: string;
	title: string;
	description: string;
	thumbnailPath: string;
	createdAt: string;
	publishedAt: string;
	path: string;
}
