import type { IeObject } from '@ie-objects/ie-objects.types';

export type IeObjectSeo = Pick<
	IeObject,
	'name' | 'description' | 'thumbnailUrl' | 'maintainerSlug'
>;

export interface IeObjectPreviousNextIds {
	previousIeObjectId: string | null;
	nextIeObjectId: string | null;
}
