import type { HetArchiefIeObject } from '@viaa/avo2-types';

export type IeObjectSeo = Pick<
	HetArchiefIeObject,
	'name' | 'description' | 'thumbnailUrl' | 'maintainerSlug'
>;

export interface IeObjectPreviousNextIds {
	previousIeObjectId: string | null;
	nextIeObjectId: string | null;
}
