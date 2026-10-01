import type { MediaObject } from '@ie-objects/components/RelatedObject';

export interface ObjectDetailPageRelatedTabProps {
	items: MediaObject[];
	/** True when `items` is the parent of the current object, rather than its children/fragments. */
	isParent: boolean;
}
