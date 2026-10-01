import type { MediaObject } from '@ie-objects/components/RelatedObject';

export interface IeObjectCardListProps {
	/** 'similar' picks up the "ook interessant" grey-bleed treatment; 'related' the plain list. */
	type: 'similar' | 'related';
	items: MediaObject[];
	className?: string;
}
